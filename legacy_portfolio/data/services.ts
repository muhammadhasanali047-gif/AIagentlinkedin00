export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export const servicesData: ServiceItem[] = [
  {
    number: "01",
    title: "AI Automation",
    description:
      "Build intelligent business workflows and automate repetitive processes.",
    iconName: "Bot",
    features: [
      "End-to-end process automation",
      "Event-driven webhook pipelines",
      "Autonomous AI task execution",
      "Seamless API integrations",
    ],
  },
  {
    number: "02",
    title: "WhatsApp AI Chatbots",
    description:
      "Build context-aware WhatsApp chatbots for customer support, sales and lead handling.",
    iconName: "MessageSquareCode",
    features: [
      "Natural language customer handling",
      "Automated lead qualification",
      "Instant 24/7 inquiry resolution",
      "Cloud API & multi-session support",
    ],
  },
  {
    number: "03",
    title: "Full-Stack Development",
    description:
      "Build modern websites, web applications, dashboards and backend systems.",
    iconName: "Layers",
    features: [
      "Next.js & React production web apps",
      "Scalable Node.js & TypeScript backends",
      "Responsive, accessible design",
      "High-performance REST & real-time APIs",
    ],
  },
  {
    number: "04",
    title: "AI Integration",
    description:
      "Integrate AI models, APIs, RAG systems and intelligent workflows.",
    iconName: "BrainCircuit",
    features: [
      "LLM & Gemini API integration",
      "Retrieval-Augmented Generation (RAG)",
      "Agentic workflows with LangChain & LangGraph",
      "Prompt engineering & guardrails",
    ],
  },
  {
    number: "05",
    title: "Business Dashboards",
    description:
      "Build modern admin dashboards for monitoring customers, conversations, leads and business operations.",
    iconName: "LayoutDashboard",
    features: [
      "Real-time analytics & KPIs",
      "Conversation volume telemetry",
      "Lead pipelines & customer management",
      "Secure authentication & RBAC",
    ],
  },
  {
    number: "06",
    title: "Data & AI Solutions",
    description:
      "Build data-driven and AI-powered solutions for business needs.",
    iconName: "DatabaseZap",
    features: [
      "Business data modeling & analysis",
      "Automated reporting workflows",
      "PostgreSQL, Supabase & Firebase stores",
      "Predictive & operational insights",
    ],
  },
];
