"use client";

import React from "react";
import Image from "next/image";
import { ProjectItem } from "@/data/projects";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-900/90 transition-all duration-200 shadow-sm"
    >
      {/* Top Media Container */}
      <div>
        <div className="relative w-full aspect-video overflow-hidden bg-slate-950 border-b border-slate-800/80">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category Chip */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/30 text-[10px] font-semibold text-cyan-300">
            {project.category}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          {/* Technology Badges */}
          <div className="mt-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer with Action Buttons */}
      <div className="px-4 sm:p-5 pb-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-sky-500/20 hover:border-sky-500/40 border border-slate-700/60 transition-all min-h-[36px]"
              aria-label={`Live demo of ${project.title}`}
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 transition-all min-h-[36px]"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github className="w-3 h-3" />
              <span>Code</span>
            </a>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-800/60 group-hover:bg-cyan-400 group-hover:text-slate-950 text-sky-400 flex items-center justify-center transition-all">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
