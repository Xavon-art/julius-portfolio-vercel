"use client";

/* ------------------------------------------------------------------
   PhoneDemo — the interactive "inside the app" demo.
   ------------------------------------------------------------------
   Thin dispatcher between the shared four-screen demo (ThemedDemo,
   used by Field Ops Suite and Client Portal) and the inventory-native
   three-tab demo (InventoryDemo). The parent ProjectDemoSection wraps
   this in the right device frame (phone / laptop / browser).
------------------------------------------------------------------ */

import type { DemoSlot, Project } from "@/lib/projects";
import { ThemedDemo } from "@/components/projects/demo/ThemedDemo";
import { InventoryDemo } from "@/components/projects/demo/InventoryDemo";

interface PhoneDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
}

export function PhoneDemo({ project, tab, onTabChange }: PhoneDemoProps) {
  return project.slug === "inventory-manager" ? (
    <InventoryDemo project={project} tab={tab} onTabChange={onTabChange} />
  ) : (
    <ThemedDemo project={project} tab={tab} onTabChange={onTabChange} />
  );
}