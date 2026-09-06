/* ------------------------------------------------------------------
   projects.ts — single source of truth for the Work section and the
   project detail pages (/work/[slug]).
   ------------------------------------------------------------------
   Adding a future project = adding one entry here. The Work grid, the
   detail page template, the interactive demo, and the Purchase
   (WhatsApp) link all render from this data. Nothing is hardcoded
   per-project in the components.

   Status pills stay strictly monochrome via a tone, never a color:
     solid  -> filled (done / active / in stock)
     soft   -> tinted chip (in progress / low)
     outline-> quiet chip (open / assigned / out)
------------------------------------------------------------------- */

export type MockupKind = "phone" | "laptop" | "browser";
export type ShaderTheme = "route" | "grid";
export type DemoSlot = "jobs" | "route" | "team" | "notes";
export type PillTone = "solid" | "soft" | "outline";

export interface JobRow {
  id: string;
  title: string;
  sub: string;
  eta: string;
  status: string;
  tone: PillTone;
  highlighted?: boolean;
}

export interface RouteStopRow {
  id: string;
  label: string;
  detail: string;
  done: boolean;
}

export interface TeamRow {
  id: string;
  name: string;
  role: string;
  status: string;
  tone: PillTone;
}

export interface NotesRow {
  id: string;
  author: string;
  time: string;
  body: string;
}

export interface ProjectFeature {
  id: DemoSlot;
  title: string;
  body: string;
  hint: string;
}

export interface ProjectDemo {
  popupTitle: string;
  popupBody: string;
  popupCta: string;
  jobs: JobRow[];
  route: RouteStopRow[];
  team: TeamRow[];
  notes: NotesRow[];
  features: ProjectFeature[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  platforms: string[];
  description: string;
  icon: string;
  iconLabel: string;
  mockupKind: MockupKind;
  shaderTheme: ShaderTheme;
  whatsappNumber: string;
  demo: ProjectDemo;
}

export const PROJECTS: Project[] = [
  {
    slug: "field-ops-suite",
    name: "Field Ops Suite",
    tagline: "Software, built to ship.",
    platforms: ["Android", "iOS"],
    description:
      "A single app that keeps your entire field team coordinated in real time. Dispatch jobs straight to the person on the ground, watch routes unfold live, and close the loop with reports that arrive before you ask for them. Built natively for Android and iOS, Field Ops Suite replaces the pile-up of calls, group chats, and paper — so the people doing the work spend their time working.",
    icon: "route",
    iconLabel: "Field Ops Suite app icon",
    mockupKind: "phone",
    shaderTheme: "route",
    whatsappNumber: "639483426818",
    demo: {
      popupTitle: "Try it before you buy it",
      popupBody:
        "This is a live, explorable preview of Field Ops Suite. Feel free to click around — this is sample data, so you can experience the app exactly how your team would.",
      popupCta: "Got it, let's explore",
      jobs: [
        {
          id: "j1",
          title: "Install router — Northgate",
          sub: "Northgate Building · 15/F",
          eta: "ETA 09:30",
          status: "In progress",
          tone: "soft",
          highlighted: true,
        },
        {
          id: "j2",
          title: "Site survey — Harbor View",
          sub: "Harbor View Rd 8",
          eta: "ETA 10:15",
          status: "Assigned",
          tone: "outline",
        },
        {
          id: "j3",
          title: "Maintenance — Greenhills",
          sub: "Greenhills Plaza 3",
          eta: "ETA 11:00",
          status: "Open",
          tone: "outline",
        },
        {
          id: "j4",
          title: "Delivery — Eastgate",
          sub: "Eastgate Tower",
          eta: "ETA 11:40",
          status: "Complete",
          tone: "solid",
        },
        {
          id: "j5",
          title: "Inspection — Riverside",
          sub: "Riverside Dr 22",
          eta: "ETA 13:20",
          status: "Open",
          tone: "outline",
        },
      ],
      route: [
        {
          id: "r1",
          label: "Depot",
          detail: "Load gear · 07:40",
          done: true,
        },
        {
          id: "r2",
          label: "Northgate",
          detail: "Install window 09:30",
          done: false,
        },
        {
          id: "r3",
          label: "Harbor View",
          detail: "Survey window 10:15",
          done: false,
        },
        {
          id: "r4",
          label: "Greenhills",
          detail: "Scheduled 11:00",
          done: false,
        },
        {
          id: "r5",
          label: "Eastgate",
          detail: "Drop-off 11:40",
          done: false,
        },
        {
          id: "r6",
          label: "Depot",
          detail: "Return & report",
          done: false,
        },
      ],
      team: [
        {
          id: "t1",
          name: "Ana Reyes",
          role: "Lead Installer",
          status: "On route",
          tone: "soft",
        },
        {
          id: "t2",
          name: "Ben Torres",
          role: "Technician",
          status: "On route",
          tone: "soft",
        },
        {
          id: "t3",
          name: "Marco Santos",
          role: "Technician",
          status: "Standby",
          tone: "outline",
        },
        {
          id: "t4",
          name: "Liezl Cruz",
          role: "Coordinator",
          status: "Remote",
          tone: "outline",
        },
        {
          id: "t5",
          name: "Kim Abella",
          role: "Dispatch",
          status: "Remote",
          tone: "outline",
        },
      ],
      notes: [
        {
          id: "n1",
          author: "Ana Reyes",
          time: "09:12",
          body: "Routing cleared — entering Northgate now.",
        },
        {
          id: "n2",
          author: "Ben Torres",
          time: "08:47",
          body: "Need a spare PSU for the Eastgate job.",
        },
        {
          id: "n3",
          author: "Liezl Cruz",
          time: "08:22",
          body: "Client confirmed access hours: 9am–5pm.",
        },
        {
          id: "n4",
          author: "Marco Santos",
          time: "08:05",
          body: "Vehicle service scheduled for Friday.",
        },
      ],
      features: [
        {
          id: "jobs",
          title: "Dispatch & jobs",
          body: "Every job in one queue. Assign, accept, and complete on the spot — status moves the whole team in real time.",
          hint: "Tap a job to advance its status.",
        },
        {
          id: "route",
          title: "Live route planning",
          body: "Stops arrive in the order that makes sense, and recalculate when the day changes on you.",
          hint: "Reorder stops, or check them off as you move.",
        },
        {
          id: "team",
          title: "Field team, one view",
          body: "See who is where, who is free, and who is already on the way — without a single call.",
          hint: "Tap a member to cycle their status.",
        },
        {
          id: "notes",
          title: "Real-time reporting",
          body: "Log what happened at the site the moment it happens. Notes land with the office before you leave.",
          hint: "Add a note to the day's log.",
        },
      ],
    },
  },
  {
    slug: "inventory-manager",
    name: "Inventory Manager",
    tagline: "Turn inventory tracking into a live dashboard.",
    platforms: ["macOS", "Windows"],
    description:
      "Desktop software that turns inventory tracking from a daily chore into a live dashboard. Every product, bin, and movement in one place — with replenish workflows that catch a shortage before it becomes a sale you lose. Built for macOS and Windows, and engineered to stay quiet until you need it.",
    icon: "boxes",
    iconLabel: "Inventory Manager app icon",
    mockupKind: "laptop",
    shaderTheme: "grid",
    whatsappNumber: "639483426818",
    demo: {
      popupTitle: "A live dashboard, not a demo reel",
      popupBody:
        "This is a working preview of Inventory Manager. Click around — everything here is sample data, so you can feel how tracking stops being a chore.",
      popupCta: "Got it, let's explore",
      jobs: [
        {
          id: "j1",
          title: "USB-C Cables · 2m",
          sub: "Aisle 3 · Bin B12",
          eta: "472 in stock",
          status: "In stock",
          tone: "solid",
          highlighted: true,
        },
        {
          id: "j2",
          title: "HDMI · 1.8m",
          sub: "Aisle 3 · Bin C04",
          eta: "23 in stock",
          status: "Low",
          tone: "soft",
        },
        {
          id: "j3",
          title: "Power Supply · 65W",
          sub: "Aisle 5 · Bin A02",
          eta: "6 in stock",
          status: "Reorder",
          tone: "outline",
          highlighted: true,
        },
        {
          id: "j4",
          title: "Network Switch · 8-port",
          sub: "Aisle 2 · Bin D09",
          eta: "118 in stock",
          status: "In stock",
          tone: "solid",
        },
        {
          id: "j5",
          title: "Laptop Stand",
          sub: "Aisle 4 · Bin E11",
          eta: "64 in stock",
          status: "In stock",
          tone: "solid",
        },
      ],
      route: [
        {
          id: "r1",
          label: "Pull order 1048",
          detail: "6 × Power Supply 65W",
          done: true,
        },
        {
          id: "r2",
          label: "Pull order 1049",
          detail: "40 × USB-C Cables",
          done: true,
        },
        {
          id: "r3",
          label: "Bag & label 1048",
          detail: "Counter queue",
          done: false,
        },
        {
          id: "r4",
          label: "Bag & label 1049",
          detail: "Counter queue",
          done: false,
        },
        {
          id: "r5",
          label: "Restock bin A02",
          detail: "After shift stocktake",
          done: false,
        },
      ],
      team: [
        {
          id: "t1",
          name: "Grace Lim",
          role: "Floor staff",
          status: "On floor",
          tone: "soft",
        },
        {
          id: "t2",
          name: "Rex Tim",
          role: "Backroom",
          status: "On floor",
          tone: "soft",
        },
        {
          id: "t3",
          name: "Nina Cruz",
          role: "Counter",
          status: "Counter",
          tone: "outline",
        },
      ],
      notes: [
        {
          id: "n1",
          author: "Grace Lim",
          time: "10:04",
          body: "Bin A02 reads 6 — flagged for reorder.",
        },
        {
          id: "n2",
          author: "Nina Cruz",
          time: "09:31",
          body: "Two returns waiting on the counter.",
        },
        {
          id: "n3",
          author: "Rex Tim",
          time: "08:58",
          body: "Backroom shelf audit finished — all clear.",
        },
      ],
      features: [
        {
          id: "jobs",
          title: "Live stock levels",
          body: "Every product's movement in real time — what's here, what's low, what's already gone.",
          hint: "Tap a row to cycle its status.",
        },
        {
          id: "route",
          title: "Replenish workflow",
          body: "Restock orders assembled in priority order and checked off as shelves refill.",
          hint: "Reorder the queue or check steps off.",
        },
        {
          id: "team",
          title: "Warehouse staff",
          body: "Who's on the floor, who's covering the counter, and who can move.",
          hint: "Tap a member to cycle their position.",
        },
        {
          id: "notes",
          title: "Stock alerts",
          body: "Flag a discrepancy the second it's spotted — the note is proof for later.",
          hint: "Add an alert to the log.",
        },
      ],
    },
  },
  {
    slug: "client-portal",
    name: "Client Portal",
    tagline: "Every project, file, and invoice — one calm view.",
    platforms: ["Web"],
    description:
      "A secure web platform where clients track projects, files, and invoices in a single clean view. Milestones update themselves, documents stay organized, and the status drip-feed the client actually wants replaces the endless back-and-forth.",
    icon: "folder-kanban",
    iconLabel: "Client Portal app icon",
    mockupKind: "browser",
    shaderTheme: "grid",
    whatsappNumber: "639483426818",
    demo: {
      popupTitle: "See the portal before we build yours",
      popupBody:
        "This is a working preview of Client Portal — sample accounts and projects, so you can click through the exact flow your clients would live with.",
      popupCta: "Got it, let's explore",
      jobs: [
        {
          id: "j1",
          title: "Website Redesign",
          sub: "North & Co.",
          eta: "Due Nov 12",
          status: "Active",
          tone: "soft",
          highlighted: true,
        },
        {
          id: "j2",
          title: "Mobile App Build",
          sub: "Lighthouse Labs",
          eta: "Due Dec 03",
          status: "On track",
          tone: "soft",
        },
        {
          id: "j3",
          title: "Brand Refresh",
          sub: "Atlas Studio",
          eta: "Due Oct 28",
          status: "In review",
          tone: "outline",
        },
        {
          id: "j4",
          title: "Cloud Migration",
          sub: "Pinnacle Group",
          eta: "Done Sep 30",
          status: "Complete",
          tone: "solid",
        },
        {
          id: "j5",
          title: "Help Desk Setup",
          sub: "Arcadia Retail",
          eta: "Due Nov 20",
          status: "Queued",
          tone: "outline",
        },
      ],
      route: [
        {
          id: "r1",
          label: "Kickoff meeting",
          detail: "All stakeholders",
          done: true,
        },
        {
          id: "r2",
          label: "Milestone 1 — Designs",
          detail: "Approved",
          done: true,
        },
        {
          id: "r3",
          label: "Milestone 2 — Build",
          detail: "In progress",
          done: false,
        },
        {
          id: "r4",
          label: "Milestone 3 — Review",
          detail: "Not started",
          done: false,
        },
        {
          id: "r5",
          label: "Launch & handover",
          detail: "Assets + access",
          done: false,
        },
      ],
      team: [
        {
          id: "t1",
          name: "Atlas Studio",
          role: "Brand clients",
          status: "3 active",
          tone: "soft",
        },
        {
          id: "t2",
          name: "North & Co.",
          role: "Web clients",
          status: "2 active",
          tone: "soft",
        },
        {
          id: "t3",
          name: "Lighthouse Labs",
          role: "Mobile clients",
          status: "1 active",
          tone: "outline",
        },
        {
          id: "t4",
          name: "Pinnacle Group",
          role: "Migration",
          status: "Onboarding",
          tone: "solid",
        },
      ],
      notes: [
        {
          id: "n1",
          author: "Atlas Studio",
          time: "09:40",
          body: "Feedback uploaded — 3 files, awaiting review.",
        },
        {
          id: "n2",
          author: "Internal",
          time: "09:05",
          body: "Invoice #0142 sent; payment scheduled.",
        },
        {
          id: "n3",
          author: "North & Co.",
          time: "08:15",
          body: "New comment on Milestone 2.",
        },
      ],
      features: [
        {
          id: "jobs",
          title: "Project tracker",
          body: "Every engagement in one queue with a status your clients can actually read.",
          hint: "Tap a project to cycle its status.",
        },
        {
          id: "route",
          title: "Milestones that move themselves",
          body: "Start, build, review, launch — the next step is always visible, never a mystery.",
          hint: "Reorder the plan or mark steps done.",
        },
        {
          id: "team",
          title: "Client roster",
          body: "Every account, what they're running, and how many projects are active.",
          hint: "Tap a client to cycle their status.",
        },
        {
          id: "notes",
          title: "Message inbox",
          body: "Feedback, invoices, and files land in one thread per client — nothing lost.",
          hint: "Add a message to the thread.",
        },
      ],
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function whatsappUrl(project: Project): string {
  const text = `Hi Julius, I'm interested in the ${project.name} project.`;
  return `https://wa.me/${project.whatsappNumber}?text=${encodeURIComponent(text)}`;
}