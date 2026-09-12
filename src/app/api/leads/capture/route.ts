import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
  classification: z.enum(["prohibited", "high", "limited", "minimal"]),
  source: z.string().default("risk_checker"),
});

// Anonymous lead capture from the free risk checker. Uses the service-role
// client because this is an unauthenticated endpoint by design — there is no
// logged-in user yet at this point in the funnel.
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("risk_checker_leads").insert({
    email: parsed.data.email,
    classification: parsed.data.classification,
    source: parsed.data.source,
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your details right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
