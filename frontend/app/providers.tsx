"use client";

import { AppProvider } from "@/context/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AuthGuard>{children}</AuthGuard>
    </AppProvider>
  );
}

