import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Creates a Paddle transaction server-side using the secret API key, then
// hands back only a transaction ID for the browser to render. This keeps
// PADDLE_API_KEY off the client entirely — the browser never needs it, only
// the public client-side token (used separately just to display the form).
const Body = z.object({ priceId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  const { priceId } = parsed.data;

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "You don't belong to an organization yet" }, { status: 400 });

  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Payments aren't configured yet (missing PADDLE_API_KEY)" }, { status: 500 });

  const apiBase =
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  const paddleRes = await fetch(`${apiBase}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: { organization_id: membership.organization_id },
      customer: user.email ? { email: user.email } : undefined,
    }),
  });

  const paddleData = await paddleRes.json();

  if (!paddleRes.ok) {
    return NextResponse.json({ error: paddleData?.error?.detail ?? "Failed to create transaction" }, { status: 400 });
  }

  return NextResponse.json({ transactionId: paddleData.data.id });
}

