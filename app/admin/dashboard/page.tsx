"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header/Header";
import { SideNav } from "@/layout/SideNav";
import { MainStatisticsCard, StatData } from "@/components/Statistics/MainStatisticsCard.tsx";
import { LineCharts } from "@/components//Charts/LineCharts";
import { PieCharts } from "@/components//Charts/PieCharts";
import { Reminders } from "@/components//Reminders/Reminders";
import { AdvertCarousel } from "@/components//Carousel/AdvertCarousel";
import { Users, DollarSign, CreditCard } from "lucide-react";
import { dummyLineData, dummyPieData } from "@/components/assets/data";

export default function Dashboard() {
  const { user } = useAuth();

  // Dummy/statistics data for each role
  const adminStats: StatData[] = [
    { title: "Members", value: 1250, icon: <Users /> },
    { title: "Contributions / Savings", value: `150 / 45`, icon: <DollarSign /> },
    { title: "Loans", value: 4560, icon: <CreditCard /> },
    // ...add more as needed
  ];

  const memberStats: StatData[] = [
    { title: "Contributions", value: 200, icon: <DollarSign /> },
    { title: "Savings", value: 300, icon: <DollarSign /> },
    { title: "Loans", value: 4560, icon: <CreditCard /> },
    // ...add more as needed
  ];

  // Choose stats based on role
  const stats = user?.role === "admin" ? adminStats : memberStats;

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
          <div className="flex-1 overflow-y-auto">
            <MainStatisticsCard stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <LineCharts data={dummyLineData} />
              <PieCharts data={dummyPieData} />
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
