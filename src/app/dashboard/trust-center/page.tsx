"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TrustCenterSettingsPage() {
  const supabase = createClient();
  const [enabled, setEnabled] = useState(false);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .limit(1)
      .maybeSingle();
    if (!membership) return setLoading(false);

    const { data: org } = await supabase
      .from("organizations")
      .select("name, trust_center_enabled, trust_center_slug")
      .eq("id", membership.organization_id)
      .single();

    if (org) {
      setEnabled(org.trust_center_enabled ?? false);
      setSlug(org.trust_center_slug ?? slugify(org.name));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/trust-center/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled, slug: slugify(slug) }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Failed to save");
      } else {
        setSlug(result.slug);
        setMessage("Saved.");
      }
    } catch (err: any) {
      setError(err.message ?? "Network error");
    } finally {
      setSaving(false);
    }
  }

  const publicUrl = `attestly.online/trust/${slugify(slug) || "your-link"}`;

  if (loading) {
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        <p className="busy-row" style={{ color: "var(--color-ink-muted)" }}>
          <span className="spinner spinner-dark" />
          <span className="loading-message">Loading…</span>
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>Trust Center</h1>
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>← Dashboard</Link>
      </div>

      <p style={{ fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6, marginBottom: 28 }}>
        A public page showing your EU AI Act documentation progress — shareable with customers, partners, or
        auditors. Only shows aggregate status (how many requirements are approved), never your actual document
        content or trace data. Off by default; nothing is public until you turn this on.
      </p>

      <form onSubmit={save}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Make my Trust Center public</span>
        </label>

        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Your public link</label>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 6 }}>
          <span
            className="mono"
            style={{
              fontSize: 13,
              color: "var(--color-ink-faint)",
              padding: "10px 0 10px 12px",
              background: "white",
              border: "1px solid var(--color-line)",
              borderRight: "none",
              borderRadius: "4px 0 0 4px",
            }}
          >
            attestly.online/trust/
          </span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--color-line)", borderRadius: "0 4px 4px 0", fontSize: 13, fontFamily: "var(--font-mono)" }}
          />
        </div>
        <p style={{ fontSize: 12.5, color: "var(--color-ink-faint)", marginBottom: 24 }}>
          Lowercase letters, numbers, and hyphens only. Preview: {publicUrl}
        </p>

        {error && <p style={{ color: "var(--color-missing)", fontSize: 13, marginBottom: 16 }}>{error}</p>}
        {message && <p style={{ color: "var(--color-approved)", fontSize: 13, marginBottom: 16 }}>{message}</p>}

        <button type="submit" disabled={saving} className="btn-primary busy-row" style={{ border: "none" }}>
          {saving && <span className="spinner" />}
          {saving ? "Saving…" : "Save"}
        </button>

        {enabled && (
          <Link href={`/trust/${slugify(slug)}`} target="_blank" style={{ marginLeft: 16, fontSize: 13, color: "var(--color-primary)" }}>
            View public page →
          </Link>
        )}
      </form>
    </main>
  );
}
