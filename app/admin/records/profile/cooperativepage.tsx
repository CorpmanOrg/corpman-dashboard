"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getCooperativeSummaryFn } from "@/utils/ApiFactory/admin";
import OrganizationOverviewCard from "@/components/CooperativeProfile/OrganizationOverviewCard";
import MemberStatsCard from "@/components/CooperativeProfile/MemberStatsCard";
import FinancialSummaryCard from "@/components/CooperativeProfile/FinancialSummaryCard";
import SettingsCard from "@/components/CooperativeProfile/SettingsCard";
import { CooperativeSkeleton } from "@/components/CooperativeProfile/Skeletons";

export default function CooperativeProfile() {
  const { currentOrgId } = useAuth();
  const { toast } = useToast();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["cooperative-summary", currentOrgId],
    queryFn: () => getCooperativeSummaryFn(currentOrgId!),
    enabled: !!currentOrgId,
    staleTime: 60_000,
  });

  const org = data?.organization || data || null;

  if (isLoading) {
    return <CooperativeSkeleton />;
  }

  if (isError) {
    const msg = (error as any)?.message || "Failed to load cooperative summary";
    toast({ title: "Error", description: msg });
    return (
      <div className="mt-2 p-6 bg-card rounded-lg shadow-sm">
        <div className="text-sm text-rose-600">{msg}</div>
        <div className="mt-3">
          <button onClick={() => refetch()} className="px-3 py-1 bg-blue-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <OrganizationOverviewCard org={org} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <MemberStatsCard stats={org?.memberStats || { total: org?.memberCount ?? 0 }} />
        </div>

        <div className="md:col-span-1">
          <FinancialSummaryCard balances={org?.balances || {}} />
        </div>

        <div className="md:col-span-1">
          <SettingsCard withdrawalSettings={org?.withdrawalSettings || {}} loanSettings={org?.loanSettings || {}} />
        </div>
      </div>
    </div>
  );
}
