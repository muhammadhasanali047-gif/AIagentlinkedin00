export interface SkillCategory {
  title: string;
  iconName: string;
  skills: {
    name: string;
    level?: string;
    description: string;
  }[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "AI & Automation",
    iconName: "Bot",
    skills: [
      { name: "Gemini", description: "Google DeepMind Multimodal Models & Structured Output" },
      { name: "AI Agents", description: "Autonomous task-executing agents with reasoning loops" },
      { name: "RAG", description: "Retrieval-Augmented Generation with vector embeddings" },
      { name: "LangChain", description: "Orchestration framework for LLMs & prompt templates" },
      { name: "LangGraph", description: "Stateful multi-actor agent workflows and graphs" },
    ],
  },
  {
    title: "Frontend",
    iconName: "Layout",
    skills: [
      { name: "Next.js", description: "App Router, SSR, Server Components & SEO optimization" },
      { name: "React", description: "Component architecture, modern hooks & state management" },
      { name: "TypeScript", description: "Strict static typing, interface contracts & reliability" },
      { name: "Tailwind CSS", description: "Modern responsive utility-first design systems" },
    ],
  },
  {
    title: "Backend",
    iconName: "Server",
    skills: [
      { name: "Node.js", description: "High-performance runtime for scalable server backends" },
      { name: "APIs", description: "RESTful architecture, JSON protocols & rate-limiting" },
      { name: "Webhooks", description: "Real-time event-driven ingest & asynchronous workers" },
    ],
  },
  {
    title: "Database",
    iconName: "Database",
    skills: [
      { name: "PostgreSQL", description: "Relational database modeling, indexes & transactions" },
      { name: "Supabase", description: "Postgres backend-as-a-service, Auth & Realtime" },
      { name: "Firebase", description: "Realtime document storage & cloud security rules" },
    ],
  },
  {
    title: "Automation",
    iconName: "Workflow",
    skills: [
      { name: "n8n", description: "Self-hosted workflow automation & multi-step nodes" },
      { name: "APIs", description: "Third-party service bridging & custom connectors" },
      { name: "Webhooks", description: "Bi-directional triggers for WhatsApp & CRM sync" },
    ],
  },
  {
    title: "Development",
    iconName: "Terminal",
    skills: [
      { name: "GitHub", description: "Git version control, collaborative workflows & CI/CD" },
      { name: "Docker", description: "Containerized application environments & Compose" },
      { name: "Vercel", description: "Edge deployment, fast CDN & serverless functions" },
    ],
  },
];
