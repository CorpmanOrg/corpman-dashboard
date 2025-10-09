import { ReactNode, FC, useState, useEffect } from "react";
import { BarChart3, ChevronRight, Users, User, Megaphone, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ActivityMiniChart } from "@/components/dashboard-charts";
import { MainStatCard } from "@/constants/data";

interface StatCardProps {
  icon: ReactNode;
  title: string | undefined;
  value: string | number | undefined;
  color?: string; // background color for the card
  iconBg?: string; // background color for the icon (deprecated)
  iconGradient?: string; // gradient classes for the icon
  children?: ReactNode;
  loading?: boolean;
}

export function StatCard({ icon, title, value, color, iconBg, iconGradient, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card
        className="overflow-hidden shadow-md transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900 animate-pulse"
        aria-busy="true"
        aria-live="polite"
      >
        <div className={`p-3 sm:p-4 ${color ? color : "bg-white dark:bg-gray-900"}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-2.5 sm:h-3 w-20 sm:w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 sm:h-7 w-24 sm:w-32 rounded bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-3 bg-[#f9fdf9] dark:bg-gray-900/40">
          <div className="h-3 sm:h-4 w-20 sm:w-28 rounded bg-gray-200 dark:bg-gray-700 mx-auto" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className={`p-3 sm:p-4 ${color ? color : "bg-white dark:bg-gray-900"}`}>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5 sm:mt-1 text-gray-800 dark:text-gray-200 truncate">
              {value}
            </h3>
          </div>
          <div
            className={`${
              iconGradient
                ? iconGradient
                : "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500"
            } p-1.5 sm:p-2 rounded-full text-white flex items-center justify-center flex-shrink-0`}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">{icon}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-3 bg-[#f9fdf9] dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-[#19d21f] dark:hover:text-green-400 cursor-pointer transition-colors">
          <span>View Details</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </div>
    </Card>
  );
}

export function StatCardOpposite({ icon, title, value, iconGradient }: StatCardProps) {
  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className="p-3 sm:p-4 md:p-5 bg-white dark:bg-gray-900 flex items-center gap-2 sm:gap-3 md:gap-4">
        <div
          className={`${
            iconGradient
              ? iconGradient
              : "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500"
          } p-1.5 sm:p-2 md:p-3 rounded-full text-white flex items-center justify-center flex-shrink-0`}
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center">{icon}</div>
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 text-right truncate">{title}</p>
          <h3 className="text-xs sm:text-sm md:text-base font-thin mt-0.5 sm:mt-1 text-gray-900 dark:text-gray-100 text-right truncate">
            {value}
          </h3>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-3 md:p-4 bg-[#f9fdf9] dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-[#19d21f] dark:hover:text-green-400 cursor-pointer transition-colors">
          <span>View Details</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </div>
      </div>
    </Card>
  );
}
