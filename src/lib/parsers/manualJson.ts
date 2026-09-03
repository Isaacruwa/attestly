// Converts a "pre-normalized" JSON trace — the format a user hand-builds or
// exports from an internal system — into the shared normalized event shape.
// Accepts either a bare array of events or a { events: [...] } wrapper.
// Unlike the other parsers, this format is already close to our internal
// shape, so this is mostly validation + field preservation rather than
// translation from a foreign schema.

import type { NormalizedEvent } from "./opentelemetry";

const VALID_EVENT_TYPES = [
  "agent_action",
  "tool_call",
  "api_call",
  "model_call",
  "human_intervention",
  "error",
  "system_event",
] as const;

function classifyEvent(e: any): NormalizedEvent["event_type"] {
  if (typeof e.event_type === "string" && (VALID_EVENT_TYPES as readonly string[]).includes(e.event_type)) {
    return e.event_type as NormalizedEvent["event_type"];
  }
  // Fall back to inferring from other fields rather than rejecting the event
  // outright — a missing/unrecognized event_type shouldn't sink the whole
  // import when the rest of the event is usable.
  if (e.errors || e.error) return "error";
  if (e.human_intervention) return "human_intervention";
  if (e.tool) return "tool_call";
  if (e.model) return "model_call";
  if (e.action) return "agent_action";
  return "system_event";
}

export function parseManualJsonTrace(raw: any): NormalizedEvent[] {
  const events: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.events) ? raw.events : [];

  return events
    .filter((e) => e && typeof e === "object")
    .map((e) => ({
      event_type: classifyEvent(e),
      occurred_at: e.timestamp ?? e.occurred_at ?? null,
      summary: e.name ?? e.action ?? e.summary ?? "Event",
      data: {
        event_id: e.event_id ?? e.id ?? null,
        trace_id: e.trace_id ?? null,
        actor: e.actor ?? null,
        model: e.model ?? null,
        tool: e.tool ?? null,
        action: e.action ?? null,
        status: e.status ?? null,
        attributes: e.attributes ?? null,
        metadata: e.metadata ?? null,
        evidence: e.evidence ?? null,
        human_intervention: e.human_intervention ?? null,
        errors: e.errors ?? e.error ?? null,
        policy: e.policy ?? null,
        risk: e.risk ?? null,
      },
    }));
}
