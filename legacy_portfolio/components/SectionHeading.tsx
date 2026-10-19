"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  highlight,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl mb-3 sm:mb-4 ${
        centered ? "mx-auto text-center" : "text-left"
      }`}
    >

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight"
      >
        {title}{" "}
        {highlight && (
          <span className="text-gradient-electric">{highlight}</span>
        )}
      </motion.h2>
    </div>
  );
}
