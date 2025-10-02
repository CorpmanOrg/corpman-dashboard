"use client";

import React, { ReactNode } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { Card } from "../../ui/card";
import { ActivityMiniChart } from "../../dashboard-charts";
import { StatCard } from "../StatCard";
import clsx from "clsx";

export interface StatData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

interface MainStatisticsCardProps {
  stats: StatData[];
  showActivityCard?: boolean;
  customActivityCard?: ReactNode;
  className?: string;
  extraChildrenBeforeActivity?: ReactNode;
  extraChildrenAfter?: ReactNode;
  gridTemplateClassName?: string;
  adaptiveColumns?: boolean;
  fetching?: boolean;
}

export const MainStatisticsCard = ({
  stats,
  showActivityCard = true,
  customActivityCard,
  className,
  extraChildrenBeforeActivity,
  extraChildrenAfter,
  gridTemplateClassName,
  adaptiveColumns = true,
  fetching = false,
}: MainStatisticsCardProps) => {
  const beforeCount = extraChildrenBeforeActivity ? React.Children.toArray(extraChildrenBeforeActivity).length : 0;
  const afterCount = extraChildrenAfter ? React.Children.toArray(extraChildrenAfter).length : 0;
  const activityCount = showActivityCard ? 1 : 0;
  const totalItems = stats.length + beforeCount + activityCount + afterCount;

  let adaptiveGrid = "grid grid-cols-1 sm:grid-cols-2";
  if (adaptiveColumns) {
    if (totalItems > 4) adaptiveGrid += " lg:grid-cols-5";
    else if (totalItems === 4) adaptiveGrid += " lg:grid-cols-4";
    else if (totalItems === 3) adaptiveGrid += " lg:grid-cols-3";
    else if (totalItems === 2) adaptiveGrid += " lg:grid-cols-2";
    else adaptiveGrid += " lg:grid-cols-1";
  } else {
    adaptiveGrid = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  }

  const gridClasses = gridTemplateClassName || adaptiveGrid;

  const defaultActivityCard = (
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
  );

  return (
    <div className={clsx(gridClasses, "gap-6 p-6 relative", className)}>
      {fetching && (
        <div className="pointer-events-none absolute -top-2 right-4 flex items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="font-medium">Updating</span>
        </div>
      )}
      {stats.map((stat, idx) => (
        <StatCard key={idx} title={stat.title} value={stat.value} icon={stat.icon} loading={stat.loading} />
      ))}
      {extraChildrenBeforeActivity}
      {showActivityCard && (customActivityCard || defaultActivityCard)}
      {extraChildrenAfter}
    </div>
  );
};

export default MainStatisticsCard;
