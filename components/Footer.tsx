"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/config";
import { Linkedin, Github, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-[#02050e] via-[#040816] to-transparent border-t border-sky-500/15 pt-6 pb-4 sm:pt-8 sm:pb-5 overflow-hidden text-slate-400">
      {/* Top Subtle Ambient Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-3xl h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid: Sleek Vertical Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 pb-5 sm:pb-6 border-b border-slate-800/60">
          
          {/* Column 1: Brand Info (Spans 6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                H
              </div>
              <span className="font-extrabold tracking-wider text-sm text-white group-hover:text-cyan-300 transition-colors">
                HASSAN
              </span>
            </Link>

            <p className="text-[11px] text-sky-400 font-semibold tracking-wide">
              {siteConfig.primaryTitle}
            </p>

            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
              Engineering autonomous WhatsApp chatbots, AI agent workflows &amp; scalable web systems.
            </p>
          </div>

          {/* Column 2: Navigation Links (Vertical List) (Spans 3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Navigation
            </p>
            <nav aria-label="Footer Navigation" className="flex flex-col space-y-1.5 text-[11px] font-medium text-slate-400">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-cyan-300 hover:translate-x-0.5 transition-all duration-150 inline-flex items-center gap-1.5 py-0.5"
                >
                  <span className="text-sky-500/60 text-[9px]">›</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Connect Channels (Vertical List) (Spans 3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col items-start">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Connect
            </p>
            <div className="flex flex-col space-y-1.5 text-[11px] font-medium text-slate-400 w-full max-w-[220px]">
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-1 px-2 rounded-md bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 transition-all"
                aria-label="LinkedIn profile"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-1 px-2 rounded-md bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all"
                aria-label="GitHub profile"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center justify-between py-1 px-2 rounded-md bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-800/80 text-slate-300 hover:text-cyan-300 transition-all"
                aria-label="Email directly"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>Email</span>
                </div>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between py-1 px-2 rounded-md bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/80 text-slate-300 hover:text-emerald-300 transition-all"
                aria-label="Chat on WhatsApp"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </div>
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-3.5 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            &copy; 2026 All rights reserved
          </div>

          <Link
            href="/privacy"
            className="text-slate-400 hover:text-cyan-300 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
