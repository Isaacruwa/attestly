"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type TraceImport = { id: string; source: string; status: string; event_count: number; created_at: string };
type EventRow = { id: string; event_type: string; summary: string; occurred_at: string | null };

export default function TracesPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const aiSystemId = params.id;

  const [imports, setImports] = useState<TraceImport[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [source, setSource] = useState<"opentelemetry" | "langsmith" | "agentops" | "manual_json">("manual_json");

  async function refresh() {
    const { data: importRows } = await supabase
      .from("trace_imports")
      .select("id, source, status, event_count, created_at")
      .eq("ai_system_id", aiSystemId)
      .order("created_at", { ascending: false });
    setImports(importRows ?? []);

    const importIds = (importRows ?? []).map((r) => r.id);
    if (importIds.length > 0) {
      const { data: eventRows } = await supabase
        .from("events")
        .select("id, event_type, summary, occurred_at")
        .in("trace_import_id", importIds)
        .order("occurred_at", { ascending: false })
        .limit(50);
      setRecentEvents(eventRows ?? []);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // If the file already looks like our normalized shape (an array), send
      // it as `events`. Otherwise treat it as a raw trace for the chosen
      // source's parser (e.g. a raw OpenTelemetry export object).
      const body = Array.isArray(json)
        ? { ai_system_id: aiSystemId, source, events: json }
        : { ai_system_id: aiSystemId, source, payload: json };

      const res = await fetch("/api/traces/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus(`Failed: ${result.error ?? "unknown error"}`);
      } else {
        setStatus(`Imported ${result.events_stored} events.`);
        refresh();
      }
    } catch (err: any) {
      setStatus(`Failed to read file: ${err.message}`);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 24 }}>Traces</h1>

      <div style={{ background: "white", border: "1px solid var(--color-line)", borderRadius: 6, padding: 20, marginBottom: 32 }}>
        <p style={{ fontSize: 14, marginBottom: 12 }}>Import a trace file (.json)</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            style={{ padding: "8px 10px", border: "1px solid var(--color-line)", borderRadius: 4 }}
          >
            <option value="manual_json">Pre-normalized JSON</option>
            <option value="opentelemetry">OpenTelemetry export</option>
            <option value="langsmith">LangSmith export</option>
            <option value="agentops">AgentOps export</option>
          </select>
          <input type="file" accept="application/json" onChange={handleFile} />
        </div>
        {status && <p style={{ fontSize: 13, marginTop: 12, color: "var(--color-ink-muted)" }}>{status}</p>}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Import history</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {imports.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No imports yet.</p>}
        {imports.map((imp) => (
          <div key={imp.id} className="ledger-row" data-status={imp.status === "structured" ? "approved" : imp.status === "failed" ? "missing_information" : "updated"} style={{ padding: "10px 14px", background: "white", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span className="mono">{imp.source}</span>
              <span>{imp.event_count} events</span>
              <span style={{ color: "var(--color-ink-muted)" }}>{new Date(imp.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Recent activity</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {recentEvents.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No events yet.</p>}
        {recentEvents.map((ev) => (
          <div key={ev.id} style={{ fontSize: 13, padding: "6px 0", borderBottom: "1px solid var(--color-line)" }}>
            <span className="mono" style={{ color: "var(--color-ink-muted)", marginRight: 8 }}>{ev.event_type}</span>
            {ev.summary}
          </div>
        ))}
      </div>
    </main>
  );
}
