"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { useAuth } from "../../context/AuthContext";

interface TopBarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export function TopBar({ onOpenMobileMenu, title }: TopBarProps) {
  const { approvals, integrationStatus, isDemoMode } = useDemoData();
  const { user, isDemoUser, logout } = useAuth();
  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-indigo-100/70 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 lg:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h1>
        )}
      </div>

      {/* Right: Search, Integrations pill, Approvals bell */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Connection Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-indigo-100 text-xs shadow-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            HeyReach Live
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Gemini AI Free
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600 text-[11px] font-mono font-bold">
            25/day safe limit
          </span>
        </div>

        {/* Pending Approvals Bell Alert */}
        <Link
          href="/approvals"
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={`${pendingApprovals.length} message drafts waiting for approval`}
        >
          <Bell className="w-5 h-5" />
          {pendingApprovals.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
              {pendingApprovals.length}
            </span>
          )}
        </Link>

        {/* Authentication / Demo Mode Badge */}
        {user ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="truncate max-w-[150px]">{user.email}</span>
          </span>
        ) : isDemoUser ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            Demo Session
          </span>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 px-3 py-1 rounded-lg border border-sky-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
