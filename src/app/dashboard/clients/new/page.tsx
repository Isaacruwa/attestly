"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientWorkspacePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--color-line)",
    borderRadius: 4,
    marginTop: 6,
    fontFamily: "inherit",
    fontSize: 14,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/organizations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Failed to create client workspace.");
        setSaving(false);
        return;
      }

      router.push(`/dashboard?org=${result.id}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>New client workspace</h1>
      <p style={{ fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 24 }}>
        Each client gets its own isolated workspace — separate AI systems, traces, and documentation.
        You can switch between workspaces from the dashboard.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Client / workspace name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} placeholder="e.g. Acme Corp" />
        </label>

        {error && <p style={{ color: "var(--color-missing)", fontSize: 14 }}>{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: "center", border: "none" }}>
          {saving ? (
            <span className="busy-row">
              <span className="spinner" />
              <span className="loading-message">Creating workspace…</span>
            </span>
          ) : (
            "Create workspace"
          )}
        </button>
      </form>
    </main>
  );
}
