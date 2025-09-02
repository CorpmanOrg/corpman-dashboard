"use client";

import { ReactNode, FC, useState, useEffect } from "react";
import { BarChart3, ChevronRight, Users, User, Megaphone, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityMiniChart } from "@/components/dashboard-charts";
import { MainStatCard } from "@/constants/data";

interface StatCardProps {
  icon: ReactNode;
  title: string | undefined;
  value: string | undefined;
  children?: ReactNode;
}

export function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-200">{value}</h3>
          </div>
          <div className="bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500 p-3 rounded-full text-white">
            {icon}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-[#f9fdf9] dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-[#19d21f] dark:hover:text-green-400 cursor-pointer transition-colors">
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

export function StatCardOpposite({ icon, title, value }: StatCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className="p-5 bg-white dark:bg-gray-900 flex items-center gap-4">
        <div className="bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500 p-4 rounded-full text-white flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col justify-center flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 text-right">{title}</p>
          <h3 className="text-sm font-thin mt-1 text-gray-900 dark:text-gray-100 text-right">{value}</h3>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-[#f9fdf9] dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-base text-gray-600 dark:text-gray-400 hover:text-[#19d21f] dark:hover:text-green-400 cursor-pointer transition-colors">
          <span>View Details</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

interface StatCardThirdProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeColor?: string; // e.g. "text-green-600" or "text-red-600"
  subtext?: string;
}

export const StatCardThird: FC<StatCardThirdProps> = ({
  icon,
  title,
  value,
  change = "+6.5%",
  changeColor = "text-green-600",
  subtext = "Since last week",
}) => (
  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col justify-between p-4">
    <div className="flex items-center">
      {/* Accent bar */}
      <div className="w-1 h-10 rounded-full bg-gradient-to-b from-blue-500 to-purple-400 mr-3" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">{value}</h3>
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-xs font-semibold ${changeColor}`}>{change}</span>
          <span className="text-xs text-gray-400">{subtext}</span>
        </div>
      </div>
      {/* Icon */}
      <div className="ml-3 bg-blue-50 dark:bg-blue-900 p-2 rounded-full flex items-center justify-center">{icon}</div>
    </div>
  </Card>
);

export function MainStatisticsCard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {MainStatCard &&
          MainStatCard?.map((statCd, idx) => (
            <StatCard key={idx} title={statCd.title} value={statCd.value} icon={statCd.icon} />
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
    </>
  );
}
