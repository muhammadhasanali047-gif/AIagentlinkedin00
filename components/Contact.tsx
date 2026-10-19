"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Linkedin,
  MapPin,
  Phone,
  Github,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, "Please enter your message"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const [formState, setFormState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Unable to send message. Please contact directly via email.");
      }

      setFormState("success");
      reset();
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please email directly."
      );
    }
  };

  return (
    <section id="contact" className="relative pt-3 sm:pt-4 pb-12 sm:pb-16 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header (Moved up & tight spacing) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Contact us
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            Have a project in mind, need an autonomous AI workflow, WhatsApp AI chatbot, or modern full-stack web application? Reach out and let&apos;s build it together.
          </p>
        </div>

        {/* 2-Column Symmetrical Content Grid with Center Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-stretch">
          
          {/* Left Column: Direct Channels & Connect Card (lg:col-span-5) */}
          <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide mb-1">
                Direct Channels
              </h2>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Connect directly through developer channels or instant chat.
              </p>

              {/* Action Channels */}
              <div className="space-y-2.5">
                {/* GitHub Channel */}
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-950/90 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Contribute on GitHub
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      github.com
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 transition-colors" />
                </a>

                {/* WhatsApp Community / Chat */}
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-950/90 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Chat on WhatsApp
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      Instant direct consultation
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-300 transition-colors" />
                </a>
              </div>

              {/* Direct Info List */}
              <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-[11px] text-slate-400 truncate">{siteConfig.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">{siteConfig.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-400">{siteConfig.location}</span>
                </div>
              </div>
            </div>

            {/* Follow Us Row */}
            <div className="mt-5 pt-3.5 border-t border-slate-800/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Follow us
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800 hover:text-cyan-300 text-slate-400 flex items-center justify-center transition-all shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white text-slate-400 flex items-center justify-center transition-all shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-800 hover:text-cyan-300 text-slate-400 flex items-center justify-center transition-all shadow-sm"
                  aria-label="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300 text-emerald-400 flex items-center justify-center transition-all shadow-sm"
                  aria-label="WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full">
            <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-slate-800/90 shadow-xl backdrop-blur-xl relative overflow-hidden">
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Success Alert */}
              <AnimatePresence>
                {formState === "success" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs">Message Sent Successfully!</div>
                      <p className="text-emerald-300/80 text-[11px] mt-0.5">
                        Thank you for reaching out. Hassan will get back to you shortly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Alert */}
              <AnimatePresence>
                {formState === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs">Failed to Send Message</div>
                      <p className="text-rose-300/80 text-[11px] mt-0.5">
                        {errorMessage || "Please send an email directly to muhammadhasanali047@gmail.com."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-4">
                {/* 2-Column Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Carter"
                      {...register("name")}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.name
                          ? "border-rose-500/60 focus:ring-rose-400"
                          : "border-slate-800 focus:border-sky-500 focus:ring-sky-400/20"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-rose-400 mt-0.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@youremail.com"
                      {...register("email")}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.email
                          ? "border-rose-500/60 focus:ring-rose-400"
                          : "border-slate-800 focus:border-sky-500 focus:ring-sky-400/20"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-rose-400 mt-0.5">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2-Column Row 2: Phone & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="123 - 456 - 7890"
                      {...register("phone")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-[11px] font-semibold text-slate-300 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Ex. Careers, AI Project"
                      {...register("subject")}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400/20 transition-all"
                    />
                  </div>
                </div>

                {/* Full-Width Row 3: Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] font-semibold text-slate-300 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={3.5}
                    placeholder="Type your message here..."
                    {...register("message")}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all resize-y min-h-[90px] ${
                      errors.message
                        ? "border-rose-500/60 focus:ring-rose-400"
                        : "border-slate-800 focus:border-sky-500 focus:ring-sky-400/20"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[10px] text-rose-400 mt-0.5">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="py-2.5 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-600/30 hover:shadow-blue-500/40 flex items-center justify-center gap-2 cursor-pointer min-h-[42px] active:scale-[0.98]"
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
