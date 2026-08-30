import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { parseOpenTelemetryTrace } from "@/lib/parsers/opentelemetry";
import { parseLangSmithTrace } from "@/lib/parsers/langsmith";
import { parseAgentOpsTrace } from "@/lib/parsers/agentops";

// Accepts either:
//  (a) a generic pre-normalized `events` array (manual_json, or any source
//      you've already converted client-side), or
//  (b) a raw `payload` in the source's native format, which gets run through
//      that source's parser first. Both paths converge on the same
//      NormalizedEvent[] shape before hitting the database.
// LangSmith/AgentOps/MCP-log parsers plug in the same way `opentelemetry`
// does below — add the parser file, add one branch here.

const RawEvent = z.object({
  agent_name: z.string().optional(),
  event_type: z.enum([
    "agent_action",
    "tool_call",
    "api_call",
    "model_call",
    "human_intervention",
    "error",
    "system_event",
  ]),
  occurred_at: z.string().nullable().optional(),
  summary: z.string().optional(),
  data: z.record(z.any()).optional(),
});

const IngestBody = z.object({
  ai_system_id: z.string().uuid(),
  source: z.enum(["opentelemetry", "langsmith", "agentops", "mcp_logs", "api_history", "manual_json"]),
  events: z.array(RawEvent).min(1).optional(),
  payload: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = IngestBody.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const { ai_system_id, source, payload } = parsed.data;
  let events = parsed.data.events;

  if (!events && payload) {
    if (source === "opentelemetry") {
      events = parseOpenTelemetryTrace(payload);
    } else if (source === "langsmith") {
      events = parseLangSmithTrace(payload);
    } else if (source === "agentops") {
      events = parseAgentOpsTrace(payload);
    } else {
      return NextResponse.json(
        { error: `No parser yet for source "${source}" — send pre-normalized "events" instead, or use source "opentelemetry"/"langsmith"/"agentops"/"manual_json".` },
        { status: 400 }
      );
    }
  }

  if (!events || events.length === 0) {
    return NextResponse.json({ error: "Provide either 'events' (normalized) or 'payload' (raw trace for a supported source)." }, { status: 400 });
  }

  // RLS confirms org membership implicitly: this insert fails if the user's
  // org doesn't own ai_system_id, because the ai_systems row won't be visible
  // to satisfy the foreign key under the calling user's policy context.
  const { data: importRow, error: importError } = await supabase
    .from("trace_imports")
    .insert({
      ai_system_id,
      source,
      status: "processing",
      event_count: events.length,
      imported_by: user.id,
    })
    .select()
    .single();

  if (importError || !importRow) {
    return NextResponse.json({ error: importError?.message ?? "import failed" }, { status: 400 });
  }

  const rows = events.map((e) => ({
    trace_import_id: importRow.id,
    event_type: e.event_type,
    occurred_at: e.occurred_at ?? null,
    summary: e.summary ?? null,
    structured_data: e.data ?? {},
  }));

  const { error: eventsError } = await supabase.from("events").insert(rows);

  await supabase
    .from("trace_imports")
    .update({ status: eventsError ? "failed" : "structured" })
    .eq("id", importRow.id);

  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 400 });
  }

  return NextResponse.json({ trace_import_id: importRow.id, events_stored: rows.length });
}
