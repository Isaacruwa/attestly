// Central definition of what each plan allows. Free tier (no active paid
// subscription) is deliberately generous enough to prove the product works
// end to end, capped enough that real ongoing use requires paying.
export type PlanLimits = { maxAiSystems: number | null; maxLifetimeGenerations: number | null };

const LIMITS: Record<string, PlanLimits> = {
  free: { maxAiSystems: 1, maxLifetimeGenerations: 10 },
  starter: { maxAiSystems: 1, maxLifetimeGenerations: null },
  professional: { maxAiSystems: 10, maxLifetimeGenerations: null },
  enterprise: { maxAiSystems: null, maxLifetimeGenerations: null },
};

export function limitsFor(plan: string, status: string): PlanLimits {
  const isActivePaid = status === "active" && plan !== "none";
  return isActivePaid ? LIMITS[plan] ?? LIMITS.free : LIMITS.free;
}

export async function getSubscription(supabase: any, organizationId: string) {
  const { data } = await supabase
    .from("organization_subscriptions")
    .select("plan, status, lifetime_generations_used")
    .eq("organization_id", organizationId)
    .maybeSingle();

  return data ?? { plan: "none", status: "inactive", lifetime_generations_used: 0 };
}
