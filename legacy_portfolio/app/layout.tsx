import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/config";
import { WhatsAppButton, CustomCursor } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hassan-portfolio.vercel.app"),
  title: `${siteConfig.name} | ${siteConfig.primaryTitle}`,
  description:
    "Hassan builds AI automation systems, WhatsApp chatbots, modern web applications and data-driven solutions for businesses.",
  keywords: [
    "AI Automation",
    "WhatsApp AI Chatbots",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "LangChain",
    "AI Agents",
    "Node.js",
    "Multan Pakistan AI Engineer",
    "Business Automation",
    "Muhammad Hassan Ali",
  ],
  authors: [{ name: "Muhammad Hassan Ali" }],
  creator: "Muhammad Hassan Ali",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hassan-portfolio.vercel.app",
    title: `${siteConfig.name} | ${siteConfig.primaryTitle}`,
    description:
      "Hassan builds AI automation systems, WhatsApp chatbots, modern web applications and data-driven solutions for businesses.",
    siteName: "Hassan Portfolio",
    images: [
      {
        url: "/images/hassan-portrait.jpg",
        width: 1200,
        height: 1200,
        alt: "Hassan - AI Automation & Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.primaryTitle}`,
    description:
      "Hassan builds AI automation systems, WhatsApp chatbots, modern web applications and data-driven solutions for businesses.",
    images: ["/images/hassan-portrait.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth dark`}
    >
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-cyan-300 relative overflow-x-hidden">
        {/* Fixed Ambient Glow Backdrop Lighting */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
          {/* Top Hero Ambient Glow */}
          <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] bg-gradient-to-b from-sky-500/18 via-cyan-500/10 to-transparent rounded-full blur-3xl opacity-80" />
          {/* Mid Left Blue Glow */}
          <div className="absolute top-[30%] -left-[10%] w-[500px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
          {/* Mid Right Cyan Glow */}
          <div className="absolute top-[60%] -right-[10%] w-[550px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
          {/* Bottom Ambient Glow */}
          <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-sky-500/12 rounded-full blur-3xl" />
          {/* Subtle Tech Grid Overlay */}
          <div className="absolute inset-0 tech-grid-pattern opacity-50" />
        </div>

        <CustomCursor />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
