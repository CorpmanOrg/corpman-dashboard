"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMembersLoanEligibilityFn } from "@/utils/ApiFactory/member";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Info, Loader2, RefreshCcw } from "lucide-react";

interface EligibilityPayload {
  eligibility?: {
    contributionBalance?: number;
    currentLoanBalance?: number;
    maxLoanAmount?: number;
    availableLoanAmount?: number;
    contributionMonths?: number;
    minimumMonthsRequired?: number;
    hasRequiredContributionHistory?: boolean;
    isEligible?: boolean;
    [k: string]: any;
  };
  [k: string]: any;
}

const formatMoney = (n: number | undefined) =>
  (typeof n === "number" ? n : 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const LoanEligibility: React.FC = () => {
  const { activeContext } = useAuth();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<EligibilityPayload>({
    queryKey: ["member-loan-eligibility"],
    queryFn: () => getMembersLoanEligibilityFn(),
    enabled: activeContext === "member",
    staleTime: 60_000,
    retry: 1,
  });

  const e = data?.eligibility;
  const eligible = !!e?.isEligible;

  const primaryMessage = eligible
    ? "You are eligible for a loan."
    : isLoading
    ? "Checking your eligibility..."
    : "You are not eligible for a loan yet.";

  let reason: string | null = null;
  if (!eligible && e) {
    if (typeof e.contributionMonths === "number" && typeof e.minimumMonthsRequired === "number") {
      if (e.contributionMonths < e.minimumMonthsRequired) {
        reason = `You have only contributed for ${e.contributionMonths} month${
          e.contributionMonths === 1 ? "" : "s"
        }. You need at least ${e.minimumMonthsRequired} months.`;
      }
    }
    if (!reason && e.currentLoanBalance && e.currentLoanBalance > 0) {
      reason = "You currently have an outstanding loan that must be cleared first.";
    }
  }

  const maxLoanDisplay = eligible && e?.maxLoanAmount ? `Maximum loan amount: ₦${formatMoney(e.maxLoanAmount)}` : null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card className="shadow-md border-t-4 border-emerald-500 dark:border-emerald-600">
        <CardHeader className="pb-3 space-y-2">
          <CardTitle className="text-lg flex items-center gap-2">
            {eligible ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : isError ? (
              <AlertCircle className="h-5 w-5 text-rose-600" />
            ) : (
              <Info className="h-5 w-5 text-amber-500" />
            )}
            Loan Eligibility
          </CardTitle>
          <CardDescription className="text-sm">
            {primaryMessage}
            {maxLoanDisplay && (
              <span className="block mt-1 font-medium text-emerald-600 dark:text-emerald-400">{maxLoanDisplay}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading && (
            <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-md border bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300">
              {(error as any)?.message || "Failed to fetch eligibility."}
            </div>
          )}

          {!isLoading && !isError && e && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoTile label="Contribution Balance" value={`₦${formatMoney(e.contributionBalance)}`} />
              <InfoTile label="Current Loan Balance" value={`₦${formatMoney(e.currentLoanBalance)}`} />
              <InfoTile label="Max Loan (2x Rule)" value={`₦${formatMoney(e.maxLoanAmount)}`} />
              <InfoTile label="Available Loan Amount" value={`₦${formatMoney(e.availableLoanAmount)}`} />
              <InfoTile label="Months Contributed" value={String(e.contributionMonths ?? 0)} />
              <InfoTile label="Min Months Required" value={String(e.minimumMonthsRequired ?? 0)} />
            </div>
          )}

          {!eligible && !isLoading && !isError && reason && (
            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
              {reason}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Refreshing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4" /> Refresh
                </span>
              )}
            </Button>
            {isFetching && !isLoading && <span className="text-xs text-gray-500">Updating…</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface InfoTileProps {
  label: string;
  value: string | number | null | undefined;
}
const InfoTile: React.FC<InfoTileProps> = ({ label, value }) => (
  <div className="rounded-md border p-4 bg-white dark:bg-gray-900 flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-all">{value}</span>
  </div>
);

export default LoanEligibility;
