import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
  classification: z.enum(["prohibited", "high", "limited", "minimal"]),
  source: z.string().default("risk_checker"),
});

const CLASSIFICATION_COPY: Record<string, { label: string; blurb: string }> = {
  prohibited: {
    label: "Prohibited",
    blurb: "your system may fall under Article 5's prohibited practices",
  },
  high: {
    label: "High-risk",
    blurb: "your system likely falls under Annex III and would be classified high-risk",
  },
  limited: {
    label: "Limited risk",
    blurb: "your system likely falls under the Article 50 transparency obligations",
  },
  minimal: {
    label: "Minimal risk",
    blurb: "your system doesn't appear to trigger the EU AI Act's specific obligations",
  },
};

// Sends the "documented Annex IV starting point" follow-up email via Resend's
// HTTP API directly (no SDK dependency needed). Silently no-ops if
// RESEND_API_KEY isn't configured, so lead capture still succeeds even before
// email is set up.
async function sendFollowUpEmail(email: string, classification: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const copy = CLASSIFICATION_COPY[classification];
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Attestly <hello@attestly.online>";

  const html = `
    <p>Hi,</p>
    <p>You just ran the free EU AI Act risk checker at Attestly, and based on what you selected, ${copy.blurb}.</p>
    <p><strong>Classification: ${copy.label}</strong></p>
    <p>This is a directional, educational read, not legal advice or a legal classification — see the tool for full context.</p>
    <p>If you'd like to start turning your AI agent's runtime traces into a documented Annex IV starting point, you can sign up for Attestly's free tier here: <a href="https://attestly.online/login?next=%2Fdashboard%2Fsystems%2Fnew">https://attestly.online/login?next=%2Fdashboard%2Fsystems%2Fnew</a></p>
    <p>— Attestly</p>
    <p style="font-size:12px;color:#888;">You're receiving this because you entered your email on attestly.online's free risk checker.</p>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: email,
        subject: `Your EU AI Act risk checker result: ${copy.label}`,
        html,
      }),
    });
  } catch {
    // Best-effort: the lead is already saved in Supabase regardless of email delivery.
  }
}

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

  await sendFollowUpEmail(parsed.data.email, parsed.data.classification);

  return NextResponse.json({ ok: true });
}
