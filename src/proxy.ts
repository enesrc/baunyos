import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["tr", "en"] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = "en";

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("MIDDLEWARE HIT:", pathname, req.method);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (req.method !== "GET") {
    return NextResponse.next();
  }

  const firstSeg = pathname.split("/")[1];

  if (isLocale(firstSeg)) {
    return NextResponse.next();
  }

  // Prefix yok → varsayılan locale ile rewrite
  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)" ],
};