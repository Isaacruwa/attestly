// Converts an MCP (Model Context Protocol) session log into the shared
// normalized event shape. Same contract as opentelemetry.ts, langsmith.ts,
// and agentops.ts — see opentelemetry.ts for the NormalizedEvent type.
//
// MCP itself doesn't define a log *file* format — it defines the JSON-RPC
// 2.0 wire protocol between an MCP client and server. What gets logged is
// whatever an MCP proxy/logging wrapper captures: a sequence of JSON-RPC
// request/response/notification objects, usually with a timestamp and
// direction attached by the logger. This parser accepts the common shape:
// a bare array, { logs: [...] }, or { messages: [...] }, where each entry
// is either a raw JSON-RPC message or one wrapped as { timestamp,
// direction, sessionId, message: {...} }.

import type { NormalizedEvent } from "./opentelemetry";

function classifyMcpEntry(rpc: any): NormalizedEvent["event_type"] {
  const method: string = (rpc.method ?? "").toLowerCase();

  if (rpc.error || rpc.result?.isError) return "error";
  // MCP's mechanism for a server asking the client's LLM to do inference.
  if (method.startsWith("sampling/")) return "model_call";
  // MCP's mechanism for a server prompting the human user for input.
  if (method.startsWith("elicitation/")) return "human_intervention";
  if (method.startsWith("tools/call")) return "tool_call";
  if (method.startsWith("resources/") || method.startsWith("prompts/")) return "api_call";
  if (method === "initialize" || method.startsWith("notifications/")) return "system_event";
  if (method.startsWith("tools/")) return "agent_action";
  return "system_event";
}

function summarizeMcpEntry(rpc: any): string {
  if (rpc.method) return rpc.method as string;
  if (rpc.error) return `Error: ${rpc.error.message ?? "MCP error"}`;
  return "MCP message";
}

export function parseMcpLogsTrace(raw: any): NormalizedEvent[] {
  const entries: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.logs)
      ? raw.logs
      : Array.isArray(raw?.messages)
        ? raw.messages
        : [];

  return entries
    .filter((e) => e && typeof e === "object")
    .map((entry) => {
      // Loggers commonly nest the raw JSON-RPC message under `message` or
      // `body` alongside the fields they added (timestamp, direction,
      // sessionId) — but a bare JSON-RPC object at the top level is valid
      // too, so fall back to the entry itself.
      const rpc = entry.message ?? entry.body ?? entry;
      return {
        event_type: classifyMcpEntry(rpc),
        occurred_at: entry.timestamp ?? entry.occurred_at ?? null,
        summary: summarizeMcpEntry(rpc),
        data: {
          jsonrpc_id: rpc.id ?? null,
          method: rpc.method ?? null,
          direction: entry.direction ?? null,
          session_id: entry.sessionId ?? entry.session_id ?? null,
          params: rpc.params ?? null,
          result: rpc.result ?? null,
          error: rpc.error ?? null,
        },
      };
    });
}
