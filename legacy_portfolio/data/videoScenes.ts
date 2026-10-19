export interface VideoScene {
  scene: number;
  badge: string;
  title: string;
  description: string;
  visualType: "whatsapp" | "ai" | "workflow" | "dashboard" | "lead" | "brand";
  timecode: string;
}

export const videoScenesData: VideoScene[] = [
  {
    scene: 1,
    badge: "Scene 1",
    title: "WhatsApp Customer Message",
    description:
      "A customer reaches out via WhatsApp inquiring about services, quotes, or support in real time.",
    visualType: "whatsapp",
    timecode: "00:03",
  },
  {
    scene: 2,
    badge: "Scene 2",
    title: "AI Understands The Customer",
    description:
      "The AI engine extracts intent, parses parameters, performs contextual reasoning, and resolves queries intelligently.",
    visualType: "ai",
    timecode: "00:08",
  },
  {
    scene: 3,
    badge: "Scene 3",
    title: "Automation Workflow Triggered",
    description:
      "Backend pipelines and webhooks fire seamlessly—routing requests, calculating estimates, or booking appointments.",
    visualType: "workflow",
    timecode: "00:15",
  },
  {
    scene: 4,
    badge: "Scene 4",
    title: "Dashboard Updates in Real Time",
    description:
      "Operations dashboard updates instantly with new conversations, qualified status, and telemetry insights.",
    visualType: "dashboard",
    timecode: "00:22",
  },
  {
    scene: 5,
    badge: "Scene 5",
    title: "Lead & Customer Information Captured",
    description:
      "Customer details, structured notes, and next actions are synchronized into the database and CRM.",
    visualType: "lead",
    timecode: "00:28",
  },
  {
    scene: 6,
    badge: "Scene 6",
    title: "Final Brand Screen",
    description:
      "Hassan — AI Automation & Full-Stack Developer. Call to Action: LET'S AUTOMATE YOUR BUSINESS.",
    visualType: "brand",
    timecode: "00:35",
  },
];
