export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Understand",
    description: "Understand business and user requirements",
    details:
      "Deep-dive into operational pain points, repetitive manual workflows, customer communication channels, and technical objectives",
    iconName: "Search",
  },
  {
    step: "02",
    title: "Plan",
    description: "Design technical and automation architecture",
    details:
      "Architect clean data schemas, AI prompt models, API webhook routes, security standards, and resilient fallback flows",
    iconName: "Compass",
  },
  {
    step: "03",
    title: "Build",
    description: "Develop system, interface and integrations",
    details:
      "Implement high-quality TypeScript code, responsive interfaces, backend controllers, and optimized database models",
    iconName: "Code2",
  },
  {
    step: "04",
    title: "Automate",
    description: "Connect AI, APIs, workflows and processes",
    details:
      "Integrate WhatsApp Cloud API, AI language agents, n8n automation pipelines, and instant CRM data dispatch",
    iconName: "Zap",
  },
  {
    step: "05",
    title: "Deploy",
    description: "Deploy production-ready solutions",
    details:
      "Dockerize containers, launch on cloud infrastructure, verify SSL, test production webhooks, and configure health checks",
    iconName: "Rocket",
  },
  {
    step: "06",
    title: "Improve",
    description: "Monitor, optimize and scale the system",
    details:
      "Analyze conversation accuracy, review latency metrics, tune AI responses, and continuously iterate for business growth",
    iconName: "TrendingUp",
  },
];
