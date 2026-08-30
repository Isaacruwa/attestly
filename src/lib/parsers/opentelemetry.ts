// Converts a standard OpenTelemetry JSON trace export (resourceSpans[].scopeSpans[].spans[])
// into the normalized event shape used across all trace sources. LangSmith/AgentOps
// parsers follow this same pattern — each returns the same NormalizedEvent[] shape,
// so nothing downstream (ingestion route, event storage, doc generation) needs to
// know which tool produced the trace.

export type NormalizedEvent = {
  event_type:
    | "agent_action"
    | "tool_call"
    | "api_call"
    | "model_call"
    | "human_intervention"
    | "error"
    | "system_event";
  occurred_at: string | null;
  summary: string;
  data: Record<string, unknown>;
};

function classifySpan(span: any): NormalizedEvent["event_type"] {
  const name: string = (span.name ?? "").toLowerCase();
  const attrs: Record<string, any> = Object.fromEntries(
    (span.attributes ?? []).map((a: any) => [a.key, a.value?.stringValue ?? a.value])
  );

  if (span.status?.code === 2 /* STATUS_CODE_ERROR */) return "error";
  if (attrs["llm.request.model"] || attrs["gen_ai.request.model"]) return "model_call";
  if (name.includes("tool") || attrs["tool.name"]) return "tool_call";
  if (name.includes("http") || attrs["http.method"]) return "api_call";
  if (name.includes("human") || attrs["human.review"]) return "human_intervention";
  if (name.includes("agent")) return "agent_action";
  return "system_event";
}

function nanosToIso(nanos?: string | number): string | null {
  if (!nanos) return null;
  const ms = Number(nanos) / 1_000_000;
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toISOString();
}

export function parseOpenTelemetryTrace(raw: any): NormalizedEvent[] {
  const events: NormalizedEvent[] = [];

  const resourceSpans = raw.resourceSpans ?? raw.resource_spans ?? [];
  for (const resourceSpan of resourceSpans) {
    const scopeSpans = resourceSpan.scopeSpans ?? resourceSpan.scope_spans ?? [];
    for (const scopeSpan of scopeSpans) {
      for (const span of scopeSpan.spans ?? []) {
        events.push({
          event_type: classifySpan(span),
          occurred_at: nanosToIso(span.startTimeUnixNano ?? span.start_time_unix_nano),
          summary: span.name ?? "Unnamed span",
          data: {
            span_id: span.spanId ?? span.span_id,
            trace_id: span.traceId ?? span.trace_id,
            parent_span_id: span.parentSpanId ?? span.parent_span_id ?? null,
            attributes: span.attributes ?? [],
            status: span.status ?? null,
          },
        });
      }
    }
  }

  return events;
}
