import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   POST /api/turnstile/verify — server-side Turnstile enforcement.
   ------------------------------------------------------------------
   The delivery POST to Web3Forms must come from the browser (free tier
   rejects server/datacenter IPs), so the client verifies its Turnstile
   token through this route BEFORE sending. The secret lives only here,
   as a Cloudflare Workers secret — never in the client bundle or git.
   Env: TURNSTILE_SECRET_KEY
------------------------------------------------------------------- */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function json(data: Record<string, unknown>, status: number) {
  return NextResponse.json(data, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, message: "Invalid request body." }, 400);
  }

  const token =
    typeof body === "object" && body !== null && "token" in body
      ? (body as { token: unknown }).token
      : null;
  if (typeof token !== "string" || token.length < 10) {
    return json({ success: false, message: "Missing captcha token." }, 400);
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return json(
      { success: false, message: "Server captcha is not configured yet." },
      500,
    );
  }

  const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const verify = (await verifyRes.json().catch(() => ({}))) as {
    success?: boolean;
  };
  if (!verify.success) {
    return json({ success: false, message: "Captcha check failed." }, 400);
  }

  return json({ success: true }, 200);
}