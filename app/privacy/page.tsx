import type { Metadata } from "next";
import { Navbar, Footer } from "@/components";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Mail, Server } from "lucide-react";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Privacy Policy | Hassan - AI Automation & Full-Stack Developer",
  description:
    "Privacy Policy for Hassan's professional portfolio and software engineering services. Learn how your data is handled with strict confidentiality.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col pt-16 sm:pt-20 selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      <section className="py-12 sm:py-16 relative overflow-hidden tech-grid-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          {/* Heading */}
          <div className="mb-10 border-b border-slate-800 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-sky-500/10 border border-sky-400/25 text-sky-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEGAL &amp; SECURITY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              Privacy <span className="text-gradient-electric">Policy</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400">
              Last updated: October 2026 &bull; Effective for all clients and website visitors
            </p>
          </div>

          {/* Policy Body */}
          <div className="space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {/* 1. Overview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>1. Overview &amp; Commitment</span>
              </h2>
              <p>
                Your privacy is paramount. This Privacy Policy outlines how Muhammad Hassan Ali (&quot;Hassan&quot;, &quot;we&quot;, &quot;our&quot;) collects, uses, and safeguards information when you visit this portfolio website or submit inquiries for AI automation, WhatsApp chatbot, and full-stack software development services.
              </p>
            </div>

            {/* 2. Information Collected */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>2. Information We Collect</span>
              </h2>
              <p className="mb-3">
                We only collect information that you voluntarily provide through our direct contact forms, email communications, or WhatsApp messages:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-1">
                <li><strong className="text-white">Contact Details:</strong> Your name, business email address, and company name.</li>
                <li><strong className="text-white">Project Scope:</strong> Project requirements, architecture needs, budget range, and timeline.</li>
                <li><strong className="text-white">Technical Logs:</strong> Non-personally identifiable diagnostic data (browser type, operating system) used solely to ensure website availability and security.</li>
              </ul>
            </div>

            {/* 3. Use of Information */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>3. How We Use Your Information</span>
              </h2>
              <p className="mb-3">
                Information provided is utilized strictly for professional business purposes:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 ml-1">
                <li>Responding to project inquiries and scheduling technical consultations.</li>
                <li>Delivering agreed-upon software engineering, AI workflow, and chatbot development contracts.</li>
                <li>Sending essential project milestones and invoicing details.</li>
                <li>We do not sell, rent, or trade your personal or business data to third-party advertisers.</li>
              </ul>
            </div>

            {/* 4. Security & Retention */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>4. Data Security &amp; Confidentiality</span>
              </h2>
              <p>
                All project submissions and credentials shared during client engagements are handled under strict confidentiality. We implement industry-standard encryption in transit (HTTPS/TLS) and secure repository environments. Non-disclosure agreements (NDAs) can be executed upon request prior to discussing proprietary project architectures.
              </p>
            </div>

            {/* 5. Contact Information */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
              <h2 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>5. Contact &amp; Data Inquiries</span>
              </h2>
              <p className="mb-3">
                If you have questions regarding this Privacy Policy or wish to have any submitted consultation data permanently erased, please contact:
              </p>
              <div className="space-y-1 text-slate-400">
                <p><strong className="text-white">Muhammad Hassan Ali</strong></p>
                <p>AI Automation &amp; Full-Stack Developer</p>
                <p>Multan, Pakistan (Serving Clients Worldwide)</p>
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
