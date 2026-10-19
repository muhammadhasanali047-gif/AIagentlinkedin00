"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/config";
import { HeroMicroCards } from "./HeroMicroCards";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-16 pb-2 sm:pt-20 sm:pb-3 lg:pt-22 xl:pt-24 lg:pb-3 flex flex-col justify-center overflow-hidden tech-grid-pattern"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[650px] h-[350px] sm:h-[500px] rounded-full bg-radial-glow pointer-events-none -z-10" />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main 2-column layout - wider text column with refined heading size */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="flex flex-col items-start text-left z-10 order-1 w-full">
            {/* Main Heading - Clean 3 Lines without comma or dot */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight text-white leading-[1.18] max-w-2xl"
            >
              I BUILD <span className="text-gradient-electric">AI AUTOMATIONS</span>
              <br />
              <span className="text-gradient-electric">SMART CHATBOTS</span> &amp;
              <br />
              <span className="text-gradient-electric">FULL-STACK SYSTEMS</span>
            </motion.h1>

            {/* Subheading - Increased length, depth, and font scale */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              I architect custom AI automation workflows, 24/7 intelligent WhatsApp
              chatbots, and scalable full-stack web applications engineered to streamline
              repetitive operations, engage qualified leads, and deliver measurable growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3 w-full sm:w-auto"
            >
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-md shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
              >
                <span>View My Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/40 transition-all duration-200 min-h-[44px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Let&apos;s Talk</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Premium Circular Hole Portal with Floating Tech Badges */}
          <div className="flex justify-center items-center relative order-2 mt-4 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative w-[230px] sm:w-[280px] lg:w-[340px] xl:w-[380px] aspect-square flex items-center justify-center"
            >
              {/* Concentric orbital rings filling surrounding space */}
              <div className="absolute -inset-3 sm:-inset-5 lg:-inset-6 flex items-center justify-center pointer-events-none overflow-visible">
                <div className="w-full h-full rounded-full border border-sky-500/20 opacity-60 animate-pulse" />
                <div className="absolute w-[92%] h-[92%] rounded-full border border-cyan-400/25 border-dashed" />
                <div className="absolute w-[80%] h-[80%] rounded-full bg-radial-glow opacity-90" />
              </div>

              {/* Circular Hole Portal Frame */}
              <div className="relative w-full h-full rounded-full overflow-hidden glass-panel border-2 border-sky-400/40 shadow-[0_0_50px_-10px_rgba(56,189,248,0.35)] group p-1.5 bg-gradient-to-b from-sky-400/25 via-sky-500/10 to-transparent">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#060b18]">
                  <Image
                    src={siteConfig.portraitUrl}
                    alt="Hassan - AI Automation & Full-Stack Developer"
                    fill
                    priority
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 410px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gentle subtle bottom fade inside circle */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060b18]/85 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 4 Micro-cards positioned cleanly below Hero content */}
        <HeroMicroCards />
      </div>
    </section>
  );
}
