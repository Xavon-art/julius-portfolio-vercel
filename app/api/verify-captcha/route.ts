import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   POST /api/verify-captcha — server-side Turnstile verification only.
   ------------------------------------------------------------------
   This route exists solely to verify the visitor's Turnstile token with
   Cloudflare's siteverify endpoint. It forwards nothing to Web3Forms —
   the actual form submission happens client-side from the visitor's own
   browser/IP, which keeps Web3Forms happy with per-visitor IPs (the
   Worker's shared egress IP caused rate-limiting).

   TURNSTILE_SECRET_KEY is a Cloudflare Workers secret — never in the
   client bundle, never in git.
------------------------------------------------------------------- */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const token =
    typeof body === "object" && body !== null && "token" in body
      ? (body as { token: unknown }).token
      : null;
  if (typeof token !== "string" || token.length < 10) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const verify = (await verifyRes.json().catch(() => ({}))) as {
    success?: boolean;
  };

  return verify.success === true
    ? NextResponse.json({ success: true })
    : NextResponse.json({ success: false }, { status: 400 });
}