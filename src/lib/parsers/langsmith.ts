// Converts a LangSmith run export (an array of "run" objects, as returned by
// the LangSmith export/list-runs API) into the shared normalized event shape.
// Same contract as opentelemetry.ts — see that file for the pattern.
//
// Handles both flat exports (a plain array/{runs:[...]} of top-level runs)
// and exports where child runs are nested inline under `child_runs` —
// LangSmith's API can return either shape depending on how the export was
// generated, so both are flattened into one flat list of events here.

import type { NormalizedEvent } from "./opentelemetry";

function classifyRunType(run: any): NormalizedEvent["event_type"] {
  const type = (run.run_type ?? "").toLowerCase();
  if (run.error) return "error";
  if (type === "llm" || type === "chat_model") return "model_call";
  if (type === "tool") return "tool_call";
  if (type === "retriever") return "api_call";
  if (run.feedback_stats?.human_review) return "human_intervention";
  if (type === "chain") return "agent_action";
  return "system_event";
}

function runToEvent(run: any): NormalizedEvent {
  return {
    event_type: classifyRunType(run),
    occurred_at: run.start_time ?? null,
    summary: run.name ?? run.run_type ?? "LangSmith run",
    data: {
      run_id: run.id,
      parent_run_id: run.parent_run_id ?? null,
      trace_id: run.trace_id ?? run.session_id ?? null,
      run_type: run.run_type,
      status: run.status ?? null,
      tags: run.tags ?? null,
      extra: run.extra ?? null,
      inputs: run.inputs ?? null,
      outputs: run.outputs ?? null,
      error: run.error ?? null,
      latency_ms:
        run.end_time && run.start_time
          ? new Date(run.end_time).getTime() - new Date(run.start_time).getTime()
          : null,
    },
  };
}

// Recursively flattens a run and any nested child_runs into a flat list —
// nested runs are a valid LangSmith export shape, but our internal event
// model has no concept of nesting, so parent/child relationships are
// preserved via parent_run_id in each event's data instead.
function flattenRun(run: any): NormalizedEvent[] {
  const children: any[] = Array.isArray(run.child_runs) ? run.child_runs : [];
  const { child_runs, ...runWithoutChildren } = run;
  return [runToEvent(runWithoutChildren), ...children.flatMap(flattenRun)];
}

export function parseLangSmithTrace(raw: any): NormalizedEvent[] {
  // LangSmith exports are usually either a bare array of runs, or
  // { runs: [...] }. Accept both.
  const runs: any[] = Array.isArray(raw) ? raw : raw?.runs ?? [];

  return runs.flatMap(flattenRun);
}
