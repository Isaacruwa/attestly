import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({
  name: z.string().min(1),
});

// Creates a new organization (client workspace) owned by the current user.
// Reuses the same atomic RPC the signup flow uses for a person's first org,
// so the new org gets a membership row + subscription row exactly the same
// way. This is what powers agency/multi-client tooling: one account can
// call this repeatedly to spin up an isolated workspace per client.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { data: newOrgId, error: rpcError } = await supabase.rpc("create_organization_for_current_user", {
    org_name: parsed.data.name,
  });

  if (rpcError || !newOrgId) {
    return NextResponse.json({ error: rpcError?.message ?? "Couldn't create the client workspace." }, { status: 400 });
  }

  return NextResponse.json({ id: newOrgId });
}
