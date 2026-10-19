"use client";

import React from "react";
import { SectionHeading } from "./SectionHeading";
import { valueStatements } from "@/data/results";
import { motion } from "framer-motion";

export function ResultsValue() {
  return (
    <section className="relative pt-3 pb-5 sm:pt-4 sm:pb-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="DELIVERING REAL"
          highlight="BUSINESS VALUE"
        />

        {/* 4 Capability/Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {valueStatements.map((val, idx) => (
            <motion.div
              key={val.metric}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="group relative p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-2">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-gradient-electric">
                    {val.metric}
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {val.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center gap-1.5 text-[10px] font-semibold text-sky-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Production Standard</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
