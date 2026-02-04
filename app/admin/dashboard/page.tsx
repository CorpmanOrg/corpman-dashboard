"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAdminBalanceFn } from "@/utils/ApiFactory/admin";
import { getMembersBalanceFn } from "@/utils/ApiFactory/member";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header/Header";
import { SideNav } from "@/layout/SideNav";
import MainStatisticsCard from "@/components/Statistics/MainStatisticsCard";
import { LineCharts } from "@/components//Charts/LineCharts";
import { PieCharts } from "@/components//Charts/PieCharts";
import { Reminders } from "@/components//Reminders/Reminders";
import { AdvertCarousel } from "@/components//Carousel/AdvertCarousel";
import { Users, CreditCard, PiggyBank, GitBranchPlus } from "lucide-react";
import { dummyLineData, dummyPieData } from "@/components/assets/data";
import { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

export default function Dashboard() {
  const { activeContext, activeOrgId, currentOrgId } = useAuth();
  const { setLoading } = useLoading();
  const [componentsLoading, setComponentsLoading] = useState(true);

  // 🐛 DEBUG: Log context values
  useEffect(() => {
    console.log("📊 Dashboard Context:", {
      activeContext,
      activeOrgId,
      currentOrgId,
      shouldFetchAdmin: activeContext === "org_admin" && !!activeOrgId,
      shouldFetchMember: activeContext === "member",
    });
  }, [activeContext, activeOrgId, currentOrgId]);

  // Simulate loading for charts and other components
  useEffect(() => {
    const timer = setTimeout(() => {
      setComponentsLoading(false);
    }, 2500); // 2.5 seconds loading simulation

    return () => clearTimeout(timer);
  }, []);

  // Clear global loading when dashboard is ready
  useEffect(() => {
    const clearGlobalLoading = setTimeout(() => {
      setLoading(false);
    }, 1000); // Clear after dashboard starts loading

    return () => clearTimeout(clearGlobalLoading);
  }, [setLoading]);

  const {
    data: adminData,
    isLoading: adminLoading,
    isFetching: adminFetching,
    error: adminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ["admin-balance", activeOrgId],
    queryFn: () => getAdminBalanceFn(activeOrgId!),
    enabled: activeContext === "org_admin" && !!activeOrgId,
    staleTime: 60_000,
    select: (raw) => raw?.organization ?? null,
  });

  const {
    data: memberData,
    isLoading: memberLoading,
    isFetching: memberFetching,
    error: memberError,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["member-balance"],
    queryFn: () => getMembersBalanceFn(),
    enabled: activeContext === "member",
    staleTime: 60_000,
    select: (raw) => (Array.isArray(raw) && raw.length > 0 ? raw[0] : null),
  });

  const activeData = activeContext === "member" ? memberData : adminData;
  const initialLoading = activeContext === "member" ? memberLoading && !memberData : adminLoading && !adminData;
  const backgroundFetching = activeContext === "member" ? memberFetching && !!memberData : adminFetching && !!adminData;

  const memberStats = [
    {
      title: "Savings",
      value: `₦${(activeData?.balances?.savings ?? 0).toLocaleString()}`,
      icon: <PiggyBank />,
      loading: initialLoading,
    },
    {
      title: "Contributions",
      value: `₦${(activeData?.balances?.contribution ?? 0).toLocaleString()}`,
      icon: <GitBranchPlus />,
      loading: initialLoading,
    },
    {
      title: "Loans",
      value: `₦${(activeData?.balances?.loans ?? 0).toLocaleString()}`,
      icon: <CreditCard />,
      loading: initialLoading,
    },
  ];

  const adminStats = [
    { title: "Members", value: activeData?.totalMembers ?? 0, icon: <Users />, loading: initialLoading },
    {
      title: "Savings",
      value: `₦${(activeData?.totalBalances?.totalSavings ?? 0).toLocaleString()}`,
      icon: <PiggyBank />,
      loading: initialLoading,
    },
    {
      title: "Contributions",
      value: `₦${(activeData?.totalBalances?.totalContributions ?? 0).toLocaleString()}`,
      icon: <GitBranchPlus />,
      loading: initialLoading,
    },
    {
      title: "Loans",
      value: `₦${(activeData?.totalBalances?.totalLoansIssued ?? 0).toLocaleString()}`,
      icon: <CreditCard />,
      loading: initialLoading,
    },
  ];

  const errorObj = activeContext === "member" ? memberError : adminError;

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("Balance snapshot", { role: activeContext, activeData, initialLoading, backgroundFetching });
  }

  console.log("Dashboard Data: ", { activeOrgId, activeContext, currentOrgId });

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
          <div className="flex-1 overflow-y-auto">
            {errorObj && !initialLoading && (
              <div className="mx-6 mb-2 rounded border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs px-3 py-2 flex items-center justify-between">
                <span className="truncate">Failed to load balances. {(errorObj as any)?.message || ""}</span>
                <button
                  onClick={() => (activeContext === "member" ? refetchMember() : refetchAdmin())}
                  className="ml-3 inline-flex items-center px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-medium"
                >
                  Retry
                </button>
              </div>
            )}
            <MainStatisticsCard
              stats={(activeContext === "member" ? memberStats : adminStats) as any}
              showActivityCard={false}
              fetching={backgroundFetching}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {componentsLoading ? (
                <>
                  {/* Line Chart Skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="relative">
                      {/* Chart area skeleton */}
                      <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <div className="flex items-end justify-between h-full gap-2">
                          {[80, 120, 60, 140, 90, 110, 70, 130, 100, 85].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end">
                              <Skeleton className="w-full rounded-t mb-2" style={{ height: `${height}px` }} />
                              <Skeleton className="h-3 w-full" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-64 flex flex-col justify-between py-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Skeleton key={i} className="h-3 w-8" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pie Chart Skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Skeleton className="h-6 w-36 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex items-center justify-center">
                      {/* Pie chart skeleton */}
                      <div className="relative">
                        <Skeleton className="h-48 w-48 rounded-full" />
                        <div className="absolute inset-6">
                          <Skeleton className="h-36 w-36 rounded-full" />
                        </div>
                      </div>
                      {/* Legend skeleton */}
                      <div className="ml-8 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <div>
                              <Skeleton className="h-3 w-20 mb-1" />
                              <Skeleton className="h-2 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <LineCharts data={dummyLineData} />
                  <PieCharts data={dummyPieData} />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {componentsLoading ? (
                <>
                  {/* Reminders Skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-3/4 mb-2" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-3 w-3 rounded-full" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advert Carousel Skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <Skeleton className="h-6 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                    <div className="relative">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-64">
                        <div className="flex flex-col items-center justify-center h-full">
                          <Skeleton className="h-16 w-16 rounded-lg mb-4" />
                          <Skeleton className="h-6 w-48 mb-3" />
                          <Skeleton className="h-4 w-64 mb-4" />
                          <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                      </div>
                      {/* Carousel indicators */}
                      <div className="flex justify-center gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-2 w-2 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Reminders />
                  <AdvertCarousel />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
