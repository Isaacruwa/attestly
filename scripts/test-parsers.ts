// Exercises the actual parser functions against realistic fixtures.
// Run with: npx tsx scripts/test-parsers.ts
import { readFileSync } from "fs";
import { join } from "path";
import { parseOpenTelemetryTrace } from "../src/lib/parsers/opentelemetry";
import { parseLangSmithTrace } from "../src/lib/parsers/langsmith";
import { parseAgentOpsTrace } from "../src/lib/parsers/agentops";
import { parseManualJsonTrace } from "../src/lib/parsers/manualJson";

const VALID_TYPES = new Set([
  "agent_action",
  "tool_call",
  "api_call",
  "model_call",
  "human_intervention",
  "error",
  "system_event",
]);

function load(name: string) {
  return JSON.parse(readFileSync(join(__dirname, "fixtures", name), "utf-8"));
}

function check(label: string, events: { event_type: string }[], expectedMin: number) {
  const badTypes = events.filter((e) => !VALID_TYPES.has(e.event_type));
  const pass = events.length >= expectedMin && badTypes.length === 0;
  console.log(
    `${pass ? "PASS" : "FAIL"} — ${label}: ${events.length} event(s) parsed` +
      (badTypes.length ? `, ${badTypes.length} with invalid event_type` : "")
  );
  if (!pass) process.exitCode = 1;
  return pass;
}

console.log("Running parser regression + fix verification tests...\n");

// Regression checks — these parsers were NOT modified.
check("OpenTelemetry (unmodified, regression check)", parseOpenTelemetryTrace(load("opentelemetry-export.json")), 1);
check("AgentOps (unmodified, regression check)", parseAgentOpsTrace(load("agentops-export.json")), 1);

// The actual bug fixes:
// LangSmith export is a BARE ARRAY with nested child_runs — this exact shape
// previously got misrouted client-side as "already normalized" and failed
// zod validation with "invalid payload". Expect 4 events: 2 top-level runs +
// 2 flattened children from the first run's child_runs.
const langsmithEvents = parseLangSmithTrace(load("langsmith-export.json"));
check("LangSmith (bare array + nested child_runs)", langsmithEvents, 4);
console.log(
  "  → trace_id preserved:",
  langsmithEvents.every((e: any) => e.data.trace_id),
  "| tags preserved:",
  langsmithEvents.some((e: any) => Array.isArray(e.data.tags))
);

// manual_json in the spec's stated { events: [...] } wrapped shape —
// previously hit "No parser yet for source manual_json" because the client
// only recognized bare arrays as pre-normalized.
const manualEvents = parseManualJsonTrace(load("manual-json-export.json"));
check("manual_json ({ events: [...] } wrapper)", manualEvents, 5);
console.log(
  "  → extended fields preserved:",
  manualEvents.every(
    (e: any) => "actor" in e.data && "model" in e.data && "tool" in e.data && "policy" in e.data && "risk" in e.data
  )
);

// manual_json also needs to work with a bare array (not just the wrapper),
// since that's how the original working sample-trace.json was shaped.
const manualBareArray = parseManualJsonTrace([{ event_type: "system_event", timestamp: "2026-09-01T00:00:00Z", name: "test" }]);
check("manual_json (bare array, backward compatible)", manualBareArray, 1);

console.log("\nDone.");
