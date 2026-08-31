"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAiSystemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [riskCategory, setRiskCategory] = useState("unclassified");
  const [intendedPurpose, setIntendedPurpose] = useState("");
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
      const res = await fetch("/api/systems/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || undefined,
          risk_category: riskCategory,
          intended_purpose: intendedPurpose || undefined,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Failed to create AI system.");
        setSaving(false);
        return;
      }

      router.push(`/dashboard/systems/${result.id}/traces`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 24 }}>Add an AI system</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} />
        </label>

        <label>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={fieldStyle} />
        </label>

        <label>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Risk category</span>
          <select value={riskCategory} onChange={(e) => setRiskCategory(e.target.value)} style={fieldStyle}>
            <option value="unclassified">Not yet classified</option>
            <option value="minimal">Minimal risk</option>
            <option value="limited">Limited risk</option>
            <option value="high">High risk</option>
            <option value="unacceptable">Unacceptable risk</option>
          </select>
        </label>

        <label>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Intended purpose</span>
          <textarea
            value={intendedPurpose}
            onChange={(e) => setIntendedPurpose(e.target.value)}
            rows={3}
            style={fieldStyle}
            placeholder="What is this system actually for?"
          />
        </label>

        {error && <p style={{ color: "var(--color-missing)", fontSize: 14 }}>{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary" style={{ justifyContent: "center", border: "none" }}>
          {saving ? (
            <span className="busy-row">
              <span className="spinner" />
              <span className="loading-message">Creating your AI system…</span>
            </span>
          ) : (
            "Create AI system"
          )}
        </button>
      </form>
    </main>
  );
}
