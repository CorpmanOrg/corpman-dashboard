"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header/Header";
import { SideNav } from "@/layout/SideNav";
import { MainStatisticsCard } from "@/components/Statistics/MainStatisticsCard.tsx";
import { LineCharts } from "@/components//Charts/LineCharts";
import { PieCharts } from "@/components//Charts/PieCharts";
import { Reminders } from "@/components//Reminders/Reminders";
import { AdvertCarousel } from "@/components//Carousel/AdvertCarousel";

export function Dashboards() {
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
          <div className="flex-1 overflow-y-auto">
            <MainStatisticsCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <LineCharts />
              <PieCharts />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <Reminders />

              <AdvertCarousel />
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
