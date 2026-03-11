import { NextRequest, NextResponse } from "next/server";
import { parseLang } from "@/features/Language/config";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const firstSeg = pathname.split("/")[1];
  const lang = parseLang(firstSeg);

  if (lang === firstSeg) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|admin|.*\\..*).*)"],
};