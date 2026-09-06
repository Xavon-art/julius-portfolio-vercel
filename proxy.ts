import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   proxy.ts — strips framework/build-tool attribution from responses.
   Removes the OpenNext worker banner and Next's internal cache
   diagnostic headers from every HTML/RSC/API/doc response so the stack
   stays out of the way. Static chunks, images, and favicons skip the
   proxy entirely. (X-Powered-By is already disabled via
   poweredByHeader in next.config.)
------------------------------------------------------------------- */

const ATTRIBUTION_HEADERS = [
  "x-powered-by",
  "x-opennext",
  "x-nextjs-cache",
  "x-nextjs-prerender",
  "x-nextjs-stale-time",
];

export function proxy() {
  const response = NextResponse.next();
  for (const name of ATTRIBUTION_HEADERS) {
    response.headers.delete(name);
  }
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon).*)",
};