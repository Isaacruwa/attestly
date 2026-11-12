import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { hashApiKey, looksLikeApiKey } from "@/lib/apiKeys";

export type Actor = {
  organizationId: string;
  actingUserId: string | null;
  authMethod: "session" | "api_key";
};

// Resolves the calling organization from either a logged-in dashboard
// session (human/browser flow, the only flow that existed before this) or
// an `Authorization: Bearer atly_live_...` API key (agent/script flow).
// Returns null if neither authenticates — callers should treat that as 401.
//
// Security note: a bearer-token request has no Supabase session, so RLS's
// is_org_member() (which reads auth.uid()) can't authorize the key lookup
// itself — that lookup goes through the service-role client, which bypasses
// RLS. Everything *after* authentication (the actual data access) still
// needs its own explicit organization check in the route handler when using
// the service-role client, since RLS no longer provides it automatically.
export async function authenticateActor(req: Request): Promise<Actor | null> {
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;

  if (bearerToken && looksLikeApiKey(bearerToken)) {
    const admin = createServiceRoleClient();
    const hash = hashApiKey(bearerToken);

    const { data: key } = await admin
      .from("api_keys")
      .select("id, organization_id, created_by, revoked_at")
      .eq("key_hash", hash)
      .maybeSingle();

    if (!key || key.revoked_at) return null;

    // Best-effort usage tracking — a failed update here shouldn't block the
    // actual request this key is authenticating.
    void admin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", key.id);

    return { organizationId: key.organization_id, actingUserId: key.created_by, authMethod: "api_key" };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  return { organizationId: membership.organization_id, actingUserId: user.id, authMethod: "session" };
}
