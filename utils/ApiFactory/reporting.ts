import { reportSummaries, reportTrends, topUsers } from "@/components/assets/data";

export async function fetchReportSummary() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return reportSummaries;
  }
  // Real API call
  const res = await fetch("/api/records/reporting/summary");
  return res.json();
}

export async function fetchReportTrends() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return reportTrends;
  }
  const res = await fetch("/api/records/reporting/trends");
  return res.json();
}

export async function fetchTopUsers() {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return topUsers;
  }
  const res = await fetch("/api/records/reporting/top-users");
  return res.json();
}
