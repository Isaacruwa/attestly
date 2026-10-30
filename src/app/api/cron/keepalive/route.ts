import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Keep-alive: does a real read AND a real write (re-saving one row with its
// own value, so no data changes) so the Supabase free-tier project always
// counts as active. Called daily by Vercel Cron (vercel.json) and every other
// day by a GitHub Actions backup (.github/workflows/keepalive.yml).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" automatically when
  // the CRON_SECRET env var is set. If it is set, require it.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("compliance_requirements")
      .select("section_key, sort_order")
      .limit(1)
      .maybeSingle();
    if (error) throw error;

    if (data) {
      const { error: writeError } = await supabase
        .from("compliance_requirements")
        .update({ sort_order: data.sort_order })
        .eq("section_key", data.section_key);
      if (writeError) throw writeError;
    }

    return NextResponse.json({ ok: true, checked_at: new Date().toISOString() });
  } catch (err) {
    // Server-side log only (visible in Vercel logs); the response stays generic.
    console.error("keepalive failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
