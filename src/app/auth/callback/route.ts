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
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
