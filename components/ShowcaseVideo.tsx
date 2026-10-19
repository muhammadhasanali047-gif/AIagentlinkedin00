"use client";

import React, { useState, useRef } from "react";
import { SectionHeading } from "./SectionHeading";
import { videoScenesData } from "@/data/videoScenes";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Bot,
  Workflow,
  LayoutDashboard,
  Users,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const sceneIcons = {
  whatsapp: MessageSquare,
  ai: Bot,
  workflow: Workflow,
  dashboard: LayoutDashboard,
  lead: Users,
  brand: ShieldCheck,
};

export function ShowcaseVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error("Playback failed:", e);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const activeScene = videoScenesData[activeSceneIndex];

  return (
    <section
      id="showcase-video"
      className="relative py-20 sm:py-28 bg-[#040814] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeading
          title="SEE WHAT I"
          highlight="BUILD"
        />

        {/* Cinematic Video Showcase Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden glass-panel border border-sky-500/25 shadow-2xl shadow-sky-500/10">
            {/* 16:9 Aspect Ratio Container */}
            <div className="relative w-full aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src="/videos/portfolio-showcase.mp4"
                poster="/images/projects/bspe-gateway.svg"
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Big Play Overlay (when paused) */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
                  role="button"
                  aria-label="Play showcase video"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 translate-x-0.5" />
                  </div>
                  <span className="mt-4 text-xs sm:text-sm font-semibold tracking-wider uppercase text-cyan-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-cyan-500/30">
                    Play Full Demo Reel
                  </span>
                </div>
              )}

              {/* Video Bottom Control Bar */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between px-4 sm:px-6 z-20">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>

                  <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                    Hassan // AI Automation Showcase
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                    HD 1080p
                  </span>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="w-9 h-9 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition-colors"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Scene Concept Storyboard */}
          <div className="mt-8 rounded-2xl glass-panel p-5 sm:p-8 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div>
                <div className="text-xs font-bold tracking-wider text-sky-400 uppercase">
                  Architecture Workflow Concept
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  End-to-End Automation Pipeline (6 Scenes)
                </h3>
              </div>
              <div className="text-xs text-slate-400">
                Click any scene to inspect the flow step
              </div>
            </div>

            {/* Scene Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-6">
              {videoScenesData.map((scene, idx) => {
                const isSelected = activeSceneIndex === idx;
                const IconComponent = sceneIcons[scene.visualType] || Sparkles;
                return (
                  <button
                    key={scene.scene}
                    type="button"
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-sky-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-[10px] font-bold text-sky-400 uppercase">
                        {scene.badge}
                      </span>
                      <IconComponent className={`w-3.5 h-3.5 ${isSelected ? "text-cyan-400" : "text-slate-500"}`} />
                    </div>
                    <span className="text-xs font-semibold leading-tight line-clamp-1">
                      {scene.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Scene Detail View */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScene.scene}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-sky-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                    {React.createElement(sceneIcons[activeScene.visualType] || Sparkles, {
                      className: "w-5 h-5",
                    })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400 uppercase">
                        {activeScene.badge}
                      </span>
                      <span className="text-xs text-slate-400">&bull; {activeScene.timecode}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {activeScene.title}
                    </h4>
                    <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                      {activeScene.description}
                    </p>
                  </div>
                </div>

                {/* Final CTA in Scene 6 or general action */}
                <Link
                  href="#contact"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>LET&apos;S AUTOMATE YOUR BUSINESS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
