"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideNav } from "@/layout/SideNav";
import { Header } from "@/components/Header/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔒 SECURITY: Redirect to auth if no user
  useEffect(() => {
    if (!loading && !user) {
      console.warn("⚠️ No authenticated user - redirecting to auth");
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render admin layout if no user
  if (!user) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <SideNav />
        <main className="flex-1 flex flex-col min-h-0 overflow-auto bg-gray-100 dark:bg-gray-950">
          <Header />
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
