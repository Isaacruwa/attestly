import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

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

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // A user's org membership determines what RLS lets them see — no manual
  // org_id filtering needed here, the policies in schema.sql do that.
  const { data: aiSystems } = await supabase
    .from("ai_systems")
    .select(
      `id, name, risk_category, updated_at,
       documentation_projects ( id, documentation_sections ( status ) )`
    )
    .order("updated_at", { ascending: false });

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>AI systems</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          <Link href="/pricing" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            Pricing
          </Link>
          <Link href="/dashboard/team" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
            Team
          </Link>
          <Link href="/dashboard/systems/new" style={{ fontSize: 14, color: "var(--color-primary)" }}>
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
