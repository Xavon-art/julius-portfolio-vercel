"use client";

/* ------------------------------------------------------------------
   PhoneDemo — the interactive "inside the app" demo.
   ------------------------------------------------------------------
   Owns the demo's state (entities / checklist / roster / feed arrays,
   all seeded from <Project.demo>) and drives the four screens through
   the theme for this project. Every visit starts fresh — no state is
   persisted. The parent ProjectDemoSection wraps this in the right
   device frame (phone / laptop / browser).
------------------------------------------------------------------ */

import { useState } from "react";
import {
  ClipboardCheck,
  MapPin,
  StickyNote,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DemoSlot, JobRow, Project, RouteStopRow, TeamRow } from "@/lib/projects";
import { getDemoTheme } from "@/components/projects/demo/theme";
import { EntityScreen, type EntityInput } from "@/components/projects/demo/EntityScreen";
import { ChecklistScreen } from "@/components/projects/demo/ChecklistScreen";
import { RosterScreen } from "@/components/projects/demo/RosterScreen";
import { FeedScreen } from "@/components/projects/demo/FeedScreen";

interface TabItem {
  id: DemoSlot;
  icon: LucideIcon;
  label: string;
}

interface PhoneDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
}

export function PhoneDemo({ project, tab, onTabChange }: PhoneDemoProps) {
  const demo = project.demo;
  const theme = getDemoTheme(project.slug);
  const memberOptions = demo.team.map((m) => m.name);

  const [jobs, setJobs] = useState<JobRow[]>(demo.jobs);
  const [route, setRoute] = useState<RouteStopRow[]>(demo.route);
  const [team, setTeam] = useState<TeamRow[]>(demo.team);
  const [notes, setNotes] = useState(demo.notes);

  const normalize = (row: JobRow): JobRow => {
    const next = theme.derive(row);
    return { ...row, status: next.status, tone: next.tone, eta: next.eta };
  };

  const addJob = (row: EntityInput) =>
    setJobs((rows) => [
      { ...normalize({ ...row, status: "", tone: "outline" }), highlighted: true },
      ...rows,
    ]);

  const updateJob = (id: string, patch: Partial<JobRow>) =>
    setJobs((rows) =>
      rows.map((row) =>
        row.id === id ? { ...normalize({ ...row, ...patch }), highlighted: true } : row,
      ),
    );

  const deleteJob = (id: string) =>
    setJobs((rows) => rows.filter((row) => row.id !== id));

  const cycleJob = (id: string) =>
    setJobs((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = (theme.statusLadder.findIndex((s) => s.label === row.status) + 1) % theme.statusLadder.length;
        return { ...row, status: theme.statusLadder[next].label, tone: theme.statusLadder[next].tone };
      }),
    );

  const setJobStatus = (id: string, status: string, tone: JobRow["tone"]) =>
    setJobs((rows) =>
      rows.map((row) => (row.id === id ? { ...row, status, tone } : row)),
    );

  const toggleRoute = (id: string) =>
    setRoute((rows) => rows.map((row) => (row.id === id ? { ...row, done: !row.done } : row)));

  const moveRoute = (id: string, dir: -1 | 1) =>
    setRoute((rows) => {
      const i = rows.findIndex((row) => row.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return rows;
      const copy = [...rows];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const recalcRoute = () =>
    setRoute((rows) => {
      const copy = [...rows];
      for (let i = copy.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[k]] = [copy[k], copy[i]];
      }
      return copy;
    });

  const cycleTeam = (id: string) =>
    setTeam((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = (theme.rosterStatuses.findIndex((s) => s.label === row.status) + 1) % theme.rosterStatuses.length;
        return { ...row, status: theme.rosterStatuses[next].label, tone: theme.rosterStatuses[next].tone };
      }),
    );

  const addNote = (body: string) =>
    setNotes((rows) => [
      { id: `note-${Date.now()}`, author: "You", time: "now", body },
      ...rows,
    ]);

  const tabs: TabItem[] = [
    { id: "jobs", icon: ClipboardCheck, label: theme.entityNounUpper },
    { id: "route", icon: MapPin, label: theme.checklistTitle },
    { id: "team", icon: Users, label: theme.teamTabLabel },
    { id: "notes", icon: StickyNote, label: "Notes" },
  ];

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
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {tab === "jobs" && (
          <EntityScreen
            theme={theme}
            rows={jobs}
            memberOptions={memberOptions}
            onAdd={addJob}
            onUpdate={updateJob}
            onDelete={deleteJob}
            onCycle={cycleJob}
            onSetStatus={setJobStatus}
          />
        )}
        {tab === "route" && (
          <ChecklistScreen
            theme={theme}
            steps={route}
            onToggle={toggleRoute}
            onMove={moveRoute}
            onRecalc={recalcRoute}
          />
        )}
        {tab === "team" && (
          <RosterScreen
            theme={theme}
            members={team}
            jobs={jobs}
            onCycle={cycleTeam}
          />
        )}
        {tab === "notes" && (
          <FeedScreen theme={theme} notes={notes} onAddNote={addNote} />
        )}
      </div>

      {/* tab bar */}
      <nav className="flex shrink-0 items-center justify-around border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur">
        {tabs.map((t) => {
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