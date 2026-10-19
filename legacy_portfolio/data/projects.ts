export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export const projectsData: ProjectItem[] = [
  {
    id: "bspe-gateway",
    title: "BSPE WhatsApp Enterprise Gateway",
    category: "AI WhatsApp Chatbot",
    description:
      "Enterprise-grade WhatsApp automation backend engineered with NestJS, TypeScript, OpenAPI documentation, and containerized deployment for multi-channel message handling.",
    technologies: ["Node.js", "TypeScript", "NestJS", "Docker", "OpenAPI", "Webhooks"],
    imageUrl: "/images/projects/bspe-gateway.svg",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "publicore-platform",
    title: "Publicore Research Platform",
    category: "Modern Web Application",
    description:
      "Full-stack academic research and publishing ecosystem built with Next.js, featuring transparent peer-review workflows, research discovery, and modular editorial tools.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST APIs"],
    imageUrl: "/images/projects/publicore.png",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "alp-solar-assistant",
    title: "Alp Solar Consultation Assistant",
    category: "AI Solar Assistant",
    description:
      "Automated solar energy consultation assistant providing automated system sizing calculations, quote estimates, and customer qualification via WhatsApp.",
    technologies: ["AI Chatbots", "WhatsApp Cloud API", "Node.js", "Automation"],
    imageUrl: "/images/projects/solar-assistant.svg",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: true,
  },
  {
    id: "avea-ecommerce-bot",
    title: "Avea E-Commerce Conversational Bot",
    category: "AI Sales Automation",
    description:
      "Intelligent customer assistant managing organic product inquiries, usage guidelines, order validation, and automated customer communication pipelines.",
    technologies: ["TypeScript", "Chatbot Architecture", "Webhooks", "JSON APIs"],
    imageUrl: "/images/projects/avea-bot.svg",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    id: "real-estate-bot",
    title: "Real Estate WhatsApp Agent",
    category: "AI WhatsApp Chatbot",
    description:
      "Context-aware WhatsApp bot handling buyer property inquiries, budget qualification, location preferences, and instant agent notification triggers.",
    technologies: ["WhatsApp Bot", "Node.js", "TypeScript", "CRM Integration"],
    imageUrl: "/images/projects/real-estate-bot.svg",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    id: "business-automation-dashboard",
    title: "Business Automation Dashboard",
    category: "Business Automation Dashboard",
    description:
      "Operational admin dashboard for monitoring real-time conversation volumes, webhook delivery statuses, lead pipelines, and automated task execution.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Data Analytics"],
    imageUrl: "/images/projects/operations-dashboard.svg",
    demoUrl: "https://github.com",
    githubUrl: "https://github.com",
    featured: false,
  },
];
