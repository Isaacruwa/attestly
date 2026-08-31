import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase's magic-link email points here first. The link carries a one-time
// `code` that must be exchanged for a real session on the server — without
// this route, clicking the email link never actually signs you in, and
// middleware bounces you straight back to /login.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // First-ever sign-in for this account: every AI system has to belong
      // to an organization, so brand-new accounts get a personal one
      // automatically. Existing members skip this silently.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && !next.startsWith("/invite/")) {
        const { data: membership } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (!membership) {
          const orgName = user.email ? `${user.email.split("@")[0]}'s organization` : "My organization";
          await supabase.rpc("create_organization_for_current_user", { org_name: orgName });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
