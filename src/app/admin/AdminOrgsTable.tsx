"use client";

import { useState } from "react";

type OrgRow = {
  organization_id: string;
  org_name: string;
  owner_email: string;
  plan: string;
  status: string;
};

const PLANS = ["none", "starter", "professional", "enterprise"];
const STATUSES = ["inactive", "active", "past_due", "canceled", "paused"];

export default function AdminOrgsTable({ initialRows }: { initialRows: OrgRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [drafts, setDrafts] = useState<Record<string, { plan: string; status: string }>>(
    Object.fromEntries(initialRows.map((r) => [r.organization_id, { plan: r.plan, status: r.status }]))
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [messageById, setMessageById] = useState<Record<string, string>>({});

  async function save(orgId: string) {
    setSavingId(orgId);
    setMessageById((prev) => ({ ...prev, [orgId]: "" }));
    try {
      const draft = drafts[orgId];
      const res = await fetch("/api/admin/assign-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: orgId, plan: draft.plan, status: draft.status }),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessageById((prev) => ({ ...prev, [orgId]: result.error ?? "Failed to save" }));
      } else {
        setRows((prev) => prev.map((r) => (r.organization_id === orgId ? { ...r, plan: draft.plan, status: draft.status } : r)));
        setMessageById((prev) => ({ ...prev, [orgId]: "Saved." }));
      }
    } catch (err: any) {
      setMessageById((prev) => ({ ...prev, [orgId]: err.message ?? "Network error" }));
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rows.map((row) => {
        const draft = drafts[row.organization_id];
        const busy = savingId === row.organization_id;
        const dirty = draft.plan !== row.plan || draft.status !== row.status;
        return (
          <div
            key={row.organization_id}
            style={{
              padding: "12px 14px",
              background: "white",
              border: "1px solid var(--color-line)",
              borderRadius: 4,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              fontSize: 13.5,
            }}
          >
            <div style={{ flex: "1 1 220px", minWidth: 180 }}>
              <strong>{row.org_name}</strong>
              <div style={{ color: "var(--color-ink-muted)", fontSize: 12.5 }}>{row.owner_email}</div>
            </div>

            <select
              value={draft.plan}
              onChange={(e) => setDrafts((prev) => ({ ...prev, [row.organization_id]: { ...prev[row.organization_id], plan: e.target.value } }))}
              style={{ padding: "6px 8px", border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 13 }}
            >
              {PLANS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={draft.status}
              onChange={(e) => setDrafts((prev) => ({ ...prev, [row.organization_id]: { ...prev[row.organization_id], status: e.target.value } }))}
              style={{ padding: "6px 8px", border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 13 }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={() => save(row.organization_id)}
              disabled={!dirty || busy}
              className="busy-row"
              style={{
                padding: "6px 14px",
                border: "none",
                borderRadius: 4,
                background: dirty ? "var(--color-primary)" : "var(--color-line)",
                color: dirty ? "white" : "var(--color-ink-faint)",
                fontSize: 13,
                cursor: dirty ? "pointer" : "default",
              }}
            >
              {busy && <span className="spinner" />}
              {busy ? "Saving…" : "Save"}
            </button>

            {messageById[row.organization_id] && (
              <span style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>{messageById[row.organization_id]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
