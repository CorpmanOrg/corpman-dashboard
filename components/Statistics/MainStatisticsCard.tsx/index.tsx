"use client";

import { ReactNode, FC } from "react";
import { BarChart3, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityMiniChart } from "@/components/dashboard-charts";
import { StatCard } from "../StatCard";

export interface StatData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function MainStatisticsCard({ stats }: { stats: StatData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} />
      ))}
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:shadow-green-900/10">
        <div className="bg-gradient-to-r from-[#5aed5f] to-[#0e4430] text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Overall Activity</p>
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="h-[60px]">
            <ActivityMiniChart />
          </div>
        </div>
      </Card>
    </div>
  );
}
