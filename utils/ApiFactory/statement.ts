import { Statement } from "@/types/types";
import { dummyStatements } from "@/components/assets/data";

export type StatementQuery = {
  page?: number;
  pageSize?: number;
  type?: "credit" | "debit";
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
};

export async function fetchStatements(query: StatementQuery) {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    // Filter dummy data
    let filtered = dummyStatements;
    if (query.type) filtered = filtered.filter((s) => s.type === query.type);
    if (typeof query.minAmount === "number") {
      filtered = filtered.filter((s) => typeof s.amount === "number" && s.amount >= query.minAmount!);
    }
    if (typeof query.maxAmount === "number") {
      filtered = filtered.filter((s) => typeof s.amount === "number" && s.amount <= query.maxAmount!);
    }
    if (query.startDate) filtered = filtered.filter((s) => new Date(s.date) >= new Date(query.startDate!));
    if (query.endDate) filtered = filtered.filter((s) => new Date(s.date) <= new Date(query.endDate!));
    const totalRecords = filtered.length;
    const pageSize = query.pageSize || 10;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const page = query.page || 0;
    const start = page * pageSize;
    const data = filtered.slice(start, start + pageSize);
    return {
      currentPage: page,
      data,
      totalPages,
      totalRecords,
    };
  }
  // Real API call
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => v && params.append(k, String(v)));
  const res = await fetch(`/api/records/statement?${params}`);
  if (!res.ok) {
    // fallback to mock
    return {
      currentPage: 0,
      data: [],
      totalPages: 1,
      totalRecords: 0,
    };
  }
  const text = await res.text();
  if (!text) {
    return {
      currentPage: 0,
      data: [],
      totalPages: 1,
      totalRecords: 0,
    };
  }
  return JSON.parse(text);
}

// Filtering transactions/statements by date
function filterStatementsByDate(statements: Statement[], startDate?: string, endDate?: string) {
  return statements.filter(
    (tx) =>
      (!startDate || new Date(tx.date) >= new Date(startDate)) && (!endDate || new Date(tx.date) <= new Date(endDate))
  );
}
