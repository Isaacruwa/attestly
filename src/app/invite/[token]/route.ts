import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Landing point for a team invite link. If the visitor isn't signed in yet,
// bounces them to login first (preserving this URL as the destination to
// return to afterward). Once signed in, calls the atomic accept function and
// sends them to the dashboard — now a member of the org that invited them.
export async function GET(request: Request, { params }: { params: { token: string } }) {
  const { origin } = new URL(request.url);
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?next=${encodeURIComponent(`/invite/${params.token}`)}`);
  }

  const { error } = await supabase.rpc("accept_organization_invite", { p_token: params.token });

  if (error) {
    return NextResponse.redirect(`${origin}/dashboard?invite_error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
