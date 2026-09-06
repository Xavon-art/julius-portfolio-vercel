/* ------------------------------------------------------------------
   projectIcons — render icon *ids* from lib/projects.ts via stable
   wrapper components. Data stays serializable across the Server →
   Client boundary (project objects in lib/projects.ts must never hold
   function/reference values), and the wrappers keep the React Compiler
   happy (no components created during render).
------------------------------------------------------------------- */

import {
  Route,
  Boxes,
  FolderKanban,
  ClipboardCheck,
  MapPin,
  Users,
  StickyNote,
} from "lucide-react";
import type { DemoSlot } from "@/lib/projects";

interface PictoProps {
  id: string;
  size?: number;
  strokeWidth?: number;
}

export function ProjectPictogram({
  id,
  size = 20,
  strokeWidth = 2,
}: PictoProps) {
  switch (id) {
    case "boxes":
      return <Boxes size={size} strokeWidth={strokeWidth} />;
    case "folder-kanban":
      return <FolderKanban size={size} strokeWidth={strokeWidth} />;
    default:
      return <Route size={size} strokeWidth={strokeWidth} />;
  }
}

export function FeaturePictogram({
  id,
  size = 18,
  strokeWidth = 2,
}: PictoProps) {
  switch (id as DemoSlot) {
    case "route":
      return <MapPin size={size} strokeWidth={strokeWidth} />;
    case "team":
      return <Users size={size} strokeWidth={strokeWidth} />;
    case "notes":
      return <StickyNote size={size} strokeWidth={strokeWidth} />;
    default:
      return <ClipboardCheck size={size} strokeWidth={strokeWidth} />;
  }
}