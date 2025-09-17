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
}

export function StatCard({ icon, title, value, color, iconBg, iconGradient }: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className={`p-4 ${color ? color : "bg-white dark:bg-gray-900"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-200">{value}</h3>
          </div>
          <div
            className={`${
              iconGradient
                ? iconGradient
                : "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500"
            } p-3 rounded-full text-white flex items-center justify-center`}
          >
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
