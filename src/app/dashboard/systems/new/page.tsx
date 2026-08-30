"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewAiSystemPage() {
  const router = useRouter();
  const supabase = createClient();

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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setSaving(false);
      return;
    }

    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (membershipError || !membership) {
      setError("Couldn't find your organization. Try signing out and back in.");
      setSaving(false);
      return;
    }

    const { data: system, error: insertError } = await supabase
      .from("ai_systems")
      .insert({
        organization_id: membership.organization_id,
        name,
        description: description || null,
        risk_category: riskCategory,
        intended_purpose: intendedPurpose || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError || !system) {
      setError(insertError?.message ?? "Failed to create AI system.");
      setSaving(false);
      return;
    }

    router.push(`/dashboard/systems/${system.id}/traces`);
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
          {saving ? "Creating…" : "Create AI system"}
        </button>
      </form>
    </main>
  );
}
