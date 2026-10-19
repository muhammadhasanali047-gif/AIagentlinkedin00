"use client";

import React, { useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { skillsData } from "@/data/skills";
import {
  Bot,
  Layout,
  Server,
  Database,
  Workflow,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const categoryIconMap: Record<string, React.ElementType> = {
  "AI & Automation": Bot,
  Frontend: Layout,
  Backend: Server,
  Database: Database,
  Automation: Workflow,
  Development: Terminal,
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...skillsData.map((c) => c.title)];

  const displayedCategories =
    activeCategory === "All"
      ? skillsData
      : skillsData.filter((c) => c.title === activeCategory);

  return (
    <section id="skills" className="relative py-6 sm:py-8 bg-gradient-to-b from-transparent via-slate-900/35 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="TECHNOLOGIES &amp;"
          highlight="TOOLS"
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 min-h-[36px] ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 shadow-md shadow-cyan-500/20 scale-102"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedCategories.map((category, catIdx) => {
            const CategoryIcon =
              categoryIconMap[category.title] || Terminal;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: catIdx * 0.05 }}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 hover:border-sky-500/40 transition-all duration-200 shadow-sm"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-cyan-400">
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                </div>

                {/* Skills List in Category */}
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-sky-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          {skill.name}
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-cyan-400/80 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 pl-4.5 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
