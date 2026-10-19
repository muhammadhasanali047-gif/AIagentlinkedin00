export interface ValueStatement {
  metric: string;
  label: string;
  description: string;
  iconName: string;
}

export const valueStatements: ValueStatement[] = [
  {
    metric: "24/7",
    label: "Automated Customer Support",
    description:
      "Context-aware WhatsApp assistants responding to customer inquiries and qualifying leads around the clock without downtime.",
    iconName: "Clock",
  },
  {
    metric: "Faster",
    label: "Response & Lead Handling",
    description:
      "Instantaneous reply times that capture hot leads within seconds rather than hours of waiting for manual review.",
    iconName: "Zap",
  },
  {
    metric: "Less",
    label: "Manual Work",
    description:
      "Repetitive questions, status lookups, and data copying are seamlessly offloaded to intelligent background automations.",
    iconName: "Minimize2",
  },
  {
    metric: "Smarter",
    label: "Business Workflows",
    description:
      "Unified systems connecting WhatsApp, custom web applications, APIs, and modern databases into cohesive engines.",
    iconName: "Cpu",
  },
];
