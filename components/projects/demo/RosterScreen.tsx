/* ------------------------------------------------------------------
   RosterScreen — the team / roster tab.
   ------------------------------------------------------------------
   Tapping a member expands the card to reveal what they're assigned
   to right now (derived from the entity list, so it stays in sync with
   changes made on the Jobs/Stock/Projects tab). The status pill cycles
   the theme's roster ladder to simulate availability updates.
------------------------------------------------------------------ */

import { useState } from "react";
import { motion } from "framer-motion";
import type { JobRow, TeamRow } from "@/lib/projects";
import type { DemoTheme } from "./theme";
import { Avatar, Pill } from "./primitives";
import { EASE } from "./primitives";

interface RosterScreenProps {
  theme: DemoTheme;
  members: TeamRow[];
  jobs: JobRow[];
  onCycle: (id: string) => void;
}

export function RosterScreen({ theme, members, jobs, onCycle }: RosterScreenProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-4 py-8 text-center">
        <p className="text-[12px] leading-relaxed text-ink-faint">No team to show.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] leading-relaxed text-ink-faint">
        {theme.rosterNote}
      </p>
      {members.map((member) => {
        const expanded = expandedId === member.id;
        const assigned = jobs
          .filter((j) => j.member === member.name)
          .map((j) => j.title);
        return (
          <motion.div
            key={member.id}
            layout
            transition={{ duration: 0.25, ease: EASE }}
            className="w-full cursor-pointer rounded-2xl bg-white p-3 text-left ring-1 ring-black/5 transition-all duration-200 ease-apple active:scale-[0.99]"
            onClick={() => setExpandedId(expanded ? null : member.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={member.name} />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold tracking-tight text-ink">
                    {member.name}
                  </p>
                  <p className="truncate text-[10px] text-ink-faint">{member.role}</p>
                </div>
              </div>
              <Pill
                tone={member.tone}
                asButton
                onClick={(e) => {
                  e.stopPropagation();
                  onCycle(member.id);
                }}
                ariaLabel={`${member.name} is ${member.status}. Tap to update`}
              >
                {member.status}
              </Pill>
            </div>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-1.5 border-t border-black/5 pt-2.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                    {theme.entityNounUpper === "Projects"
                      ? "Active account"
                      : "Assigned right now"}
                  </p>
                  {assigned.length > 0 ? (
                    assigned.map((title) => (
                      <p
                        key={title}
                        className="truncate text-[11px] font-semibold text-ink"
                      >
                        · {title}
                      </p>
                    ))
                  ) : (
                    <p className="text-[11px] text-ink-faint">
                      None — {member.name.split(" ")[0]} is free to take work.
                    </p>
                  )}
                  <p className="pt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                    Tap the status pill to update
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}