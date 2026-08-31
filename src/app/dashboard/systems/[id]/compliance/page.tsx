"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCyclingMessage } from "@/lib/useCyclingMessage";

type SectionRow = {
  id: string;
  status: string;
  gap_notes: string | null;
  compliance_requirements: { title: string; description: string | null; section_key: string } | null;
  evidence_count: number;
};

export default function CompliancePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const aiSystemId = params.id;

  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const syncMessage = useCyclingMessage(
    ["Scanning your imported traces…", "Matching evidence to Annex IV…", "Almost done…"],
    syncing || loading
  );

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
      .select("id, status, gap_notes, compliance_requirements(title, description, section_key)")
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
    setLoading(false);
  }

  async function runSync() {
    setSyncing(true);
    await fetch("/api/compliance/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_system_id: aiSystemId }),
    });
    await loadSections();
    setSyncing(false);
  }

  useEffect(() => {
    runSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const covered = sections.filter((s) => s.evidence_count > 0).length;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>Compliance mapping</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          <Link href={`/dashboard/systems/${aiSystemId}/traces`} style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
            ← Traces
          </Link>
          <Link href={`/dashboard/systems/${aiSystemId}/documentation`} style={{ fontSize: 13, color: "var(--color-primary)" }}>
            Review documentation →
          </Link>
          <button
            onClick={runSync}
            disabled={syncing}
            className="busy-row"
            style={{ fontSize: 13, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}
          >
            {syncing && <span className="spinner spinner-dark" />}
            {syncing ? "Syncing…" : "Re-sync from traces"}
          </button>
        </div>
      </div>

      {!loading && (
        <p style={{ fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 28 }}>
          {covered} of {sections.length} Annex IV requirements have supporting evidence.
        </p>
      )}

      {loading ? (
        <p className="busy-row" style={{ color: "var(--color-ink-muted)" }}>
          <span className="spinner spinner-dark" />
          <span className="loading-message">{syncMessage}</span>
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map((s) => {
            const hasEvidence = s.evidence_count > 0;
            return (
              <div
                key={s.id}
                className="ledger-row"
                data-status={hasEvidence ? "updated" : "missing_information"}
                style={{ padding: "14px 16px", background: "white", borderRadius: 4 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong style={{ fontSize: 14.5 }}>{s.compliance_requirements?.title}</strong>
                  <span className="mono" style={{ fontSize: 12, color: hasEvidence ? "var(--color-updated)" : "var(--color-missing)", whiteSpace: "nowrap" }}>
                    {hasEvidence ? `${s.evidence_count} evidence event${s.evidence_count === 1 ? "" : "s"}` : "No evidence yet"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginTop: 4 }}>
                  {s.compliance_requirements?.description}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
