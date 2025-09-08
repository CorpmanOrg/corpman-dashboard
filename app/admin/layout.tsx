import React from "react";
import { SideNav } from "@/layout/SideNav";
import { Header } from "@/components/Header/Header";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <SideNav />
        <main className="flex-1 flex flex-col overflow-auto bg-white dark:bg-gray-950">
          <Header />
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
