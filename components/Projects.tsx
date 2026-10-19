"use client";

import React, { useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { projectsData } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProjectsProps {
  limit?: number;
  showViewAll?: boolean;
}

export function Projects({ limit, showViewAll }: ProjectsProps) {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const categories = [
    "All",
    "AI WhatsApp Chatbot",
    "Modern Web Application",
    "AI Solar Assistant",
    "Business Automation Dashboard",
  ];

  const filteredProjects =
    selectedFilter === "All"
      ? projectsData
      : projectsData.filter((p) =>
          p.category.toLowerCase().includes(selectedFilter.toLowerCase())
        );

  const displayedProjects = limit
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  return (
    <section id="projects" className="relative pt-3 pb-5 sm:pt-4 sm:pb-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="FEATURED"
          highlight="PROJECTS"
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-5">
          {categories.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 min-h-[36px] ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 scale-102"
                    : "bg-slate-900/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Responsive Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {displayedProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>

        {showViewAll && (
          <div className="mt-4 sm:mt-5 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 transition-all"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
