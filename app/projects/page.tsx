import type { Metadata } from "next";
import { Navbar, Projects, ResultsValue, Footer } from "@/components";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects | Hassan - AI Automation & Full-Stack Developer",
  description:
    "Explore featured projects built by Hassan: WhatsApp automation gateways, academic platforms, solar assistants, and business telemetry dashboards.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col pt-16 sm:pt-20 selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      {/* Projects Grid Section directly without duplicate banner */}
      <Projects />

      {/* Value Metrics Section */}
      <ResultsValue />

      {/* Bottom Conversion Banner */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-sky-950/30 via-slate-900/60 to-cyan-950/30 border-t border-sky-500/20 backdrop-blur-md text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
            Have a Specific Project in Mind?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-lg mx-auto">
            Whether you need a custom WhatsApp AI assistant, an automated backend pipeline, or a full-stack dashboard, let&apos;s build it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-sky-500/25 active:scale-98 min-h-[44px]"
          >
            <span>Request a Project Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
