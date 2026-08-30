"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type SectionRow = {
  id: string;
  status: string;
  content: string | null;
  content_source: string | null;
  gap_notes: string | null;
  compliance_requirements: { title: string; description: string | null; section_key: string } | null;
  evidence_count: number;
};

const SOURCE_LABEL: Record<string, string> = {
  ai_generated: "AI-generated",
  user_provided: "User-provided",
  mixed: "AI-generated, edited by you",
};

const STATUS_TO_LEDGER: Record<string, string> = {
  missing_information: "missing_information",
  needs_review: "needs_review",
  approved: "approved",
  rejected: "missing_information",
  updated: "updated",
};

export default function DocumentationPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const aiSystemId = params.id;

  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busySectionId, setBusySectionId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function loadSections() {
    const { data: project } = await supabase
      .from("documentation_projects")
      .select("id")
      .eq("ai_system_id", aiSystemId)
      .maybeSingle();

    if (!project) {
      setSections([]);
      setLoading(false);
      return;
    }

    const { data: sectionRows } = await supabase
      .from("documentation_sections")
      .select("id, status, content, content_source, gap_notes, compliance_requirements(title, description, section_key)")
      .eq("documentation_project_id", project.id);

    const withCounts: SectionRow[] = [];
    for (const s of sectionRows ?? []) {
      const { count } = await supabase
        .from("evidence_links")
        .select("id", { count: "exact", head: true })
        .eq("documentation_section_id", s.id);
      withCounts.push({ ...(s as any), evidence_count: count ?? 0 });
    }

    withCounts.sort((a, b) => (a.compliance_requirements?.section_key ?? "").localeCompare(b.compliance_requirements?.section_key ?? ""));
    setSections(withCounts);
    setDrafts(Object.fromEntries(withCounts.map((s) => [s.id, s.content ?? ""])));
    setLoading(false);
  }

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  async function generate(sectionId: string) {
    setBusySectionId(sectionId);
    setErrors((prev) => ({ ...prev, [sectionId]: "" }));
    try {
      const res = await fetch("/api/documentation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentation_section_id: sectionId }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, [sectionId]: result.error ?? `Request failed (${res.status})` }));
      } else {
        await loadSections();
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [sectionId]: err.message ?? "Network error" }));
    } finally {
      setBusySectionId(null);
    }
  }

  async function review(sectionId: string, action: "approve" | "reject" | "edit" | "manual_add", newContent?: string) {
    setBusySectionId(sectionId);
    setErrors((prev) => ({ ...prev, [sectionId]: "" }));
    try {
      const res = await fetch("/api/documentation/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentation_section_id: sectionId, action, new_content: newContent }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, [sectionId]: result.error ?? `Request failed (${res.status})` }));
      } else {
        await loadSections();
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [sectionId]: err.message ?? "Network error" }));
    } finally {
      setBusySectionId(null);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>Documentation</h1>
        <Link href={`/dashboard/systems/${aiSystemId}/compliance`} style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
          ← Compliance mapping
        </Link>
      </div>

      <div className="trust-strip" style={{ marginBottom: 28 }}>
        Every section below is a draft until you approve it. Nothing here is legal advice or a
        compliance guarantee — review the evidence, edit anything that's wrong, and approve only
        what you've verified.
      </div>

      {loading ? (
        <p style={{ color: "var(--color-ink-muted)" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {sections.map((s) => {
            const busy = busySectionId === s.id;
            const draft = drafts[s.id] ?? "";
            const hasUnsavedEdit = draft !== (s.content ?? "");

            return (
              <div
                key={s.id}
                className="ledger-row"
                data-status={STATUS_TO_LEDGER[s.status] ?? "missing_information"}
                style={{ padding: "18px 18px", background: "white", borderRadius: 4 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                  <strong style={{ fontSize: 15 }}>{s.compliance_requirements?.title}</strong>
                  <span className="mono" style={{ fontSize: 11, color: "var(--color-ink-faint)", whiteSpace: "nowrap" }}>
                    {s.status.replace("_", " ")}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 12 }}>
                  {s.compliance_requirements?.description}
                </p>

                {s.evidence_count === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--color-missing)" }}>
                    No evidence linked yet. Import traces and re-sync compliance mapping first.
                  </p>
                ) : !s.content ? (
                  <>
                    <button
                      onClick={() => generate(s.id)}
                      disabled={busy}
                      className="btn-primary"
                      style={{ border: "none", fontSize: 13, padding: "9px 16px" }}
                    >
                      {busy ? "Generating…" : `Generate draft from ${s.evidence_count} evidence event${s.evidence_count === 1 ? "" : "s"}`}
                    </button>
                    {errors[s.id] && <p style={{ fontSize: 13, color: "var(--color-missing)", marginTop: 8 }}>{errors[s.id]}</p>}
                  </>
                ) : (
                  <>
                    {s.content_source && (
                      <p className="mono" style={{ fontSize: 11, color: "var(--color-ink-faint)", marginBottom: 8 }}>
                        {SOURCE_LABEL[s.content_source] ?? s.content_source}
                      </p>
                    )}
                    <textarea
                      value={draft}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      rows={6}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid var(--color-line)",
                        borderRadius: 4,
                        fontSize: 13.5,
                        fontFamily: "inherit",
                        lineHeight: 1.55,
                        marginBottom: 12,
                      }}
                    />
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {hasUnsavedEdit && (
                        <button
                          onClick={() => review(s.id, "edit", draft)}
                          disabled={busy}
                          style={{ fontSize: 13, padding: "8px 14px", border: "1px solid var(--color-line)", borderRadius: 4, background: "white" }}
                        >
                          Save edit
                        </button>
                      )}
                      {s.status === "needs_review" && !hasUnsavedEdit && (
                        <>
                          <button
                            onClick={() => review(s.id, "approve")}
                            disabled={busy}
                            style={{ fontSize: 13, padding: "8px 14px", border: "none", borderRadius: 4, background: "var(--color-approved)", color: "white" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => review(s.id, "reject")}
                            disabled={busy}
                            style={{ fontSize: 13, padding: "8px 14px", border: "1px solid var(--color-missing)", borderRadius: 4, background: "white", color: "var(--color-missing)" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(s.status === "approved" || s.status === "rejected") && !hasUnsavedEdit && (
                        <button
                          onClick={() => generate(s.id)}
                          disabled={busy}
                          style={{ fontSize: 13, padding: "8px 14px", border: "1px solid var(--color-line)", borderRadius: 4, background: "white" }}
                        >
                          Regenerate
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
