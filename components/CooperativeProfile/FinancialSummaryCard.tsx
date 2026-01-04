"use client";
import React from "react";

function fmt(n: number) {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(n);
  } catch {
    return String(n);
  }
}

export default function FinancialSummaryCard({ balances }: { balances: any }) {
  const savings = balances?.totalSavings ?? 0;
  const contributions = balances?.totalContributions ?? 0;
  const loans = balances?.totalLoansIssued ?? 0;
  const interest = balances?.interestEarned ?? 0;
  const lastUpdated = balances?.lastUpdated ?? null;

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h4 className="text-md font-semibold mb-3">Financial Summary</h4>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded">
          <div className="text-sm text-muted-foreground">Contributions</div>
          <div className="text-2xl font-semibold mt-1">{fmt(contributions)}</div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-2">Updated {new Date(lastUpdated).toLocaleString()}</div>
          )}
        </div>

        <div className="w-full md:w-64 flex flex-col gap-3">
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <div className="text-xs text-muted-foreground">Savings</div>
            <div className="font-semibold">{fmt(savings)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <div className="text-xs text-muted-foreground">Loans Issued</div>
            <div className="font-semibold">{fmt(loans)}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <div className="text-xs text-muted-foreground">Interest Earned</div>
            <div className="font-semibold">{fmt(interest)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
