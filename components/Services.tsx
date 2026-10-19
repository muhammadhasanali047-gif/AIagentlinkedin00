"use client";

import React from "react";
import { SectionHeading } from "./SectionHeading";
import { servicesData } from "@/data/services";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ServicesProps {
  limit?: number;
  showViewAll?: boolean;
}

export function Services({ limit, showViewAll }: ServicesProps) {
  const items = limit ? servicesData.slice(0, limit) : servicesData;

  return (
    <section id="services" className="relative pt-3 pb-5 sm:pt-4 sm:pb-6 bg-gradient-to-b from-transparent via-slate-900/35 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="SOLUTIONS I"
          highlight="ENGINEER"
        />

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((service, idx) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/90 transition-all duration-200 shadow-sm"
            >
              <div>
                <div className="mb-2">
                  <span className="text-sm font-mono font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {service.number}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-3">
                  {service.description}
                </p>

                  <ul className="space-y-1.5 border-t border-slate-800/70 pt-3 mb-3.5">
                    {service.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-xs text-slate-300 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 group-hover:text-cyan-300 transition-colors pt-2"
                >
                  <span>Inquire About This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
        </div>

        {showViewAll && (
          <div className="mt-4 sm:mt-5 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 transition-all"
            >
              <span>Explore All 6 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
