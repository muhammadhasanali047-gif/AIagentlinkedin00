import type { Metadata } from "next";
import { Navbar, About, Process, Footer } from "@/components";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Hassan - AI Automation & Full-Stack Developer",
  description:
    "Learn about Hassan's background in AI automation, WhatsApp chatbots, full-stack systems, BS Data Science, and production engineering philosophy.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col pt-16 sm:pt-20 selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      {/* Detailed About Section directly without redundant duplicate banner */}
      <About />

      {/* How I Work Process */}
      <Process />

      {/* Bottom Conversion Banner */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-sky-950/30 via-slate-900/60 to-cyan-950/30 border-t border-sky-500/20 backdrop-blur-md text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-lg mx-auto">
            Let&apos;s build intelligent WhatsApp bots, autonomous workflows, and custom web applications for your brand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-sky-500/25 active:scale-98 min-h-[44px]"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
