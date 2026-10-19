"use client";

import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/config";
import { motion } from "framer-motion";

const featureCards = [
  {
    number: "01",
    title: "AI & WhatsApp Chatbots",
  },
  {
    number: "02",
    title: "Process Automation",
  },
  {
    number: "03",
    title: "Full-Stack Web & Dashboards",
  },
  {
    number: "04",
    title: "Data & AI Integrations",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative pt-3 pb-5 sm:pt-4 sm:pb-6 lg:pt-5 lg:pb-6 bg-transparent overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-radial-glow pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Mobile Header (Appears above portrait on mobile screens) */}
        <div className="block lg:hidden mb-4 text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            I BUILD INTELLIGENT SOLUTIONS FOR{" "}
            <span className="text-gradient-electric">REAL BUSINESSES</span>
          </h2>
        </div>

        {/* 2-Column Responsive Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] items-center gap-8 lg:gap-12 xl:gap-16">
          {/* LEFT: Portrait Card - Balanced size, perfectly fitted on page */}
          <div className="relative flex justify-center lg:justify-start w-full mb-6 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative w-[250px] sm:w-[280px] lg:w-[320px] xl:w-[340px] aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-sky-500/25 shadow-2xl shadow-sky-500/10 bg-[#060b18] group shrink-0"
            >
              {/* Subtle background tech glow inside portrait */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[210px] sm:w-[240px] h-[210px] sm:h-[240px] rounded-full border border-sky-500/15 opacity-40" />
                <div className="absolute w-[160px] sm:w-[190px] h-[160px] sm:h-[190px] rounded-full bg-radial-glow opacity-70" />
              </div>

              <Image
                src={siteConfig.portraitUrl}
                alt="Muhammad Hassan Ali"
                fill
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 300px, 340px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Gentle bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#040814]/90 to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* RIGHT: Content Column */}
          <div className="flex flex-col items-start text-left w-full min-w-0">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-3">

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-black tracking-tight text-white leading-tight"
              >
                I BUILD INTELLIGENT <br className="hidden xl:inline" />
                SOLUTIONS FOR{" "}
                <span className="text-gradient-electric">REAL BUSINESSES</span>
              </motion.h2>
            </div>

            {/* Professional Narrative without dots */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="space-y-3 text-xs sm:text-sm lg:text-[15px] text-slate-300 leading-relaxed font-normal max-w-2xl"
            >
              <p>
                I architect custom AI automation pipelines and high-performance digital systems that eliminate operational bottlenecks, streamline communication, and accelerate business growth
              </p>
              <p className="text-slate-400">
                Specializing in production-ready WhatsApp chatbots, intelligent webhook workflows, and full-stack web platforms built for speed, precision, and measurable ROI
              </p>
            </motion.div>

            {/* Feature Cards: 2x2 Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5 w-full"
            >
              {featureCards.map((card) => (
                <motion.div
                  key={card.number}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  className="px-3.5 py-3 rounded-xl bg-[#070e22]/90 border border-slate-800/90 hover:border-sky-500/40 hover:bg-[#0b1535]/90 transition-all duration-200 shadow-sm flex items-center gap-3 group"
                >
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">
                    {card.number}
                  </span>

                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h4>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
