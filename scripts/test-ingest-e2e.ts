// Simulates the real ingest route's validation + routing logic end to end
// (everything up to the database write) for all four sources, using the
// exact same Zod schema and parser-routing code path as the live route.
// Run with: npx tsx scripts/test-ingest-e2e.ts
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { parseOpenTelemetryTrace } from "../src/lib/parsers/opentelemetry";
import { parseLangSmithTrace } from "../src/lib/parsers/langsmith";
import { parseAgentOpsTrace } from "../src/lib/parsers/agentops";
import { parseManualJsonTrace } from "../src/lib/parsers/manualJson";

const RawEvent = z.object({
  agent_name: z.string().optional(),
  event_type: z.enum(["agent_action", "tool_call", "api_call", "model_call", "human_intervention", "error", "system_event"]),
  occurred_at: z.string().nullable().optional(),
  summary: z.string().optional(),
  data: z.record(z.any()).optional(),
});

const IngestBody = z.object({
  ai_system_id: z.string().uuid(),
  source: z.enum(["opentelemetry", "langsmith", "agentops", "mcp_logs", "api_history", "manual_json"]),
  events: z.array(RawEvent).min(1).optional(),
  payload: z.union([z.record(z.any()), z.array(z.any())]).optional(),
});

function load(name: string) {
  return JSON.parse(readFileSync(join(__dirname, "fixtures", name), "utf-8"));
}

function simulateIngest(source: string, rawUpload: any) {
  const parsed = IngestBody.safeParse({
    ai_system_id: "00000000-0000-0000-0000-000000000000",
    source,
    payload: rawUpload,
  });

  if (!parsed.success) {
    return { ok: false, error: "invalid payload: " + JSON.stringify(parsed.error.issues) };
  }

  const { payload } = parsed.data;
  let events;

  if (source === "opentelemetry") events = parseOpenTelemetryTrace(payload);
  else if (source === "langsmith") events = parseLangSmithTrace(payload);
  else if (source === "agentops") events = parseAgentOpsTrace(payload);
  else if (source === "manual_json") events = parseManualJsonTrace(payload);
  else return { ok: false, error: `No parser yet for source "${source}"` };

  if (!events || events.length === 0) {
    return { ok: false, error: "Provide either 'events' or 'payload' for a supported source." };
  }

  return { ok: true, count: events.length };
}

console.log("End-to-end ingest simulation for all four sources:\n");

const cases: [string, string][] = [
  ["opentelemetry", "opentelemetry-export.json"],
  ["agentops", "agentops-export.json"],
  ["langsmith", "langsmith-export.json"],
  ["manual_json", "manual-json-export.json"],
];

let allPass = true;
for (const [source, fixture] of cases) {
  const result: any = simulateIngest(source, load(fixture));
  const pass = result.ok;
  allPass = allPass && pass;
  console.log(`${pass ? "PASS" : "FAIL"} — ${source}: ${pass ? `${result.count} events imported` : result.error}`);
}

console.log(allPass ? "\nAll four import paths PASS." : "\nSome import paths FAILED.");
process.exitCode = allPass ? 0 : 1;
