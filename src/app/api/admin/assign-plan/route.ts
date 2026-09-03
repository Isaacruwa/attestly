import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/isPlatformAdmin";
import { z } from "zod";

const Body = z.object({
  organization_id: z.string().uuid(),
  plan: z.enum(["none", "starter", "professional", "enterprise"]),
  status: z.enum(["inactive", "active", "past_due", "canceled", "paused"]),
});

// Manual override for customer support/goodwill situations (e.g. compensating
// a customer for downtime before a fix ships) — deliberately separate from
// the Paddle webhook path, which remains the source of truth for normal
// billing-driven plan changes. Every use of this route is logged.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isPlatformAdmin(user?.email)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  const { organization_id, plan, status } = parsed.data;

  const admin = createServiceRoleClient();

  const { error: upsertError } = await admin
    .from("organization_subscriptions")
    .upsert({ organization_id, plan, status, updated_at: new Date().toISOString() }, { onConflict: "organization_id" });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 400 });
  }

  await admin.from("audit_log").insert({
    organization_id,
    actor_id: user!.id,
    action: "admin_assign_plan",
    entity_type: "organization_subscription",
    entity_id: organization_id,
    metadata: { plan, status, assigned_by: user!.email },
  });

  return NextResponse.json({ status: "ok" });
}
