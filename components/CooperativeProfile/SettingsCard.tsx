"use client";
import React from "react";

export default function SettingsCard({
  withdrawalSettings,
  loanSettings,
}: {
  withdrawalSettings: any;
  loanSettings: any;
}) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h4 className="text-md font-semibold mb-3">Settings & Rules</h4>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div>
          <div className="text-xs text-gray-500">Withdrawal</div>
          <div className="mt-1">
            Savings window: <strong>{withdrawalSettings?.savingsMaxDays ?? "—"} days</strong>
          </div>
          <div>
            Contributions window: <strong>{withdrawalSettings?.contributionMaxDays ?? "—"} days</strong>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">Loan Rules</div>
          <div className="mt-1">
            Multiplier: <strong>{loanSettings?.contributionMultiplier ?? "—"}×</strong>
          </div>
          <div>
            Interest: <strong>{loanSettings?.interestRate ?? "—"}%</strong>
          </div>
          <div>
            Max duration: <strong>{loanSettings?.maxLoanDurationMonths ?? "—"} months</strong>
          </div>
          <div>
            Min contribution months: <strong>{loanSettings?.minimumContributionMonths ?? "—"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
