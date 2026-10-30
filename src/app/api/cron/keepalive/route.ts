import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Keep-alive: runs a tiny real query so the Supabase free-tier project is
// never idle for 7 days. Called by Vercel Cron (see vercel.json) and by a
// GitHub Actions backup (.github/workflows/keepalive.yml).
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
    const { error } = await supabase
      .from("compliance_requirements")
      .select("section_key", { count: "exact", head: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, checked_at: new Date().toISOString() });
  } catch (err) {
    // Server-side log only (visible in Vercel logs); the response stays generic.
    console.error("keepalive failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
