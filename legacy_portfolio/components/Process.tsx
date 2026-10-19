"use client";

import React from "react";
import { SectionHeading } from "./SectionHeading";
import { processSteps } from "@/data/process";
import {
  Search,
  Compass,
  Code2,
  Zap,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

const processIconMap: Record<string, React.ElementType> = {
  Search,
  Compass,
  Code2,
  Zap,
  Rocket,
  TrendingUp,
};

export function Process() {
  return (
    <section id="process" className="relative pt-3 pb-6 sm:pt-4 sm:pb-8 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="HOW I"
          highlight="WORK"
        />

        {/* Responsive 6-Card Engineering Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-4 sm:mt-6">
          {processSteps.map((step, idx) => {
            const IconComponent = processIconMap[step.iconName] || Code2;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/25 px-2.5 py-0.5 rounded-md">
                      STEP {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-sky-400 group-hover:text-cyan-300 group-hover:border-sky-500/40 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {step.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
