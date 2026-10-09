"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, UserRound, GitBranch, ArrowUpRight, Check, Loader2, Sparkles } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECTION_MAP, type SectionProps } from "@/lib/sections";

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

const CONTACT_LINKS = [
  {
    label: "Email",
    value: "juliusmatro02@gmail.com",
    href: "mailto:juliusmatro02@gmail.com",
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
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

let turnstileShell: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (!SITE_KEY) return Promise.reject(new Error("no site key"));
  if (typeof window !== "undefined" && window.turnstile) {
    return Promise.resolve();
  }
  if (!turnstileShell) {
    turnstileShell = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
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

export function ContactSection({ navigate }: SectionProps) {
  const contact = SECTION_MAP.contact;
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const captchaElRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [emailCopied, setEmailCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

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
          setErrorMsg("The anti-bot check couldn't load — please email juliusmatro02@gmail.com directly.");
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

  const copyEmail = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("juliusmatro02@gmail.com");
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = "juliusmatro02@gmail.com";
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

    if (!SITE_KEY || !ACCESS_KEY) {
      setStatus("error");
      setErrorMsg("The contact form is still being configured — please email juliusmatro02@gmail.com directly.");
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
      const verifyRes = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verify = (await verifyRes.json().catch(() => ({}))) as { success?: boolean };
      if (!verifyRes.ok || verify.success !== true) {
        setStatus("error");
        setErrorMsg("Captcha verification failed. Please try again.");
        return;
      }

      fd.delete("cf-turnstile-response");
      fd.append("access_key", ACCESS_KEY);
      const sendRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
      const sent = (await sendRes.json().catch(() => ({}))) as { success?: boolean };
      if (!sendRes.ok || sent.success !== true) {
        setStatus("error");
        setErrorMsg("Something went wrong sending your message. Please try again or email juliusmatro02@gmail.com directly.");
        return;
      }

      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
      setSubmitted(true);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong sending your message. Please try again or email juliusmatro02@gmail.com directly.");
    }
  };

  return (
    <SectionFrame section={contact}>
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ink-soft md:text-sm">
            Contact
          </p>
        </Reveal>

        <Reveal delay={0.1}>
            <h2 className="mt-6 text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.03] tracking-[-0.05em] text-ink">
            Let&apos;s build something cinematic
          </h2>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Tell me what&apos;s slowing your business down. We&apos;ll turn it into
            software that feels as good as it performs.
          </p>
        </Reveal>

        <Reveal delay={0.26}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-12 rounded-[2rem] bg-white/80 p-10 ring-1 ring-black/5 backdrop-blur"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-aurora-violet/25 via-aurora-cyan/20 to-aurora-amber/20 text-ink">
                <Check size={26} strokeWidth={2} />
              </div>
              <p className="mt-6 text-2xl font-semibold tracking-tight text-ink">
                Message sent — I&apos;ll get back to you soon
              </p>
              <p className="mt-3 text-[15px] text-ink-soft">
                In the meantime, reach me directly at{" "}
                <a
                  href="mailto:juliusmatro02@gmail.com"
                  className="font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                >
                  juliusmatro02@gmail.com
                </a>
                .
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-12 space-y-6 text-left">
              <input type="hidden" name="botcheck" value="" aria-hidden="true" tabIndex={-1} />
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-ink-soft">
                    Name
                  </label>
                  <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-ink-soft">
                    Email
                  </label>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-ink-soft">
                  Message
                </label>
                <textarea id="contact-message" name="message" required rows={4} placeholder="What are you trying to speed up?" className={`${inputClass} resize-none`} />
              </div>

              <div className="flex flex-col items-center gap-3 pt-1">
                <div ref={captchaElRef} className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="light" aria-label="Human verification" />
                {status === "error" && errorMsg && (
                  <p role="alert" className="max-w-md text-sm text-ink-soft">
                    {errorMsg}
                  </p>
                )}
                <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
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
                    className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white/80 px-5 py-2.5 text-sm font-medium tracking-tight text-ink backdrop-blur transition-all duration-300 hover:border-ink/40 hover:bg-white"
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
                        <ArrowUpRight size={14} strokeWidth={2} className="text-ink-soft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm text-ink-soft ring-1 ring-black/5 backdrop-blur">
            <Sparkles size={16} strokeWidth={1.5} />
            Based in the Philippines · working remotely worldwide
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );
}