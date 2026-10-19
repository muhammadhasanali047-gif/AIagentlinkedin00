import type { Metadata } from "next";
import { Navbar, Services, ResultsValue, Footer } from "@/components";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Hassan - AI Automation & Full-Stack Developer",
  description:
    "Explore AI Automation, WhatsApp AI Chatbots, Full-Stack Development, AI Integration, Business Dashboards, and Data Solutions offered by Hassan.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col pt-16 sm:pt-20 selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      {/* Services Section directly without duplicate banner */}
      <Services />

      {/* Results & Value capability statements */}
      <ResultsValue />

      {/* Bottom Conversion Banner */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-sky-950/30 via-slate-900/60 to-cyan-950/30 border-t border-sky-500/20 backdrop-blur-md text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
            Need a Custom Automation Architecture?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-lg mx-auto">
            Book a consultation to map out your customer conversation flows, API integrations, and automation workflows.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-sky-500/25 active:scale-98 min-h-[44px]"
          >
            <span>Discuss Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
