import { NextResponse, type NextRequest } from "next/server";
import { SERVICES } from "@/lib/services";

const HIRE_SLUGS = new Set(SERVICES.map((s) => s.slug));

const STATIC_FILE = /\.(?:webp|png|jpe?g|gif|svg|avif|ico|mp4|webm|woff2?|txt|json|xml)$/i;

/**
 * Unknown /hire/ slugs render the not-found page, but the page has already
 * started streaming by then, so the status would be 200 (a "soft 404" that
 * search engines may index). Answer them here instead, with a real 404.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  // Images and other static files live under /hire/ too (/hire/cta.png); only page slugs get judged.
  if (slug && !STATIC_FILE.test(slug) && !HIRE_SLUGS.has(slug)) {
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/hire/:slug",
};
