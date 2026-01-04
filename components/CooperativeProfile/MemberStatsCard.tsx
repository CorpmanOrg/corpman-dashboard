"use client";
import React from "react";

type Stats = any;

function StatChip({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="flex-1 bg-card p-4 rounded-md shadow-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

export default function MemberStatsCard({ stats }: { stats: Stats }) {
  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const pending = stats?.pending ?? 0;
  const rejected = stats?.rejected ?? 0;

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h4 className="text-md font-semibold mb-3">Member Statistics</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatChip label="Total" value={total} />
        <StatChip label="Active" value={active} />
        <StatChip label="Pending" value={pending} />
        <StatChip label="Rejected" value={rejected} />
      </div>
    </div>
  );
}
