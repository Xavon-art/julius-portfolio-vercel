"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, UserRound, GitBranch, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECTION_MAP } from "@/lib/sections";

/* ------------------------------------------------------------------
   Contact — bookends the experience on the paper surface, echoing the
   hero's calm. Apple-form aesthetic (underline inputs) + direct links.

   Flow: on submit the client posts name/email/message + the Turnstile
   token to /api/contact. The Worker verifies the token server-side with
   its TURNSTILE_SECRET_KEY secret, then forwards clean fields to
   Web3Forms. The site key is public by design and inlined at build.
------------------------------------------------------------------- */

interface TurnstileWidgetOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileWidgetOptions) => string;
      remove: (widgetId?: string) => void;
    };
  }
}

// Julius' real contact details.
const CONTACT_LINKS = [
  {
    label: "Email",
    value: "juliusmatro01@gmail.com",
    href: "mailto:juliusmatro01@gmail.com",
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "/in/julz-is-a-dev",
    href: "https://www.linkedin.com/in/julz-is-a-dev",
    Icon: UserRound,
  },
  {
    label: "GitHub",
    value: "@Xavon-art",
    href: "https://github.com/Xavon-art",
    Icon: GitBranch,
  },
];

const inputClass =
  "w-full border-0 border-b-2 border-ink/10 bg-transparent px-0 py-3 text-[17px] tracking-tight text-ink transition-colors duration-300 placeholder:text-ink-faint focus:border-ink focus:outline-none";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

let turnstileShell: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (!SITE_KEY) return Promise.reject(new Error("no site key"));
  if (typeof window !== "undefined" && window.turnstile) {
    return Promise.resolve();
  }
  if (!turnstileShell) {
    turnstileShell = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => {
        turnstileShell = null;
        reject(new Error("Turnstile script failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return turnstileShell;
}

export function ContactSection() {
  const contact = SECTION_MAP.contact;
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const captchaElRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [emailCopied, setEmailCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    },
    [],
  );

  // Mount the Turnstile widget for this section. It is torn down when the
  // section unmounts (SPA navigation) and re-rendered on the next visit.
  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !captchaElRef.current) return;
        if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = window.turnstile?.render(captchaElRef.current, {
          sitekey: SITE_KEY,
          theme: "light",
          callback: (token) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg(
            "The anti-bot check couldn't load — please email juliusmatro01@gmail.com directly.",
          );
        }
      });
    return () => {
      cancelled = true;
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, []);

  // The pill is a real mailto: link, so devices with a default mail app open
  // a draft. Devices/browsers without a mailto handler do nothing silently,
  // so we also copy the address and confirm it — the button always responds.
  const copyEmail = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("juliusmatro01@gmail.com");
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = "juliusmatro01@gmail.com";
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        ok = true;
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (ok) {
      setEmailCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setEmailCopied(false), 3200);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setErrorMsg(null);

    if (!SITE_KEY) {
      setStatus("error");
      setErrorMsg(
        "The contact form is still being configured — please email juliusmatro01@gmail.com directly.",
      );
      return;
    }
    if (!turnstileToken) {
      setStatus("error");
      setErrorMsg("Please complete the human check first.");
      return;
    }

    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      // The Worker verifies the Turnstile token server-side, then
      // delivers to Web3Forms. No Turnstile field leaves the Worker's
      // clean payload (that would trip Web3Forms' Pro check).
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          message: String(fd.get("message") ?? "").trim(),
          token: turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || data.success !== true) {
        throw new Error(
          typeof data.message === "string" && data.message
            ? data.message
            : `Send failed (HTTP ${res.status})`,
        );
      }
      setSubmitted(true);
    } catch (err) {
      const reason =
        err instanceof Error && err.message ? err.message : "Unknown error";
      console.error("[contact] send failed:", reason);
      setStatus("error");
      setErrorMsg(`${reason} Please try again, or email juliusmatro01@gmail.com directly.`);
    }
  };

  return (
    <SectionFrame section={contact}>
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft md:text-sm">
            Contact
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-5 text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
            Let&apos;s build something faster.
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Tell me what&apos;s slowing your business down. Software is usually
            the answer.
          </p>
        </Reveal>

        <Reveal delay={0.26}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-12 rounded-3xl bg-white/70 p-10 ring-1 ring-black/5 backdrop-blur-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
                <Check size={26} strokeWidth={2} />
              </div>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-ink">
                Message sent — I&apos;ll get back to you soon.
              </p>
              <p className="mt-3 text-[15px] text-ink-soft">
                In the meantime, reach me directly at{" "}
                <a
                  href="mailto:juliusmatro01@gmail.com"
                  className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  juliusmatro01@gmail.com
                </a>
                .
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-12 space-y-6 text-left"
            >
              <input
                type="hidden"
                name="botcheck"
                value=""
                aria-hidden="true"
                tabIndex={-1}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1 block text-sm font-medium text-ink-soft"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1 block text-sm font-medium text-ink-soft"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1 block text-sm font-medium text-ink-soft"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What are you trying to speed up?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <div
                  ref={captchaElRef}
                  className="cf-turnstile"
                  data-sitekey={SITE_KEY}
                  data-theme="light"
                  aria-label="Human verification"
                />
                {status === "error" && errorMsg && (
                  <p role="alert" className="max-w-md text-sm text-ink-soft">
                    {errorMsg}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto"
                >
                  {status === "sending" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} strokeWidth={2} className="animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.34}>
          {/* Direct links */}
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {CONTACT_LINKS.map(({ label, value, href, Icon }) => {
            const isEmail = label === "Email";
            return (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={isEmail ? copyEmail : undefined}
                  aria-live={isEmail ? "polite" : undefined}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/60 px-5 py-2.5 text-sm font-medium tracking-tight text-ink backdrop-blur-sm transition-all duration-300 hover:border-ink/40 hover:bg-white"
                >
                  <Icon size={16} strokeWidth={1.75} className="text-ink-soft transition-colors group-hover:text-ink" />
                  <span className="hidden sm:inline">{label}</span>
                  {isEmail && emailCopied ? (
                    <span className="flex items-center gap-1.5 text-ink-soft">
                      <Check size={14} strokeWidth={2} />
                      Copied
                    </span>
                  ) : (
                    <>
                      <span>{value}</span>
                      <ArrowUpRight
                        size={14}
                        strokeWidth={2}
                        className="text-ink-soft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                      />
                    </>
                  )}
                </a>
              </li>
            );
          })}
          </ul>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-10 text-sm text-ink-soft">
            Based in the Philippines · working remotely worldwide
          </p>
        </Reveal>
      </div>
    </SectionFrame>
  );
}