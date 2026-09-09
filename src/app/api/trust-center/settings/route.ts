import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({
  enabled: z.boolean(),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use only lowercase letters, numbers, and hyphens"),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { enabled, slug } = parsed.data;

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "You don't belong to an organization" }, { status: 400 });
  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json({ error: "Only an owner or admin can change Trust Center settings" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("organizations")
    .update({ trust_center_enabled: enabled, trust_center_slug: slug })
    .eq("id", membership.organization_id);

  if (updateError) {
    // Postgres unique_violation on the slug column
    if (updateError.code === "23505") {
      return NextResponse.json({ error: "That link is already taken — try another." }, { status: 409 });
    }
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ status: "ok", slug });
}
