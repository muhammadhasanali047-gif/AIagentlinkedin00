"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Bot, Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isDemoUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !isDemoUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, isDemoUser, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-4 animate-bounce">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          <span>Verifying Firebase Authentication Session...</span>
        </div>
      </div>
    );
  }

  if (!user && !isDemoUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
