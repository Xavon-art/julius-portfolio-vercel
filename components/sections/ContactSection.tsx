"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, UserRound, GitBranch, ArrowUpRight, Check } from "lucide-react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SECTION_MAP } from "@/lib/sections";

/* ------------------------------------------------------------------
   Contact — bookends the experience on the paper surface, echoing the
   hero's calm. Apple-form aesthetic (underline inputs), plus direct
   links.
   ------------------------------------------------------------------
   The form has no backend yet — submitting shows a success state.
   PLACEHOLDER: wire onSubmit to your preferred endpoint (a Next.js
   route handler, Formspree, Resend, …) and remove the test branch.
   The email/LinkedIn/GitHub links below are also placeholders.
------------------------------------------------------------------- */

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

export function ContactSection() {
  const contact = SECTION_MAP.contact;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // PLACEHOLDER: POST the form data to your message backend here.
    // For now we simulate success to keep the UI honest and complete.
    setSubmitted(true);
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
                Thanks — I&apos;ll get back to you soon.
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

              <div className="flex justify-center pt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal delay={0.34}>
          {/* Direct links */}
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {CONTACT_LINKS.map(({ label, value, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/60 px-5 py-2.5 text-sm font-medium tracking-tight text-ink backdrop-blur-sm transition-all duration-300 hover:border-ink/40 hover:bg-white"
                >
                  <Icon size={16} strokeWidth={1.75} className="text-ink-soft transition-colors group-hover:text-ink" />
                  <span className="hidden sm:inline">{label}</span>
                  <span>{value}</span>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="text-ink-soft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                  />
                </a>
              </li>
            ))}
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