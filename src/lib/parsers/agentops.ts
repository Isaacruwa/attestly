// Converts an AgentOps session export (a session containing an `events` array
// of actions/tool_calls/errors/LLM calls) into the shared normalized event
// shape. Same contract as opentelemetry.ts and langsmith.ts.

import type { NormalizedEvent } from "./opentelemetry";

function classifyAgentOpsEvent(event: any): NormalizedEvent["event_type"] {
  const type = (event.event_type ?? event.type ?? "").toLowerCase();
  if (type.includes("error")) return "error";
  if (type.includes("llm") || type.includes("model")) return "model_call";
  if (type.includes("tool") || type.includes("action")) return "tool_call";
  if (type.includes("api")) return "api_call";
  if (type.includes("human") || type.includes("review")) return "human_intervention";
  if (type.includes("agent")) return "agent_action";
  return "system_event";
}

export function parseAgentOpsTrace(raw: any): NormalizedEvent[] {
  // AgentOps session exports typically look like { session: {...}, events: [...] }
  // or a bare events array. Accept both.
  const events: any[] = Array.isArray(raw) ? raw : raw.events ?? [];

  return events.map((event) => ({
    event_type: classifyAgentOpsEvent(event),
    occurred_at: event.init_timestamp ?? event.timestamp ?? null,
    summary: event.action_type ?? event.name ?? event.event_type ?? "AgentOps event",
    data: {
      agent_id: event.agent_id ?? null,
      params: event.params ?? null,
      returns: event.returns ?? null,
      end_timestamp: event.end_timestamp ?? null,
      model: event.model ?? null,
    },
  }));
}
