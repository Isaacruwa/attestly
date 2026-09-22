import { NextRequest, NextResponse } from "next/server";

// Sets an x-locale request header based on the URL path (/fr/*, /de/*, or
// default English) so the root layout can render the correct <html lang>
// attribute. The root layout is a single Server Component shared by every
// route, so it can't know the current path on its own — middleware is the
// standard way to thread that through via next/headers.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.startsWith("/fr") ? "fr" : pathname.startsWith("/de") ? "de" : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
