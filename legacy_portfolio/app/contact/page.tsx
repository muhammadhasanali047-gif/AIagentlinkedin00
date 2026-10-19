import type { Metadata } from "next";
import { Navbar, Contact, Footer } from "@/components";

export const metadata: Metadata = {
  title: "Contact | Hassan - AI Automation & Full-Stack Developer",
  description:
    "Get in touch with Hassan. Discuss your AI automation needs, WhatsApp chatbot projects, web applications, or data solutions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex flex-col pt-10 sm:pt-12 selection:bg-sky-500/30 selection:text-cyan-300">
      <Navbar />

      {/* Contact Form & Direct Channels directly without duplicate banner */}
      <Contact />

      <Footer />
    </main>
  );
}
