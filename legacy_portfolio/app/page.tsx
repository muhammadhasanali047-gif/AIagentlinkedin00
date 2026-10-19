import {
  Navbar,
  Hero,
  About,
  Services,
  Projects,
  ResultsValue,
  Footer,
} from "@/components";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Featured Projects Preview (Top 3) */}
      <Projects limit={3} showViewAll={true} />

      {/* Featured Services Preview (Top 3) */}
      <Services limit={3} showViewAll={true} />

      {/* Value & Results Capability Cards */}
      <ResultsValue />

      {/* Compact Conversion Banner */}
      <section className="py-8 sm:py-10 bg-gradient-to-r from-sky-950/30 via-slate-900/60 to-cyan-950/30 border-t border-sky-500/20 backdrop-blur-md text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-2">
            Let&apos;s Build Something <span className="text-gradient-electric">Intelligent</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-3.5 sm:mb-4 max-w-lg mx-auto">
            Need an autonomous WhatsApp chatbot, high-throughput backend, or modern full-stack web application?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-sky-500/25 active:scale-98 min-h-[44px]"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all min-h-[44px]"
            >
              <span>About Hassan</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
