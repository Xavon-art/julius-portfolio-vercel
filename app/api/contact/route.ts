import { NextResponse } from "next/server";

/* ------------------------------------------------------------------
   POST /api/contact — free-form delivery with spam protection.
   ------------------------------------------------------------------
   1. Validates + trims the payload.
   2. Verifies the Cloudflare Turnstile token against the siteverify
      endpoint (uses TURNSTILE_SECRET_KEY — no Web3Forms Pro needed).
   3. Delivers via Web3Forms (free tier) so submissions land directly
      in juliusmatro01@gmail.com's inbox.
   Env: TURNSTILE_SECRET_KEY, WEB3FORMS_ACCESS_KEY.
------------------------------------------------------------------- */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

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

  const deliveryRes = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      // Kept for transparency — real protection is our own siteverify above.
      "cf-turnstile-response": token,
    }),
  });
  if (!deliveryRes.ok) {
    return json({ success: false, message: "Message could not be delivered." }, 502);
  }

  return json({ success: true }, 200);
}