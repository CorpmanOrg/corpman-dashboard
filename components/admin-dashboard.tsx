"use client";

import { ReactNode, FC, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { TooltipProvider, } from "@/components/ui/tooltip";
import { Header } from "./Header/Header";
import { SideNav } from "@/layout/SideNav";
import { MainStatisticsCard } from "./Statistics/MainStatisticsCard.tsx";
import { LineCharts } from "./Charts/LineCharts";
import { PieCharts } from "./Charts/PieCharts";
import { Reminders } from "./Reminders/Reminders";
import { AdvertCarousel } from "./Carousel/AdvertCarousel";

export function AdminDashboard() {
  const { user } = useAuth();

  // useEffect(() => {
  //   if (!user) {
  //     window.location.assign("/auth?mode=signin");
  //   }
  // }, [user]);

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <SideNav />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
          <Header />

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 bg-gradient-to-r from-[#e7f7e7] to-[#f0f9f0] dark:from-green-900/20 dark:to-green-800/20 border-b border-green-100 dark:border-green-900/30">
              <h2 className="text-lg font-medium text-[#0e4430] dark:text-green-400">{`Welcome back, ${
                user?.name || "user"
              }`}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your cooperative today.
              </p>
            </div>

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
