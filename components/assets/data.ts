import {
  SignUpFormValues,
  LoginFormValues,
  ReportSummary,
  ReportTrend,
  TopUserReport,
  deposit,
  withdrawal,
  PaymentDataProps,
} from "@/types/types";
import { Home, Users, DollarSign, FileText, Settings, LogOut } from "lucide-react";
import {} from "@/types/types";

import { MemberWithActions } from "@/app/admin/peopleManagement/members/page";
import { Column } from "@/types/types";
import { StatementWithActions } from "@/app/admin/records/statement/page";
import React from "react";

export const SignUpInitialValues: SignUpFormValues = {
  name: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export const LoginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

export const Dummy_Memebers_Column: Column<MemberWithActions & { sn: number }>[] = [
  {
    id: "sn",
    label: "S/N",
    minWidth: 60,
    // we already computed sn in the row object, so use it directly
    format: (_v, row) => row.sn,
  },
  { id: "firstName", label: "First Name", minWidth: 140 },
  { id: "middleName", label: "Middle Name", minWidth: 140 },
  { id: "surname", label: "Surname", minWidth: 120 },
  { id: "email", label: "Email", minWidth: 180 },
  {
    id: "status",
    label: "Status",
    minWidth: 120,
    format: (v) => {
      const getStatusStyles = (status: string) => {
        const baseClasses = "inline-block px-4 py-1 rounded-xl font-semibold text-[0.95rem] border";

        switch (status) {
          case "active":
            return `${baseClasses} bg-[#e6f9ed] text-[#166534] border-[#b6f2d7] dark:bg-green-900/40 dark:text-green-200 dark:border-green-700`;
          case "pending":
            return `${baseClasses} bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700`;
          case "rejected":
            return `${baseClasses} bg-[#fdeaea] text-[#991b1b] border-[#f5c2c7] dark:bg-red-900/40 dark:text-red-200 dark:border-red-700`;
          case "inactive":
            return `${baseClasses} bg-[#f3f4f6] text-[#374151] border-[#d1d5db] dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-600`;
          default:
            return `${baseClasses} bg-[#f3f4f6] text-[#374151] border-[#d1d5db] dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-600`;
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status) {
          case "active":
            return "Active";
          case "pending":
            return "Pending";
          case "rejected":
            return "Rejected";
          case "inactive":
            return "Inactive";
          default:
            return status || "Unknown";
        }
      };

      return React.createElement("span", { className: getStatusStyles(v) }, getStatusLabel(v));
    },
  },
  {
    id: "role",
    label: "Role",
    minWidth: 120,
    format: (v) => {
      const getRoleStyles = (role: string) => {
        const baseClasses = "font-semibold text-[0.95rem]";

        switch (role) {
          case "org_admin":
            return `${baseClasses} text-[#ec4899] dark:text-pink-300`;
          case "member":
            return `${baseClasses} text-[#ea580c] dark:text-orange-300`;
          default:
            return `${baseClasses} text-[#374151] dark:text-gray-300`;
        }
      };

      const getRoleLabel = (role: string) => {
        switch (role) {
          case "org_admin":
            return "Org Admin";
          case "member":
            return "Member";
          default:
            return role || "Unknown";
        }
      };

      return React.createElement("span", { className: getRoleStyles(v) }, getRoleLabel(v));
    },
  },
  { id: "ActionButton", label: "Actions", align: "center", minWidth: 120 },
];

export const MemberPaymentsData: Column<PaymentDataProps & { sn: number }>[] = [
  {
    id: "sn",
    label: "S/N",
    minWidth: 60,
    // we already computed sn in the row object, so use it directly
    format: (_v, row) => row.sn,
  },
  {
    id: "memberId",
    label: "Member",
    minWidth: 160,
    // memberId is an object (MemberPayment). Display a friendly string instead of [object Object]
    format: (v) => {
      if (!v) return "";
      if (typeof v === "string") return v; // in case API changes later
      // Prefer full name; fallback to email or _id
      const fullName = [v.firstName, v.surname].filter(Boolean).join(" ");
      return fullName || v.email || v._id || "";
    },
  },
  { id: "amount", label: "Amount", minWidth: 140 },
  {
    id: "type",
    label: "Type",
    minWidth: 160,
    format: (v: string) => {
      if (!v) return "";
      const raw = String(v).toLowerCase();
      // Split on underscore or hyphen
      const parts = raw.split(/[\-_]/).filter(Boolean);
      if (parts.length === 0) return v;

      const categoryRaw = parts[0];
      const actionRaw = parts.slice(1).join(" ") || "";

      const categoryMap: Record<string, string> = {
        savings: "Savings",
        saving: "Savings",
        contribution: "Contributions",
        contributions: "Contributions",
        loan: "Loan",
        investment: "Investment",
        pension: "Pension",
        general: "General",
      };

      const actionMap: Record<string, string> = {
        deposit: "Deposit",
        withdrawal: "Withdrawal",
        withdraw: "Withdrawal",
        repayment: "Repayment",
        disbursement: "Disbursement",
        payment: "Payment",
        transfer: "Transfer",
      };

      const cat = categoryMap[categoryRaw] || categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);
      // If multiple action tokens like "loan_repayment", parts after the first will be joined and mapped individually
      const actionTokens = actionRaw.split(/\s+/).filter(Boolean);
      const mappedAction = actionTokens
        .map((t) => actionMap[t] || t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ")
        .trim();

      const label = mappedAction ? `${cat} (${mappedAction})` : cat;

      const isDeposit = /deposit/.test(raw);
      const isWithdrawal = /withdraw/.test(raw) || /withdrawal/.test(raw);
      const colorClass = isDeposit
        ? "text-emerald-600 dark:text-emerald-400"
        : isWithdrawal
        ? "text-rose-600 dark:text-rose-400"
        : "text-slate-600 dark:text-slate-300";

      return React.createElement("span", { className: `font-medium ${colorClass}` }, label);
    },
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    format: (v) => {
      const base =
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ring-1 ring-inset";
      const cls =
        v === "pending"
          ? "bg-amber-50 text-amber-700 ring-amber-600/20"
          : v === "active"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : v === "rejected"
          ? "bg-rose-50 text-rose-700 ring-rose-600/20"
          : "bg-gray-50 text-gray-600 ring-gray-500/20";
      return React.createElement("span", { className: `${base} ${cls}` }, v);
    },
  },
  { id: "description", label: "Description", minWidth: 180 },
  {
    id: "expectedProcessingDays",
    label: "Processing Days",
    minWidth: 180,
    format: (v) => (v === null || v === undefined || v === "" ? "-" : v),
  },
  {
    id: "createdAt",
    label: "Date",
    minWidth: 120,
    format: (v) => new Date(v).toLocaleDateString(),
  },
  {
    id: "updatedAt",
    label: "Last Updated",
    minWidth: 120,
    format: (v) => new Date(v).toLocaleDateString(),
  },
  { id: "ActionButton", label: "Actions", align: "center", minWidth: 120 },
];

export const dummyStatements: StatementWithActions[] = [
  {
    id: "1",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Salary Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "2",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "ATM Withdrawal",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "3",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Fees Payment",
    type: "debit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "4",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Pension Withdrawal",
    type: "credit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "5",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Ajo Contribution",
    type: "debit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "6",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Laptop Purchase",
    type: "credit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "7",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Investment Payment",
    type: "debit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "8",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Union Contribution",
    type: "credit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "9",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Ahlaja Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "10",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Funds Withdrawal",
    type: "credit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "11",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Sharp Tv Purchase",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "12",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Aina Fees",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "13",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Rent Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "14",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "ATShopM Withdrawal",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "15",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Ajo Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "16",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Eforiro Purchase",
    type: "credit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "17",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Ahoe Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "18",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "Amazon Payment",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "19",
    name: "Amdnuel Essien",
    date: "2025-08-01T10:00:00Z",
    description: "Sandals Payment",
    type: "debit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "20",
    name: "Amdnuel Essien",
    date: "2025-08-02T12:00:00Z",
    description: "ATM Card Bills",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "21",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Shelve Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "22",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Lawma Payment",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "23",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Alfa Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "24",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Business Summit",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "25",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Nike Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "26",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Twenty Six",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "27",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Aloe Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "28",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Mineral Withdrawal",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "29",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Fine Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "30",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Plenary Withdrawal",
    type: "debit",
    amount: 1000,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  {
    id: "31",
    name: "Folorunsho Abebi",
    date: "2025-08-01T10:00:00Z",
    description: "Scholars Payment",
    type: "credit",
    amount: 5000,
    balance: 15000,
    ActionButton: "ActionButton",
  },
  {
    id: "32",
    name: "Folorunsho Abebi",
    date: "2025-08-02T12:00:00Z",
    description: "Film Withdrawal",
    type: "debit",
    amount: 100,
    balance: 14000,
    ActionButton: "ActionButton",
  },
  // ...add more records
];

export const Dummy_Statements_Column: Column<StatementWithActions>[] = [
  { id: "date", label: "Date", minWidth: 120, format: (v) => new Date(v).toLocaleDateString() },
  { id: "description", label: "Description", minWidth: 180 },
  { id: "type", label: "Type", minWidth: 80 },
  { id: "amount", label: "Amount", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
  { id: "balance", label: "Balance", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
  { id: "ActionButton", label: "Actions", align: "center", minWidth: 120 },
];

export const reportSummaries: ReportSummary[] = [
  { category: "transactions", total: 120000, count: 540, growth: 8 },
  { category: "loans", total: 80000, count: 120, growth: 5 },
  { category: "investments", total: 60000, count: 80, growth: 12 },
  { category: "withdrawals", total: 40000, count: 300, growth: -2 },
  { category: "savings", total: 90000, count: 200, growth: 10 },
];

// 5 categories × 6 days = 30 records
export const reportTrends: ReportTrend[] = [
  {
    category: "transactions",
    data: [
      { date: "2025-08-01", value: 10000 },
      { date: "2025-08-02", value: 12000 },
      { date: "2025-08-03", value: 9500 },
      { date: "2025-08-04", value: 14000 },
      { date: "2025-08-05", value: 11000 },
      { date: "2025-08-06", value: 12500 },
    ],
  },
  {
    category: "loans",
    data: [
      { date: "2025-08-01", value: 6000 },
      { date: "2025-08-02", value: 8500 },
      { date: "2025-08-03", value: 7200 },
      { date: "2025-08-04", value: 9000 },
      { date: "2025-08-05", value: 7800 },
      { date: "2025-08-06", value: 8200 },
    ],
  },
  {
    category: "investments",
    data: [
      { date: "2025-08-01", value: 7000 },
      { date: "2025-08-02", value: 7600 },
      { date: "2025-08-03", value: 6800 },
      { date: "2025-08-04", value: 8900 },
      { date: "2025-08-05", value: 7500 },
      { date: "2025-08-06", value: 8000 },
    ],
  },
  {
    category: "withdrawals",
    data: [
      { date: "2025-08-01", value: 4000 },
      { date: "2025-08-02", value: 3500 },
      { date: "2025-08-03", value: 4200 },
      { date: "2025-08-04", value: 3800 },
      { date: "2025-08-05", value: 4400 },
      { date: "2025-08-06", value: 3900 },
    ],
  },
  {
    category: "savings",
    data: [
      { date: "2025-08-01", value: 10000 },
      { date: "2025-08-02", value: 11000 },
      { date: "2025-08-03", value: 10800 },
      { date: "2025-08-04", value: 11500 },
      { date: "2025-08-05", value: 12000 },
      { date: "2025-08-06", value: 11800 },
    ],
  },
];

// 10 users across categories
export const topUsers: TopUserReport[] = [
  { id: "1", userId: "u1", name: "John Doe", amount: 20000, category: "investments", date: "2025-08-01" },
  { id: "2", userId: "u2", name: "Jane Smith", amount: 18000, category: "loans", date: "2025-08-01" },
  { id: "3", userId: "u3", name: "Samuel Green", amount: 15000, category: "transactions", date: "2025-08-02" },
  { id: "4", userId: "u4", name: "Grace Lee", amount: 17000, category: "savings", date: "2025-08-02" },
  { id: "5", userId: "u5", name: "Michael Brown", amount: 14500, category: "withdrawals", date: "2025-08-03" },
  { id: "6", userId: "u6", name: "Sophia Johnson", amount: 21000, category: "investments", date: "2025-08-03" },
  { id: "7", userId: "u7", name: "David Wilson", amount: 16000, category: "loans", date: "2025-08-04" },
  { id: "8", userId: "u8", name: "Emily Davis", amount: 15500, category: "transactions", date: "2025-08-04" },
  { id: "9", userId: "u9", name: "Daniel Garcia", amount: 19000, category: "savings", date: "2025-08-05" },
  { id: "10", userId: "u10", name: "Olivia Martinez", amount: 13500, category: "withdrawals", date: "2025-08-05" },
];

export const dummyLineData = [
  { date: "Jan", value: 400 },
  { date: "Feb", value: 300 },
  { date: "Mar", value: 500 },
  { date: "Apr", value: 280 },
  { date: "May", value: 590 },
  { date: "Jun", value: 390 },
  { date: "Jul", value: 490 },
  { date: "Aug", value: 600 },
  { date: "Sep", value: 510 },
  { date: "Oct", value: 420 },
  { date: "Nov", value: 580 },
  { date: "Dec", value: 450 },
];

export const dummyPieData = [
  { label: "Category A", value: 35 },
  { label: "Category B", value: 25 },
  { label: "Category C", value: 20 },
  { label: "Category D", value: 15 },
  { label: "Category E", value: 5 },
];
export const depositInitialValues: deposit = { amount: "", type: "", description: "", payment_receipt: null };

export const withdrawalInitialValues: withdrawal = { amount: "", type: "", description: "" };

export const paymentApproveOrRejectIniValues = {
  action: "",
  rejectionReason: "",
};

export const AssignRoleInitialValues = {
  userId: "",
  organizationId: "",
  role: "",
};

export const SettingsInitialValues = {
  savingsMaxDays: 5,
  contributionMaxDays: 90,
};
