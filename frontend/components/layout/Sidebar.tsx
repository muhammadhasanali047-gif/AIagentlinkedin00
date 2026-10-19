"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Send,
  ShieldAlert,
  Inbox,
  Clock,
  BarChart3,
  ScrollText,
  Settings,
  Sparkles,
  Bot,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useDemoData } from "../../context/DemoDataContext";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { approvals, replies, integrationStatus } = useDemoData();
  const { user, isDemoUser, logout } = useAuth();

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length;
  const unreadRepliesCount = replies.filter((r) => r.unread).length;

  const navItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: "Leads Management",
      href: "/leads",
      icon: Users,
      active: pathname === "/leads",
    },
    {
      label: "Campaigns",
      href: "/campaigns",
      icon: Send,
      active: pathname === "/campaigns",
    },
    {
      label: "Approval Queue",
      href: "/approvals",
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: "bg-amber-500 text-white",
      active: pathname === "/approvals",
    },
    {
      label: "Inbox & Replies",
      href: "/inbox",
      icon: Inbox,
      badge: unreadRepliesCount > 0 ? unreadRepliesCount : undefined,
      badgeColor: "bg-sky-500 text-white",
      active: pathname === "/inbox",
    },
    {
      label: "Follow-ups Due",
      href: "/followups",
      icon: Clock,
      active: pathname === "/followups",
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
    {
      label: "Activity Logs",
      href: "/activity",
      icon: ScrollText,
      active: pathname === "/activity",
    },
    {
      label: "Settings & APIs",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90 text-slate-300 flex flex-col border-r border-indigo-900/30 shadow-2xl transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-indigo-900/40 bg-slate-950/60">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-white tracking-tight group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-white leading-tight">OutreachAI</span>
              <span className="text-[10px] text-emerald-400 font-semibold leading-none">LinkedIn AI Agent</span>
            </div>
          </Link>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold">
            v2.0
          </span>
        </div>

        {/* AI & Integration Quick Health Strip */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-xs shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Autonomous Engine
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Active
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div className="flex justify-between items-center">
              <span>HeyReach:</span>
              <span className="text-emerald-300 font-semibold">✓ Authorized</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gemini AI:</span>
              <span className="text-indigo-300 font-semibold">✓ Connected</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  item.active
                    ? "bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                      item.badgeColor || "bg-indigo-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer User Profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/30">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sky-900 text-sky-200 border border-sky-700/60 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.displayName
                  ? user.displayName.slice(0, 2).toUpperCase()
                  : user?.email
                  ? user.email.slice(0, 2).toUpperCase()
                  : "OP"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.displayName || (user?.email ? user.email.split("@")[0] : isDemoUser ? "Demo Operator" : "Operator")}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || (isDemoUser ? "demo@outreach.ai" : "Firebase Auth")}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
