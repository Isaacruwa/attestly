import { NextRequest, NextResponse } from "next/server";
import { htmlToMarkdown, estimateTokenCount } from "@/lib/htmlToMarkdown";

// Markdown content negotiation
// (https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/):
// a request with `Accept: text/markdown` gets a markdown rendering of the
// same page instead of HTML; HTML stays the default for everything else.
//
// This repo has no middleware.ts before this change — there's no existing
// auth/session logic here to preserve or conflict with (Supabase session
// handling happens per-request in src/lib/supabase/server.ts instead).
//
// Scoped to public marketing/content pages only. /dashboard requires a
// login the agent doesn't have, and /api already returns JSON, so markdown
// negotiation doesn't apply to either — both are explicitly excluded below
// rather than relying on the matcher alone to keep this correct even if the
// matcher's static-asset exclusions are incomplete.
const EXCLUDED_PREFIXES = [
  "/api",
  "/dashboard",
  "/_next",
  "/auth.md",
  "/llms.txt",
  "/llms-full.txt",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/manifest",
  "/.well-known",
];

export async function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/markdown")) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  if (EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Self-fetch the normal HTML render of this same page, explicitly asking
  // for text/html so this request doesn't re-enter the markdown branch
  // above (which only triggers on an Accept header containing
  // text/markdown) — that's what prevents an infinite loop here.
  let html: string;
  try {
    const htmlRes = await fetch(req.nextUrl.toString(), {
      headers: { accept: "text/html" },
    });
    if (!htmlRes.ok) {
      return NextResponse.next();
    }
    html = await htmlRes.text();
  } catch {
    // If the self-fetch fails for any reason, fall back to serving the
    // normal HTML response rather than erroring the request outright.
    return NextResponse.next();
  }

  const markdown = htmlToMarkdown(html);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(estimateTokenCount(markdown)),
      Vary: "Accept",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
