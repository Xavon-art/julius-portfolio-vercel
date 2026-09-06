"use client";

/* ------------------------------------------------------------------
   PhoneDemo — the interactive "inside the app" demo.
   ------------------------------------------------------------------
   Thin dispatcher between the shared four-screen demo (ThemedDemo,
   used by Field Ops Suite), the inventory-native three-tab demo
   (InventoryDemo), and the Client Portal's four-tab web dashboard
   (ClientPortalDemo, device-aware). The parent ProjectDemoSection
   wraps this in the right device frame (phone / laptop / browser)
   and owns the device-view toggle.
------------------------------------------------------------------ */

import type { DemoSlot, Project } from "@/lib/projects";
import { ThemedDemo } from "@/components/projects/demo/ThemedDemo";
import { InventoryDemo } from "@/components/projects/demo/InventoryDemo";
import { ClientPortalDemo, type DeviceView } from "@/components/projects/demo/ClientPortalDemo";

interface PhoneDemoProps {
  project: Project;
  tab: DemoSlot;
  onTabChange: (tab: DemoSlot) => void;
  device?: DeviceView;
}

export function PhoneDemo({ project, tab, onTabChange, device }: PhoneDemoProps) {
  if (project.slug === "inventory-manager") {
    return <InventoryDemo project={project} tab={tab} onTabChange={onTabChange} />;
  }
  if (project.slug === "client-portal") {
    return (
      <ClientPortalDemo
        project={project}
        tab={tab}
        onTabChange={onTabChange}
        device={device ?? "laptop"}
      />
    );
  }
  return <ThemedDemo project={project} tab={tab} onTabChange={onTabChange} />;
}