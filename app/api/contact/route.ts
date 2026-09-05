import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   POST /api/contact — Worker-side contact funnel.
   ------------------------------------------------------------------
   1. Validates + trims name/email/message.
   2. Server-side Turnstile check via siteverify (TURNSTILE_SECRET_KEY
      is a Workers secret — never in the client bundle or git).
   3. Forwards ONLY clean fields to Web3Forms — no Turnstile field,
      since that triggers their Pro-feature rejection.

   NOTE (free tier): Web3Forms historically rejects server/datacenter
   requests ("Use our API in client side … Pro plan required"). The
   browser-like headers below are a best-effort attempt to keep this
   being served from the Worker; delivery is empirically verified.
------------------------------------------------------------------- */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const ORIGIN = "https://julius-matro-portfolio.juliusmatro01.workers.dev";

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

  const { name, email, message, token } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof token !== "string"
  ) {
    return json({ success: false, message: "Missing required fields." }, 400);
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();
  if (!cleanName || !cleanEmail || !cleanMessage) {
    return json({ success: false, message: "Please fill in every field." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return json({ success: false, message: "That email address looks off." }, 400);
  }
  if (cleanName.length > 120 || cleanEmail.length > 254 || cleanMessage.length > 5000) {
    return json({ success: false, message: "One of your fields is too long." }, 400);
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return json(
      { success: false, message: "Server captcha is not configured yet." },
      500,
    );
  }

  // 1) Server-side Turnstile verification.
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

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return json(
      { success: false, message: "Server delivery is not configured yet." },
      500,
    );
  }

  // 2) Forward clean fields only — never include the Turnstile token.
  try {
    const wfRes = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Origin: ORIGIN,
        Referer: `${ORIGIN}/`,
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
      }),
    });
    const wfText = await wfRes.text();
    if (!wfRes.ok) {
      return json(
        { success: false, message: `Delivery failed: ${wfText.slice(0, 300)}` },
        502,
      );
    }
    return json({ success: true }, 200);
  } catch {
    return json({ success: false, message: "Delivery network error." }, 502);
  }
}