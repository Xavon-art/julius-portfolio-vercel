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
export type ShaderTheme = "route" | "grid" | "panels";
export type DemoSlot =
  | "jobs"
  | "route"
  | "team"
  | "notes"
  | "stock"
  | "bins"
  | "activity"
  | "projects"
  | "files"
  | "invoices"
  | "updates";
export type PillTone = "solid" | "soft" | "outline";

export interface JobRow {
  id: string;
  title: string;
  sub: string;
  eta: string;
  status: string;
  tone: PillTone;
  member?: string;
  sku?: string;
  history?: { at: string; text: string }[];
  qty?: number;
  threshold?: number;
  highlighted?: boolean;
}

export interface JobLog {
  at: string;
  text: string;
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

export interface DemoBinRow {
  id: string;
  name: string;
  items: string[];
}

export interface DemoMoveRow {
  id: string;
  ref: string;
  delta: number;
  bin: string;
  time: string;
}

export interface PortalMilestoneRow {
  id: string;
  label: string;
  done: boolean;
}

export interface PortalProjectRow {
  id: string;
  name: string;
  client: string;
  status: string;
  tone: PillTone;
  due: string;
  cover: string;
  progress: number;
  milestones: PortalMilestoneRow[];
  feed: { time: string; text: string }[];
}

export type PortalFileKind = "pdf" | "docx" | "png" | "xlsx";

export interface PortalFileRow {
  id: string;
  name: string;
  kind: PortalFileKind;
  projectId?: string;
  uploaded: string;
  by: string;
}

export type PortalInvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface PortalInvoiceRow {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: PortalInvoiceStatus;
  due: string;
}

export interface PortalData {
  projects: PortalProjectRow[];
  files: PortalFileRow[];
  invoices: PortalInvoiceRow[];
}

export interface ProjectFeature {
  id: DemoSlot;
  title: string;
  body: string;
}

export interface ProjectDemo {
  popupTitle: string;
  popupBody: string;
  popupCta: string;
  tryIt: string;
  customizable: string;
  jobs: JobRow[];
  route: RouteStopRow[];
  team: TeamRow[];
  notes: NotesRow[];
  features: ProjectFeature[];
  bins?: DemoBinRow[];
  movements?: DemoMoveRow[];
  portal?: PortalData;
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
  supportsDeviceToggle?: boolean;
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
      tryIt:
        "Add a job, reorder a route stop, or check the team — everything here responds like the real thing.",
      customizable:
        "This is just a glimpse. Every workflow shown here — job fields, statuses, team roles, route logic — can be fully customized or personalized to match how your business actually operates.",
      jobs: [
        {
          id: "j1",
          title: "Install router — Northgate",
          sub: "Northgate Building · 15/F",
          eta: "ETA 09:30",
          status: "In progress",
          tone: "soft",
          member: "Ana Reyes",
          highlighted: true,
          history: [
            { at: "09:12", text: "Ana arrived on site." },
            { at: "09:24", text: "Access granted by building admin." },
            { at: "09:28", text: "Started install — swap-out unit." },
          ],
        },
        {
          id: "j2",
          title: "Site survey — Harbor View",
          sub: "Harbor View Rd 8",
          eta: "ETA 10:15",
          status: "Assigned",
          tone: "outline",
          member: "Ben Torres",
          history: [{ at: "08:40", text: "Assigned to Ben Torres." }],
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
          member: "Ana Reyes",
          history: [
            { at: "11:38", text: "Drop-off confirmed by client." },
            { at: "11:42", text: "Job closed — delivered." },
          ],
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
          status: "On a job",
          tone: "soft",
        },
        {
          id: "t2",
          name: "Ben Torres",
          role: "Technician",
          status: "On the way",
          tone: "soft",
        },
        {
          id: "t3",
          name: "Marco Santos",
          role: "Technician",
          status: "Available",
          tone: "outline",
        },
        {
          id: "t4",
          name: "Liezl Cruz",
          role: "Coordinator",
          status: "Available",
          tone: "outline",
        },
        {
          id: "t5",
          name: "Kim Abella",
          role: "Dispatch",
          status: "Available",
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
        },
        {
          id: "route",
          title: "Live route planning",
          body: "Stops arrive in the order that makes sense, and recalculate when the day changes on you.",
        },
        {
          id: "team",
          title: "Field team, one view",
          body: "See who is where, who is free, and who is already on the way — without a single call.",
        },
        {
          id: "notes",
          title: "Real-time reporting",
          body: "Log what happened at the site the moment it happens. Notes land with the office before you leave.",
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
        "This is a live, explorable preview of Inventory Manager. Feel free to click around — this is sample data, so you can experience the app exactly how your team would.",
      popupCta: "Got it, let's explore",
      tryIt:
        "Add an item, move stock between bins, or check the low-stock flags — everything here responds like the real thing.",
      customizable:
        "This is just a glimpse. Every workflow shown here — item fields, thresholds, bin structure, reporting — can be fully customized or personalized to match how your business actually operates.",
      jobs: [
        {
          id: "j1",
          title: "USB-C Cables · 2m",
          sub: "Aisle 3 · Bin B12",
          eta: "472 in stock",
          status: "In stock",
          tone: "solid",
          sku: "CBL-USB2M",
          qty: 472,
          threshold: 60,
          highlighted: true,
          history: [
            { at: "10:04", text: "Cycle count ran — 472 on hand." },
            { at: "08:15", text: "Received 120 from supplier #14." },
          ],
        },
        {
          id: "j2",
          title: "HDMI · 1.8m",
          sub: "Aisle 3 · Bin C04",
          eta: "23 in stock",
          status: "Low",
          tone: "soft",
          sku: "HDMI-1M8",
          qty: 23,
          threshold: 30,
          history: [{ at: "09:48", text: "Below threshold — flagged for reorder." }],
        },
        {
          id: "j3",
          title: "Power Supply · 65W",
          sub: "Aisle 5 · Bin A02",
          eta: "6 in stock",
          status: "Low",
          tone: "soft",
          sku: "PSU-65W",
          qty: 6,
          threshold: 20,
          highlighted: true,
          history: [{ at: "10:04", text: "Grace flagged bin A02 at 6 units." }],
        },
        {
          id: "j4",
          title: "Network Switch · 8-port",
          sub: "Aisle 2 · Bin D09",
          eta: "118 in stock",
          status: "In stock",
          tone: "solid",
          sku: "SWT-8PO",
          qty: 118,
          threshold: 40,
        },
        {
          id: "j5",
          title: "Laptop Stand",
          sub: "Aisle 4 · Bin E11",
          eta: "64 in stock",
          status: "In stock",
          tone: "solid",
          sku: "STD-LAP",
          qty: 64,
          threshold: 25,
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
      bins: [
        {
          id: "b1",
          name: "Aisle 3 · Bin B12",
          items: ["USB-C Cables · 2m", "Power Supply · 65W"],
        },
        {
          id: "b2",
          name: "Aisle 3 · Bin C04",
          items: ["HDMI · 1.8m"],
        },
        {
          id: "b3",
          name: "Aisle 2 · Bin D09",
          items: ["Network Switch · 8-port"],
        },
        {
          id: "b4",
          name: "Aisle 4 · Bin E11",
          items: ["Laptop Stand"],
        },
      ],
      movements: [
        {
          id: "m1",
          ref: "USB-C Cables · 2m",
          delta: 120,
          bin: "Aisle 3 · Bin B12",
          time: "08:15",
        },
        {
          id: "m2",
          ref: "HDMI · 1.8m",
          delta: -5,
          bin: "Aisle 3 · Bin C04",
          time: "09:31",
        },
        {
          id: "m3",
          ref: "Network Switch · 8-port",
          delta: 24,
          bin: "Aisle 2 · Bin D09",
          time: "09:46",
        },
        {
          id: "m4",
          ref: "Power Supply · 65W",
          delta: -6,
          bin: "Aisle 5 · Bin A02",
          time: "09:58",
        },
        {
          id: "m5",
          ref: "USB-C Cables · 2m",
          delta: 20,
          bin: "Aisle 3 · Bin B12",
          time: "10:04",
        },
      ],
      features: [
        {
          id: "stock",
          title: "Live stock dashboard",
          body: "Every product's movement in real time — what's here, what's low, what's already gone. Items under their threshold flag themselves.",
        },
        {
          id: "bins",
          title: "Bins & locations",
          body: "Every shelf location mapped — add a bin, rename it, and see exactly what lives inside.",
        },
        {
          id: "activity",
          title: "Movement log",
          body: "Every unit added or shipped, timestamped. A manual entry lands in the log the moment you log it.",
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
    shaderTheme: "panels",
    supportsDeviceToggle: true,
    whatsappNumber: "639483426818",
    demo: {
      popupTitle: "See the portal before we build yours",
      popupBody:
        "This is a live, explorable preview of Client Portal — sample accounts, files, and invoices, so you can click through the exact flow your clients would live with. Try it in laptop or phone view.",
      popupCta: "Got it, let's explore",
      tryIt:
        "Add a project, check off a milestone, or mark an invoice as paid — everything here responds like the real thing, and yes, you can switch between laptop and phone view above to see both.",
      customizable:
        "This is just a glimpse. Every workflow shown here — project fields, invoice statuses, file structure, client updates — can be fully customized or personalized to match how your business actually operates.",
      jobs: [
        {
          id: "j1",
          title: "Website Redesign",
          sub: "North & Co.",
          eta: "Due Nov 12",
          status: "Active",
          tone: "soft",
          member: "North & Co.",
          highlighted: true,
          history: [
            { at: "09:40", text: "Feedback uploaded — 3 files." },
            { at: "08:15", text: "New comment on Milestone 2." },
          ],
        },
        {
          id: "j2",
          title: "Mobile App Build",
          sub: "Lighthouse Labs",
          eta: "Due Dec 03",
          status: "On track",
          tone: "soft",
          member: "Lighthouse Labs",
          history: [{ at: "09:05", text: "Sprint review wrapped — on track." }],
        },
        {
          id: "j3",
          title: "Brand Refresh",
          sub: "Atlas Studio",
          eta: "Due Oct 28",
          status: "In review",
          tone: "outline",
          member: "Atlas Studio",
        },
        {
          id: "j4",
          title: "Cloud Migration",
          sub: "Pinnacle Group",
          eta: "Done Sep 30",
          status: "Complete",
          tone: "solid",
          member: "Pinnacle Group",
          history: [{ at: "Sep 30", text: "Handover sent — assets + access." }],
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
          id: "projects",
          title: "One dashboard, every project",
          body: "Every engagement, its milestones, and its files in one place — statuses your clients can actually read.",
        },
        {
          id: "files",
          title: "Files that stay organized",
          body: "Every document linked to the right project — no more hunting through inboxes and shared drives.",
        },
        {
          id: "invoices",
          title: "Invoices, tracked automatically",
          body: "Created, paid, overdue — with a running total that never needs a spreadsheet.",
        },
        {
          id: "updates",
          title: "Updates clients actually read",
          body: "Milestone completions and invoice activity land in one clean feed.",
        },
      ],
      portal: {
        projects: [
          {
            id: "p1",
            name: "Website Redesign",
            client: "North & Co.",
            status: "Active",
            tone: "soft",
            due: "Due Nov 12",
            cover: "cov1",
            progress: 40,
            milestones: [
              { id: "p1m1", label: "Kickoff", done: true },
              { id: "p1m2", label: "Wireframes", done: true },
              { id: "p1m3", label: "Design review", done: false },
              { id: "p1m4", label: "Build", done: false },
              { id: "p1m5", label: "Handover", done: false },
            ],
            feed: [
              { time: "09:40", text: "North & Co. uploaded feedback · 3 files." },
              { time: "08:15", text: "Milestone 'Wireframes' marked complete." },
            ],
          },
          {
            id: "p2",
            name: "Mobile App Build",
            client: "Lighthouse Labs",
            status: "On track",
            tone: "soft",
            due: "Due Dec 03",
            cover: "cov2",
            progress: 25,
            milestones: [
              { id: "p2m1", label: "Sprint 1 plan", done: true },
              { id: "p2m2", label: "Core UI build", done: false },
              { id: "p2m3", label: "Beta release", done: false },
              { id: "p2m4", label: "Launch", done: false },
            ],
            feed: [{ time: "09:05", text: "Sprint review wrapped — on track." }],
          },
          {
            id: "p3",
            name: "Brand Refresh",
            client: "Atlas Studio",
            status: "In review",
            tone: "outline",
            due: "Due Oct 28",
            cover: "cov3",
            progress: 33,
            milestones: [
              { id: "p3m1", label: "Moodboards", done: true },
              { id: "p3m2", label: "Identity system", done: false },
              { id: "p3m3", label: "Guidelines", done: false },
            ],
            feed: [{ time: "08:50", text: "Waiting on client sign-off for moodboards." }],
          },
          {
            id: "p4",
            name: "Cloud Migration",
            client: "Pinnacle Group",
            status: "Complete",
            tone: "solid",
            due: "Done Sep 30",
            cover: "cov4",
            progress: 100,
            milestones: [
              { id: "p4m1", label: "Audit", done: true },
              { id: "p4m2", label: "Migration wave 1", done: true },
              { id: "p4m3", label: "Migration wave 2", done: true },
              { id: "p4m4", label: "Handover", done: true },
            ],
            feed: [{ time: "Sep 30", text: "Handover sent — assets + access." }],
          },
          {
            id: "p5",
            name: "Help Desk Setup",
            client: "Arcadia Retail",
            status: "Queued",
            tone: "outline",
            due: "Due Nov 20",
            cover: "cov5",
            progress: 0,
            milestones: [
              { id: "p5m1", label: "Triage setup", done: false },
              { id: "p5m2", label: "Team training", done: false },
            ],
            feed: [{ time: "08:30", text: "Kickoff room booked." }],
          },
        ],
        files: [
          {
            id: "f1",
            name: "Homepage-Mock-v2.png",
            kind: "png",
            projectId: "p1",
            uploaded: "Sep 04",
            by: "Julius",
          },
          {
            id: "f2",
            name: "Brand-Guidelines.pdf",
            kind: "pdf",
            projectId: "p3",
            uploaded: "Sep 02",
            by: "Atlas Studio",
          },
          {
            id: "f3",
            name: "Content-Plan-Q4.docx",
            kind: "docx",
            projectId: "p1",
            uploaded: "Aug 28",
            by: "N. Ramos",
          },
          {
            id: "f4",
            name: "Metrics-Aug.xlsx",
            kind: "xlsx",
            projectId: "p2",
            uploaded: "Sep 01",
            by: "Julius",
          },
          {
            id: "f5",
            name: "Sprint-Beta-Notes.pdf",
            kind: "pdf",
            projectId: "p2",
            uploaded: "Sep 03",
            by: "Lighthouse Labs",
          },
          {
            id: "f6",
            name: "Cloud-Map.png",
            kind: "png",
            projectId: "p4",
            uploaded: "Sep 30",
            by: "Pinnacle Group",
          },
        ],
        invoices: [
          {
            id: "i1",
            number: "INV-1041",
            client: "North & Co.",
            amount: 124000,
            status: "Paid",
            due: "Due Sep 28",
          },
          {
            id: "i2",
            number: "INV-1042",
            client: "Atlas Studio",
            amount: 65000,
            status: "Pending",
            due: "Due Oct 14",
          },
          {
            id: "i3",
            number: "INV-1043",
            client: "Lighthouse Labs",
            amount: 98000,
            status: "Pending",
            due: "Due Nov 05",
          },
          {
            id: "i4",
            number: "INV-0339",
            client: "Pinnacle Group",
            amount: 210000,
            status: "Overdue",
            due: "Due Sep 20",
          },
          {
            id: "i5",
            number: "INV-1044",
            client: "Arcadia Retail",
            amount: 45000,
            status: "Pending",
            due: "Due Nov 22",
          },
        ],
      },
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