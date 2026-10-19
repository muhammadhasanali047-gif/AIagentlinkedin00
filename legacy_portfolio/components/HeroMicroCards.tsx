"use client";

import React, { useRef } from "react";

interface MicroCard {
  title: string;
}

const baseCards: MicroCard[] = [
  { title: "AI Automation" },
  { title: "WhatsApp Chatbots" },
  { title: "Full-Stack Development" },
  { title: "Data & AI Solutions" },
  { title: "n8n Automation" },
  { title: "RAG & Vector Search" },
  { title: "Business Dashboards" },
  { title: "Docker & Cloud Deploy" },
];

export function HeroMicroCards() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Duplicate cards for seamless infinite marquee loop
  const duplicatedCards = [...baseCards, ...baseCards];

  return (
    <div className="relative w-full mt-6 sm:mt-7 lg:mt-8 group/slider">
      {/* Overflow Container with Edge Gradient Mask */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar slider-mask py-0.5 cursor-grab active:cursor-grabbing"
      >
        {/* Infinite Marquee Track */}
        <div className="animate-marquee flex items-center gap-2.5 sm:gap-3">
          {duplicatedCards.map((card, idx) => (
            <div
              key={`${card.title}-${idx}`}
              className="shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-900 transition-all duration-200 shadow-sm flex items-center select-none"
            >
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight whitespace-nowrap hover:text-cyan-300 transition-colors">
                {card.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
