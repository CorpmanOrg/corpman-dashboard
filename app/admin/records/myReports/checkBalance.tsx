"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminBalanceFn } from "@/utils/ApiFactory/admin";
import { getMembersBalanceFn } from "@/utils/ApiFactory/member";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, PiggyBank, GitBranchPlus, CreditCard, Shield, Loader2 } from "lucide-react";

// Helper to normalize various backend balance response shapes
interface BalanceRecord {
  organizationId?: string;
  balances?: {
    savings?: number;
    contribution?: number;
    contributions?: number;
    loanBalance?: number;
    loans?: number;
    [k: string]: any;
  };
  [k: string]: any;
}

const pickFirst = (val: any): BalanceRecord | null => {
  if (!val) return null;
  if (Array.isArray(val)) return val.length ? (val[0] as BalanceRecord) : null;
  // if it's an object that directly contains balances
  if (val && typeof val === "object" && "balances" in val) return val as BalanceRecord;
  return null;
};

const formatMoney = (n: number | undefined) =>
  (typeof n === "number" ? n : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CheckBalance: React.FC = () => {
  const { currentRole, currentOrgId } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: adminRaw,
    isLoading: adminLoading,
    isFetching: adminFetching,
    error: adminError,
    refetch: refetchAdmin,
  } = useQuery({
    queryKey: ["admin-balance"],
    queryFn: () => getAdminBalanceFn(currentOrgId!),
    enabled: currentRole === "org_admin",
    staleTime: 30_000,
  });

  const {
    data: memberRaw,
    isLoading: memberLoading,
    isFetching: memberFetching,
    error: memberError,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ["member-balance"],
    queryFn: () => getMembersBalanceFn(),
    enabled: currentRole === "member",
    staleTime: 30_000,
  });

  const active = currentRole === "member" ? pickFirst(memberRaw) : pickFirst(adminRaw);
  const loading = currentRole === "member" ? memberLoading : adminLoading;
  const fetching = currentRole === "member" ? memberFetching : adminFetching; // includes background refetch
  const errorObj = currentRole === "member" ? memberError : adminError;

  const balances = useMemo(() => {
    const b = active?.balances || {};
    return {
      savings: b.savings ?? 0,
      contribution: b.contribution ?? b.contributions ?? 0,
      loans: b.loanBalance ?? b.loans ?? 0,
    };
  }, [active]);

  const onManualRefresh = () => {
    if (currentRole === "member") refetchMember();
    else refetchAdmin();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card className="shadow-md border-t-4 border-emerald-500 dark:border-emerald-600">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">{currentRole === "member" ? "Member" : "Organization"} Balance</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {loading && !active && "Fetching balance..."}
            {!loading && !errorObj && active && "Latest available balance snapshot."}
            {errorObj && "We could not load your balance. You can retry."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Error State */}
          {errorObj && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300">
              {(errorObj as any)?.message || "Unknown error"}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && !active && !errorObj && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-md border bg-gray-100 dark:bg-gray-800 h-24 flex flex-col items-center justify-center gap-2"
                >
                  <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-700" />
                  <div className="h-5 w-24 rounded bg-gray-300 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          )}

          {/* Data State */}
          {active && !loading && !errorObj && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-md border p-4 bg-white dark:bg-gray-900 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <PiggyBank className="h-4 w-4 text-emerald-600" /> Savings
                </div>
                <div className="text-xl font-semibold tracking-tight">₦{formatMoney(balances.savings)}</div>
              </div>
              <div className="rounded-md border p-4 bg-white dark:bg-gray-900 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <GitBranchPlus className="h-4 w-4 text-emerald-600" /> Contributions
                </div>
                <div className="text-xl font-semibold tracking-tight">₦{formatMoney(balances.contribution)}</div>
              </div>
              <div className="rounded-md border p-4 bg-white dark:bg-gray-900 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <CreditCard className="h-4 w-4 text-emerald-600" /> Loans
                </div>
                <div className="text-xl font-semibold tracking-tight">₦{formatMoney(balances.loans)}</div>
              </div>
            </div>
          )}

          {/* Empty (no data) State after load (rare) */}
          {!loading && !errorObj && !active && (
            <div className="text-sm text-gray-500 dark:text-gray-400">No balance data available yet.</div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onManualRefresh} disabled={fetching}>
              {fetching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Refreshing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" /> Refresh
                </span>
              )}
            </Button>
            {fetching && !loading && <span className="text-xs text-gray-500">Updating…</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckBalance;
