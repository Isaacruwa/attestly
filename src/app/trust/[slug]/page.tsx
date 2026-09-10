import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";

async function getTrustData(slug: string) {
  const admin = createServiceRoleClient();

  const { data: org } = await admin
    .from("organizations")
    .select("id, name, trust_center_enabled")
    .eq("trust_center_slug", slug)
    .maybeSingle();

  if (!org || !org.trust_center_enabled) return null;

  const { data: systems } = await admin.from("ai_systems").select("id, name, risk_category").eq("organization_id", org.id);

  const systemsWithStats = [];
  let totalApproved = 0;
  let totalSections = 0;
  let lastApprovedAt: string | null = null;

  for (const system of systems ?? []) {
    const { data: project } = await admin.from("documentation_projects").select("id").eq("ai_system_id", system.id).maybeSingle();
    if (!project) {
      systemsWithStats.push({ ...system, approved: 0, total: 0 });
      continue;
    }
    const { data: sections } = await admin
      .from("documentation_sections")
      .select("status, approved_at")
      .eq("documentation_project_id", project.id);

    const approved = (sections ?? []).filter((s: any) => s.status === "approved").length;
    const total = sections?.length ?? 0;
    totalApproved += approved;
    totalSections += total;

    for (const s of (sections ?? []) as any[]) {
      if (s.approved_at && (!lastApprovedAt || s.approved_at > lastApprovedAt)) lastApprovedAt = s.approved_at;
    }

    systemsWithStats.push({ ...system, approved, total });
  }

  return { orgName: org.name, systems: systemsWithStats, totalApproved, totalSections, lastApprovedAt };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getTrustData(params.slug);
  if (!data) return {};
  return {
    title: `${data.orgName} — Compliance Status | Attestly Trust Center`,
    description: `${data.orgName}'s EU AI Act documentation status, verified and maintained via Attestly.`,
    alternates: { canonical: `https://attestly.online/trust/${params.slug}` },
  };
}

export default async function TrustCenterPage({ params }: { params: { slug: string } }) {
  const data = await getTrustData(params.slug);
  if (!data) notFound();

  const pct = data.totalSections > 0 ? Math.round((data.totalApproved / data.totalSections) * 100) : 0;

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <p className="mono" style={{ fontSize: 12, color: "var(--color-ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Compliance Trust Center
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30 }}>{data.orgName}</h1>
      </div>

      <div className="ledger-row" data-status={pct === 100 ? "approved" : pct > 0 ? "updated" : "missing_information"} style={{ padding: 28, background: "white", borderRadius: 8, marginBottom: 32, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 700, marginBottom: 6 }}>{pct}%</p>
        <p style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
          {data.totalApproved} of {data.totalSections} EU AI Act Annex IV requirements approved
          {data.lastApprovedAt && ` · last updated ${new Date(data.lastApprovedAt).toLocaleDateString()}`}
        </p>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>AI systems ({data.systems.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {data.systems.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No AI systems listed yet.</p>}
        {data.systems.map((s: any) => (
          <div key={s.id} style={{ padding: "12px 16px", background: "white", border: "1px solid var(--color-line)", borderRadius: 4, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>{s.name}</span>
            <span className="mono" style={{ color: "var(--color-ink-muted)" }}>{s.approved}/{s.total} approved</span>
          </div>
        ))}
      </div>

      <div className="trust-strip" style={{ marginBottom: 32 }}>
        This page shows aggregate documentation status only — never underlying document content, trace data, or
        evidence. Approved sections are cryptographically hashed for tamper-evidence at the point of approval.
        This is not a legal certification of compliance.
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-ink-faint)" }}>
        Compliance status automatically maintained via{" "}
        <Link href="https://attestly.online" style={{ color: "var(--color-primary)" }}>Attestly</Link>
      </p>
    </main>
  );
}
