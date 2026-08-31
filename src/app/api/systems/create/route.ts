import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, limitsFor } from "@/lib/planLimits";
import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  risk_category: z.string().default("unclassified"),
  intended_purpose: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  let { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    // Safety net for accounts whose auto-created org didn't land the first time.
    const orgName = user.email ? `${user.email.split("@")[0]}'s organization` : "My organization";
    const { data: newOrgId, error: rpcError } = await supabase.rpc("create_organization_for_current_user", {
      org_name: orgName,
    });
    if (rpcError || !newOrgId) {
      return NextResponse.json({ error: rpcError?.message ?? "Couldn't set up your organization." }, { status: 400 });
    }
    membership = { organization_id: newOrgId };
  }

  const organizationId = membership.organization_id;

  const { plan, status } = await getSubscription(supabase, organizationId);
  const { maxAiSystems } = limitsFor(plan, status);

  if (maxAiSystems !== null) {
    const { count } = await supabase
      .from("ai_systems")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId);

    if ((count ?? 0) >= maxAiSystems) {
      return NextResponse.json(
        {
          error: `Your current plan allows ${maxAiSystems} AI system${maxAiSystems === 1 ? "" : "s"}. Upgrade to add more.`,
          upgrade_url: "/pricing",
        },
        { status: 403 }
      );
    }
  }

  const { data: system, error: insertError } = await supabase
    .from("ai_systems")
    .insert({ organization_id: organizationId, created_by: user.id, ...parsed.data })
    .select()
    .single();

  if (insertError || !system) {
    return NextResponse.json({ error: insertError?.message ?? "Failed to create AI system" }, { status: 400 });
  }

  return NextResponse.json({ id: system.id });
}
