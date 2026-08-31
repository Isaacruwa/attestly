import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import crypto from "crypto";

export const runtime = "nodejs";

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER ?? ""]: "starter",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_PROFESSIONAL ?? ""]: "professional",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE ?? ""]: "enterprise",
};

const PADDLE_STATUS_TO_OURS: Record<string, string> = {
  active: "active",
  trialing: "active",
  past_due: "past_due",
  paused: "paused",
  canceled: "canceled",
};

// Paddle signs every webhook: header is "ts=<unix seconds>;h1=<hex hmac>",
// where the hmac is SHA-256 of "<ts>:<raw body>" keyed with the webhook
// secret. Verifying this against the RAW body (before any JSON.parse) is
// what stops anyone else from POSTing fake "subscription activated" events
// and granting themselves a free plan.
function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(signatureHeader.split(";").map((p) => p.split("=") as [string, string]));
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "PADDLE_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("paddle-signature");

  if (!verifySignature(rawBody, signatureHeader, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event_type;
  const data = event.data;

  // Which organization this subscription belongs to travels through Paddle
  // as custom_data, set at checkout time (see the pricing page) — Paddle
  // has no native concept of our organizations, so this is the only link.
  const organizationId: string | undefined = data?.custom_data?.organization_id;
  if (!organizationId) {
    // Not one of our checkouts (or malformed) — acknowledge so Paddle
    // doesn't retry forever, but do nothing.
    return NextResponse.json({ received: true });
  }

  const supabase = createServiceRoleClient();

  if (eventType === "subscription.created" || eventType === "subscription.updated" || eventType === "subscription.activated") {
    const priceId = data.items?.[0]?.price?.id;
    const plan = PRICE_TO_PLAN[priceId] ?? "none";
    const status = PADDLE_STATUS_TO_OURS[data.status] ?? "inactive";

    await supabase.from("organization_subscriptions").upsert(
      {
        organization_id: organizationId,
        plan,
        status,
        paddle_customer_id: data.customer_id,
        paddle_subscription_id: data.id,
        current_period_end: data.current_billing_period?.ends_at ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "organization_id" }
    );
  } else if (eventType === "subscription.canceled") {
    await supabase
      .from("organization_subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("organization_id", organizationId);
  }

  return NextResponse.json({ received: true });
}
