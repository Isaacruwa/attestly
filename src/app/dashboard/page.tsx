import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isPlatformAdmin } from "@/lib/isPlatformAdmin";
import OrgSwitcher from "./OrgSwitcher";

function summarize(sections: { status: string }[]): { label: string; ledgerStatus: string } {
  if (sections.length === 0) {
    return { label: "Not started", ledgerStatus: "missing_information" };
  }
  const approved = sections.filter((s) => s.status === "approved").length;
  const needsReview = sections.filter((s) => s.status === "needs_review").length;

  if (approved === sections.length) {
    return { label: "Fully approved", ledgerStatus: "approved" };
  }
  if (needsReview > 0) {
    return { label: `${approved}/${sections.length} approved, ${needsReview} to review`, ledgerStatus: "needs_review" };
  }
  if (approved > 0) {
    return { label: `${approved}/${sections.length} approved`, ledgerStatus: "updated" };
  }
  return { label: "No drafts generated yet", ledgerStatus: "missing_information" };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { org?: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Orgs this user belongs to. Almost every account has exactly one — this
  // list is what powers the client-workspace switcher for accounts (e.g.
  // agencies) that manage more than one. RLS on organization_members means
  // this only ever returns rows for the current user regardless of filter.
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id, organizations ( id, name )")
    .eq("user_id", user?.id ?? "");

  const orgs = (memberships ?? [])
    .map((m: any) => m.organizations)
    .filter(Boolean);

  const requestedOrgId = searchParams?.org;
  const selectedOrgId = orgs.some((o: any) => o.id === requestedOrgId) ? (requestedOrgId as string) : null;

  // A user's org membership determines what RLS lets them see — no manual
  // org_id filtering is required for security, the policies in schema.sql
  // already do that. The optional .eq below is an additional narrowing on
  // top, purely for accounts switching between multiple client workspaces.
  let query = supabase
    .from("ai_systems")
    .select(
      `id, name, risk_category, updated_at, organization_id,
       documentation_projects ( id, documentation_sections ( status ) )`
    )
    .order("updated_at", { ascending: false });

  if (selectedOrgId) {
    query = query.eq("organization_id", selectedOrgId);
  }

  const { data: aiSystems } = await query;

  const addSystemHref = selectedOrgId ? `/dashboard/systems/new?org=${selectedOrgId}` : "/dashboard/systems/new";

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>AI systems</h1>
          {orgs.length > 1 && <OrgSwitcher orgs={orgs} currentOrgId={selectedOrgId} />}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
          {isPlatformAdmin(user?.email) && (
            <Link href="/admin" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
              Admin
            </Link>
          )}
          <Link href="/pricing" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            Pricing
          </Link>
          <Link href="/dashboard/team" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            Team
          </Link>
          <Link href="/dashboard/trust-center" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            Trust Center
          </Link>
          <Link href="/dashboard/clients/new" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            + New client workspace
          </Link>
          <Link href={addSystemHref} style={{ fontSize: 14, color: "var(--color-primary)" }}>
            + Add AI system
          </Link>
        </div>
      </div>

      {!aiSystems || aiSystems.length === 0 ? (
        <div style={{ padding: 24, border: "1px dashed var(--color-line)", borderRadius: 6 }}>
          <p style={{ color: "var(--color-ink-muted)" }}>
            No AI systems yet. Add one, then connect its traces to start generating documentation.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {aiSystems.map((system: any) => {
            const sections = system.documentation_projects?.[0]?.documentation_sections ?? [];
            const { label, ledgerStatus } = summarize(sections);
            return (
              <Link key={system.id} href={`/dashboard/systems/${system.id}/traces`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="ledger-row" data-status={ledgerStatus} style={{ padding: "12px 16px", background: "white", borderRadius: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{system.name}</strong>
                    <span className="mono" style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>
                      {label}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginTop: 4 }}>
                    Risk category: {system.risk_category}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <form
        action={async () => {
          "use server";
          const supabase = createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}
        style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <p style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>Signed in as {user?.email}</p>
        <button type="submit" style={{ fontSize: 13, color: "var(--color-primary)", background: "none", border: "none", textDecoration: "underline" }}>
          Sign out
        </button>
      </form>
    </main>
  );
}
