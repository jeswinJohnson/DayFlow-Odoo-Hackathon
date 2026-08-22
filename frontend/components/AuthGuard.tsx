"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { activeUser, authLoading } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!authLoading) {
      if (!activeUser && !isLoginPage) {
        router.replace("/login");
      } else if (activeUser && isLoginPage) {
        router.replace("/");
      }
    }
  }, [activeUser, authLoading, isLoginPage, router]);

  // Loading state while verifying auth session
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute w-6 h-6 rounded-full border-2 border-violet-500/20 border-b-violet-500 animate-spin [animation-duration:0.6s]" />
          </div>
          <p className="text-zinc-400 text-sm font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Redirecting fallback while navigating to /login
  if (!activeUser && !isLoginPage) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-zinc-500 text-xs font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Redirecting fallback while authenticated user tries to open /login
  if (activeUser && isLoginPage) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-zinc-500 text-xs font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
