import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/isPlatformAdmin";
import Link from "next/link";
import AdminOrgsTable from "./AdminOrgsTable";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isPlatformAdmin(user?.email)) {
    return (
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 12 }}>Not authorized</h1>
        <p style={{ color: "var(--color-ink-muted)", marginBottom: 20 }}>
          This page is restricted to platform admins.
        </p>
        <Link href="/dashboard" style={{ color: "var(--color-primary)" }}>← Back to dashboard</Link>
      </main>
    );
  }

  // Everything from here uses the service-role client deliberately — this
  // page's entire purpose is seeing across every customer's organization,
  // which normal RLS-scoped queries can never do. The authorization check
  // above is what makes that safe.
  const admin = createServiceRoleClient();

  const [{ data: usersData }, { data: orgs }, { data: members }, { data: subscriptions }, { count: aiSystemCount }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin.from("organizations").select("id, name, created_at"),
      admin.from("organization_members").select("organization_id, user_id, role"),
      admin.from("organization_subscriptions").select("organization_id, plan, status, lifetime_generations_used, current_period_end"),
      admin.from("ai_systems").select("id", { count: "exact", head: true }),
    ]);

  const users = usersData?.users ?? [];
  const emailById = new Map<string, string>(users.map((u: any): [string, string] => [u.id, u.email ?? "(no email)"]));
  const orgNameById = new Map<string, string>((orgs ?? []).map((o: any): [string, string] => [o.id, o.name]));

  const ownerEmailByOrg = new Map<string, string>();
  for (const m of (members ?? []) as any[]) {
    if (m.role === "owner") ownerEmailByOrg.set(m.organization_id, emailById.get(m.user_id) ?? "unknown");
  }

  const activeSubs = (subscriptions ?? []).filter((s: any) => s.status === "active");
  const planCounts: Record<string, number> = {};
  for (const s of (subscriptions ?? []) as any[]) {
    planCounts[s.plan] = (planCounts[s.plan] ?? 0) + 1;
  }

  const subscriptionByOrg = new Map<string, { plan: string; status: string }>(
    ((subscriptions ?? []) as any[]).map((s) => [s.organization_id, { plan: s.plan, status: s.status }])
  );

  const allOrgRows = ((orgs ?? []) as any[]).map((o) => ({
    organization_id: o.id,
    org_name: o.name,
    owner_email: ownerEmailByOrg.get(o.id) ?? "unknown",
    plan: subscriptionByOrg.get(o.id)?.plan ?? "none",
    status: subscriptionByOrg.get(o.id)?.status ?? "inactive",
  }));

  const stat = (label: string, value: string | number) => (
    <div style={{ padding: "16px 20px", background: "white", border: "1px solid var(--color-line)", borderRadius: 6, flex: 1, minWidth: 140 }}>
      <p className="mono" style={{ fontSize: 11, color: "var(--color-ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600 }}>{value}</p>
    </div>
  );

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26 }}>Admin</h1>
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>← Dashboard</Link>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
        {stat("Total users", users.length)}
        {stat("Organizations", orgs?.length ?? 0)}
        {stat("AI systems", aiSystemCount ?? 0)}
        {stat("Active subscriptions", activeSubs.length)}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Plans</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
        {Object.entries(planCounts).map(([plan, count]) => (
          <div key={plan} className="ledger-row" data-status={plan === "none" ? "missing_information" : "approved"} style={{ padding: "10px 16px", background: "white", borderRadius: 4, fontSize: 13.5 }}>
            <span style={{ textTransform: "capitalize" }}>{plan}</span>: <strong>{count}</strong>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Manage plans ({allOrgRows.length} organizations)</h2>
      <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 14 }}>
        Manually assign a plan — for comps, goodwill after a bug, or testing. Changes here are separate from Paddle
        billing and logged to the audit trail.
      </p>
      <div style={{ marginBottom: 36 }}>
        <AdminOrgsTable initialRows={allOrgRows} />
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Paying customers ({activeSubs.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 36 }}>
        {activeSubs.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No active paid subscriptions yet.</p>}
        {activeSubs.map((s: any) => (
          <div key={s.organization_id} style={{ padding: "10px 14px", background: "white", border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 13.5, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span>
              <strong>{orgNameById.get(s.organization_id) ?? "Unknown org"}</strong> — {ownerEmailByOrg.get(s.organization_id) ?? "unknown owner"}
            </span>
            <span className="mono" style={{ color: "var(--color-ink-muted)" }}>
              {s.plan} · renews {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>All users ({users.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {users
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map((u: any) => (
            <div key={u.id} style={{ padding: "8px 12px", borderBottom: "1px solid var(--color-line)", fontSize: 13.5, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <span>{u.email}</span>
              <span className="mono" style={{ color: "var(--color-ink-faint)" }}>{new Date(u.created_at).toLocaleDateString()}</span>
            </div>
          ))}
      </div>
    </main>
  );
}
