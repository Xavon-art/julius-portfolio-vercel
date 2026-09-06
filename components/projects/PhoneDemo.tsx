"use client";

/* ------------------------------------------------------------------
   PhoneDemo — the interactive "inside the app" demo.
   ------------------------------------------------------------------
   Renders the project's four screens (jobs / routes / team / notes)
   as a live, tappable app. All four screens are fully interactive:

     jobs   — tap a job to advance it Open → In progress → Complete
     route  — tap a stop to check it off, use the chevrons to reorder
     team   — tap a member to cycle their status
     notes  — add a note to the day's log

   Pure client state seeded from <Project.demo>, so every visit starts
   fresh (no persistence). Strictly monochrome pills (solid / soft /
   outline) — no colors anywhere. The parent ProjectDemoSection wraps
   this in the right device frame (phone / laptop / browser).
------------------------------------------------------------------- */

import { useState } from "react";
import {
  ClipboardCheck,
  MapPin,
  Users,
  StickyNote,
  Check,
  ChevronUp,
  ChevronDown,
  Plus,
  type LucideIcon,
} from "lucide-react";
import type { DemoSlot, PillTone, Project } from "@/lib/projects";

const JOB_LADDER: { label: string; tone: PillTone }[] = [
  { label: "Open", tone: "outline" },
  { label: "In progress", tone: "soft" },
  { label: "Complete", tone: "solid" },
];

const TEAM_LADDER: { label: string; tone: PillTone }[] = [
  { label: "Standby", tone: "outline" },
  { label: "On the move", tone: "soft" },
  { label: "Away", tone: "outline" },
];

const TONE_CLASS: Record<PillTone, string> = {
  solid: "bg-ink text-white",
  soft: "bg-ink/10 text-ink ring-1 ring-ink/10",
  outline: "ring-1 ring-ink/15 text-ink-soft",
};

interface TabItem {
  id: DemoSlot;
  icon: LucideIcon;
  label: string;
}

const TABS: TabItem[] = [
  { id: "jobs", icon: ClipboardCheck, label: "Jobs" },
  { id: "route", icon: MapPin, label: "Routes" },
  { id: "team", icon: Users, label: "Team" },
  { id: "notes", icon: StickyNote, label: "Notes" },
];

function Pill({ tone, children }: { tone: PillTone; children: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-tight ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

interface PhoneDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
}

export function PhoneDemo({ project, tab, onTabChange }: PhoneDemoProps) {
  const demo = project.demo;

  const [jobs, setJobs] = useState(demo.jobs);
  const [team, setTeam] = useState(demo.team);
  const [route, setRoute] = useState(demo.route);
  const [notes, setNotes] = useState(demo.notes);
  const [draft, setDraft] = useState("");

  const cycleJob = (id: string) => {
    setJobs((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = (JOB_LADDER.findIndex((s) => s.label === row.status) + 1) % JOB_LADDER.length;
        return { ...row, status: JOB_LADDER[next].label, tone: JOB_LADDER[next].tone };
      }),
    );
  };

  const cycleTeam = (id: string) => {
    setTeam((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = (TEAM_LADDER.findIndex((s) => s.label === row.status) + 1) % TEAM_LADDER.length;
        return { ...row, status: TEAM_LADDER[next].label, tone: TEAM_LADDER[next].tone };
      }),
    );
  };

  const toggleRoute = (id: string) => {
    setRoute((rows) =>
      rows.map((row) => (row.id === id ? { ...row, done: !row.done } : row)),
    );
  };

  const moveRoute = (id: string, dir: -1 | 1) => {
    setRoute((rows) => {
      const i = rows.findIndex((row) => row.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return rows;
      const copy = [...rows];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const addNote = () => {
    const body = draft.trim();
    if (!body) return;
    setNotes((rows) => [
      { id: `you-${Date.now()}`, author: "You", time: "now", body },
      ...rows,
    ]);
    setDraft("");
  };

  return (
    <div className="flex h-full select-none flex-col bg-[#f4f4f6] text-ink">
      {/* in-app header */}
      <div className="flex items-center justify-between px-3 pb-2 pt-2.5">
        <p className="text-[11px] font-semibold tracking-tight text-ink">
          {project.name}
        </p>
        <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          Live demo
        </span>
      </div>

      {/* active screen */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-2">
        {tab === "jobs" &&
          jobs.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => cycleJob(row.id)}
              className="w-full rounded-2xl bg-white p-3 text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                    {row.title}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                    {row.sub}
                  </p>
                </div>
                <Pill tone={row.tone}>{row.status}</Pill>
              </div>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                {row.eta}
              </p>
            </button>
          ))}

        {tab === "route" &&
          route.map((step, i) => (
            <div
              key={step.id}
              className="flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-black/5"
            >
              <button
                type="button"
                aria-label={step.done ? "Mark stop incomplete" : "Mark stop complete"}
                onClick={() => toggleRoute(step.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                  step.done ? "bg-ink text-white" : "ring-1 ring-ink/20 text-transparent hover:ring-ink/50"
                }`}
              >
                <Check size={12} strokeWidth={3} />
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-[12px] font-semibold tracking-tight ${
                    step.done ? "text-ink-faint line-through" : "text-ink"
                  }`}
                >
                  {i + 1}. {step.label}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-ink-faint">
                  {step.detail}
                </p>
              </div>
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label={`Move ${step.label} up`}
                  disabled={i === 0}
                  onClick={() => moveRoute(step.id, -1)}
                  className="rounded p-0.5 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${step.label} down`}
                  disabled={i === route.length - 1}
                  onClick={() => moveRoute(step.id, 1)}
                  className="rounded p-0.5 text-ink-faint transition-colors hover:text-ink disabled:opacity-25"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          ))}

        {tab === "team" &&
          team.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => cycleTeam(member.id)}
              className="flex w-full items-center justify-between gap-2 rounded-2xl bg-white p-3 text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.98]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/10 text-[11px] font-bold text-ink">
                  {member.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                    {member.name}
                  </p>
                  <p className="truncate text-[10px] text-ink-faint">{member.role}</p>
                </div>
              </div>
              <Pill tone={member.tone}>{member.status}</Pill>
            </button>
          ))}

        {tab === "notes" && (
          <>
            {notes.map((note) => (
              <div key={note.id} className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold tracking-tight text-ink">
                    {note.author}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                    {note.time}
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                  {note.body}
                </p>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 ring-1 ring-black/5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNote();
                }}
                placeholder="Add a note…"
                className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[11px] outline-none placeholder:text-ink-faint"
              />
              <button
                type="button"
                aria-label="Add note"
                disabled={!draft.trim()}
                onClick={addNote}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors disabled:opacity-30"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          </>
        )}

        {tab === "jobs" && jobs.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-faint">No jobs.</p>
        )}
        {tab === "team" && team.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-faint">No team members.</p>
        )}
        {tab === "route" && route.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-faint">No stops.</p>
        )}
        {tab === "notes" && notes.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-ink-faint">No notes yet.</p>
        )}
      </div>

      {/* tab bar */}
      <nav className="flex shrink-0 items-center justify-around border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-tight transition-colors ${
                active ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Icon size={12} strokeWidth={2.25} />
              <span className="hidden min-[200px]:inline">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}