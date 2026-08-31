import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  const { email } = parsed.data;

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "You don't belong to an organization yet" }, { status: 400 });

  const { data: invite, error: insertError } = await supabase
    .from("organization_invites")
    .insert({ organization_id: membership.organization_id, email: email.toLowerCase(), invited_by: user.id })
    .select("token")
    .single();

  if (insertError || !invite) {
    return NextResponse.json({ error: insertError?.message ?? "Failed to create invite" }, { status: 400 });
  }

  const inviteUrl = `${req.nextUrl.origin}/invite/${invite.token}`;

  // Sending failures here don't roll back the invite — it still exists and
  // can be shared manually — but the person does need to know it happened.
  if (process.env.RESEND_API_KEY) {
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Attestly <onboarding@resend.dev>",
          to: [email],
          subject: `${user.email} invited you to Attestly`,
          html: `<p>You've been invited to join an organization on Attestly.</p><p><a href="${inviteUrl}">Accept invite</a></p>`,
        }),
      });
      if (!emailRes.ok) {
        const detail = await emailRes.text();
        return NextResponse.json({ warning: `Invite created, but the email failed to send: ${detail}`, invite_url: inviteUrl });
      }
    } catch (err: any) {
      return NextResponse.json({ warning: `Invite created, but the email failed to send: ${err.message}`, invite_url: inviteUrl });
    }
  } else {
    return NextResponse.json({ warning: "Invite created. Email sending isn't configured yet — share this link directly.", invite_url: inviteUrl });
  }

  return NextResponse.json({ status: "sent", invite_url: inviteUrl });
}
