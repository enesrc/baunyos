import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["tr", "en"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignore next internals & static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // "/" -> "/tr"
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/tr";
    return NextResponse.redirect(url);
  }

  // If path doesn't start with a locale, prefix with /tr
  const seg = pathname.split("/")[1];
  if (!isLocale(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/tr${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};