"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getAdminBalanceFn } from "@/utils/ApiFactory/admin";
import { getMembersBalanceFn } from "@/utils/ApiFactory/member";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header/Header";
import { SideNav } from "@/layout/SideNav";
import MainStatisticsCard from "@/components/Statistics/MainStatisticsCard";
import { LineCharts } from "@/components//Charts/LineCharts";
import { PieCharts } from "@/components//Charts/PieCharts";
import { Reminders } from "@/components//Reminders/Reminders";
import { AdvertCarousel } from "@/components//Carousel/AdvertCarousel";
import { Users, CreditCard, PiggyBank, GitBranchPlus } from "lucide-react";
import { dummyLineData, dummyPieData } from "@/components/assets/data";

export default function Dashboard() {
  const { currentRole, currentOrgId } = useAuth();

  const {
    data: adminData,
    isLoading: adminLoading,
    isFetching: adminFetching,
    error: adminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ["admin-balance", currentOrgId],
    queryFn: () => getAdminBalanceFn(currentOrgId!),
    enabled: currentRole === "org_admin" && !!currentOrgId,
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
    enabled: currentRole === "member",
    staleTime: 60_000,
    select: (raw) => (Array.isArray(raw) && raw.length > 0 ? raw[0] : null),
  });

  const activeData = currentRole === "member" ? memberData : adminData;
  const initialLoading = currentRole === "member" ? memberLoading && !memberData : adminLoading && !adminData;
  const backgroundFetching = currentRole === "member" ? memberFetching && !!memberData : adminFetching && !!adminData;

  const memberStats = [
    { title: "Savings", value: activeData?.balances?.savings ?? 0, icon: <PiggyBank />, loading: initialLoading },
    {
      title: "Contributions",
      value: activeData?.balances?.contribution ?? 0,
      icon: <GitBranchPlus />,
      loading: initialLoading,
    },
    { title: "Loans", value: activeData?.balances?.loans ?? 0, icon: <CreditCard />, loading: initialLoading },
  ];

  const adminStats = [
    { title: "Members", value: activeData?.totalMembers ?? 0, icon: <Users />, loading: initialLoading },
    {
      title: "Savings",
      value: activeData?.totalBalances?.totalSavings ?? 0,
      icon: <PiggyBank />,
      loading: initialLoading,
    },
    {
      title: "Contributions",
      value: activeData?.totalBalances?.totalContributions ?? 0,
      icon: <GitBranchPlus />,
      loading: initialLoading,
    },
    {
      title: "Loans",
      value: activeData?.totalBalances?.totalLoansIssued ?? 0,
      icon: <CreditCard />,
      loading: initialLoading,
    },
  ];

  const errorObj = currentRole === "member" ? memberError : adminError;

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("Balance snapshot", { role: currentRole, activeData, initialLoading, backgroundFetching });
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
          <div className="flex-1 overflow-y-auto">
            {errorObj && !initialLoading && (
              <div className="mx-6 mb-2 rounded border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs px-3 py-2 flex items-center justify-between">
                <span className="truncate">Failed to load balances. {(errorObj as any)?.message || ""}</span>
                <button
                  onClick={() => (currentRole === "member" ? refetchMember() : refetchAdmin())}
                  className="ml-3 inline-flex items-center px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-medium"
                >
                  Retry
                </button>
              </div>
            )}
            <MainStatisticsCard
              stats={(currentRole === "member" ? memberStats : adminStats) as any}
              showActivityCard={!initialLoading}
              fetching={backgroundFetching}
            />

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
