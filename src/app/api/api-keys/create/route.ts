import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/apiKeys";
import { z } from "zod";

// Human-provisioned only: this route requires a logged-in dashboard session.
// There is no public, unauthenticated self-registration endpoint — an agent
// never creates its own key, a human account owner creates one for it.
const Body = z.object({
  name: z.string().min(1),
  organization_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  let organizationId: string;

  if (parsed.data.organization_id) {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("organization_id", parsed.data.organization_id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "You're not a member of that organization." }, { status: 403 });
    }
    organizationId = membership.organization_id;
  } else {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "No organization found for your account." }, { status: 400 });
    }
    organizationId = membership.organization_id;
  }

  const { plaintext, hash, prefix } = generateApiKey();

  const { data: row, error } = await supabase
    .from("api_keys")
    .insert({
      organization_id: organizationId,
      name: parsed.data.name,
      key_hash: hash,
      key_prefix: prefix,
      created_by: user.id,
    })
    .select("id, name, key_prefix, created_at")
    .single();

  if (error || !row) {
    return NextResponse.json({ error: error?.message ?? "Failed to create API key" }, { status: 400 });
  }

  // The plaintext key is returned exactly once, here, and never stored
  // anywhere — only its hash lives in the database from this point on.
  return NextResponse.json({ ...row, key: plaintext });
}
