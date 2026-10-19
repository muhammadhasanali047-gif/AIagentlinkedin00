import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "positive",
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50/80",
  badge,
}: MetricCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-indigo-100/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300/80 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
      {/* Top micro gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            {badge && (
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} border border-indigo-100/60 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                changeType === "positive"
                  ? "text-emerald-600"
                  : changeType === "negative"
                  ? "text-rose-600"
                  : "text-indigo-600"
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-400 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
