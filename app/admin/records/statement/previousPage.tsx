"use client";
import React, { useState, useEffect } from "react";
import { fetchStatements } from "@/utils/ApiFactory/statement";
import {
  Statement,
  TableActionOption,
  ToastSeverity,
  ToastState,
  StatementWithActions,
  TransactionTypeFilter,
  TransactionHistoryProps,
} from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import type { TransactionHistoryResponse } from "@/types/types";
import { getTransactionHistoryFn } from "@/utils/ApiFactory/admin";
import { useAuth } from "@/context/AuthContext";
import { TransactionHistoryColumn } from "@/components/assets/data";
import { StatCard } from "@/components/Statistics/StatCard";
import { StatementFilterBar, StatementFilterProps } from "@/components/Filters/StatementFilterBar";
import BaseTable from "@/components/BaseTable";
import { downloadCSV } from "@/components/Download/CSV/csv";
import { downloadPDF } from "@/components/Download/PDF/pdf";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, FileText, FileSymlink, PiggyBank, GitBranchPlus, CreditCard } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Toastbar from "@/components/Toastbar";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
// Dummy_Statements_Column removed; no replacement import required here.

// Transaction type filter type
// type TransactionTypeFilter = "savings" | "contributions" | "loans" | "all";
type TransactionRow = TransactionHistoryProps & { id: string; ActionButton: string; sn: number };

const statementActionOptions: TableActionOption[] = [
  { key: "view", label: "View Statement" },
  { key: "approve", label: "Approve" },
  { key: "reject", label: "Reject" },
];

export default function StatementPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<StatementFilterProps["filters"]>({});
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionTypeFilter>("all");

  const { currentOrgId } = useAuth();

  // Fetch transactions via React Query using page and rowsPerPage
  const {
    data: txResp,
    isLoading: txLoading,
    isError,
    isSuccess,
    error,
    refetch,
  } = useQuery<TransactionHistoryResponse, Error>({
    queryKey: ["transaction-history", currentOrgId, page, rowsPerPage, transactionTypeFilter],
    queryFn: () =>
      getTransactionHistoryFn({
        orgId: currentOrgId || "",
        page,
        limit: rowsPerPage,
        type: transactionTypeFilter === "all" ? "" : transactionTypeFilter,
      }),
    enabled: !!currentOrgId,
  });

  const transactionRows: TransactionRow[] = (txResp?.transactions || []).map((tx: any, idx: number) => ({
    id: String(idx + 1),
    ActionButton: "actions",
    sn: idx + 1,
    ...tx,
  }));

  const totalCount = txResp?.total ?? transactionRows.length;

  const [data, setData] = useState<{
    data: any[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
  }>({ data: [], totalPages: 0, totalRecords: 0, currentPage: 0 });

  const { modal, openModal, closeModal } = useModal();

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) => {
    setToast({ open: true, severity, message });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Map API transactions -> table rows compatible with TransactionHistoryColumn
  React.useEffect(() => {
    if (!txResp?.transactions) {
      setData({ data: [], totalPages: 0, totalRecords: 0, currentPage: page });
      return;
    }

    const mapped = (txResp.transactions || []).map((tx: any, idx: number) => {
      // parse category and action
      const raw = String(tx.type || "").toLowerCase();
      const parts = raw.split(/[_-\s]/).filter(Boolean);
      const categoryRaw = parts[0] || "general";
      const actionRaw = parts.slice(1).join(" ") || "";

      // category normalization
      const categoryMap: Record<string, string> = {
        savings: "savings",
        contribution: "contribution",
        loan: "loan",
        investment: "investment",
        pension: "pension",
        general: "general",
      };

      const actionMap: Record<string, string> = {
        deposit: "deposit",
        withdrawal: "withdrawal",
        repayment: "repayment",
        disbursement: "disbursement",
        payment: "payment",
        transfer: "transfer",
      };

      const category = categoryMap[categoryRaw] || categoryRaw;
      const actionTokens = actionRaw.split(/\s+/).filter(Boolean);
      const action = actionTokens.map((t) => actionMap[t] || t).join(" ");

      // determine credit/debit per your rule: deposits = credit, withdrawals = debit
      const type = /withdrawal/i.test(raw)
        ? "debit"
        : /deposit/i.test(raw)
        ? "credit"
        : /repayment/i.test(raw)
        ? "debit"
        : "credit";

      // compute delta from balanceImpact if available
      const delta = Array.isArray(tx.balanceImpact)
        ? tx.balanceImpact.reduce((acc: number, b: any) => acc + (Number(b.change) || 0), 0)
        : 0;

      return {
        _id: tx._id,
        // sequential id (simple 1..n) as requested
        id: String(idx + 1),
        sn: idx + 1,
        member: tx.member,
        name: tx.member?.name || tx.member?.email || "-",
        amount: tx.amount,
        principalAmount: tx.principalAmount || 0,
        interestAmount: tx.interestAmount || 0,
        type: type,
        transactionType: category,
        status: tx.status,
        balance: delta,
        description: tx.description,
        createdAt: tx.createdAt,
        // keep legacy `date` field for other UI pieces that expect it
        date: tx.createdAt,
        // include updatedAt if available
        updatedAt: tx.updatedAt || null,
        ActionButton: "actions",
        rawType: tx.type,
        apiRaw: tx,
      };
    });

    setData({
      data: mapped,
      totalPages: Math.ceil((txResp.total || 0) / (txResp.limit || rowsPerPage)),
      totalRecords: txResp.total || 0,
      currentPage: (txResp.page || 1) - 1,
    });
  }, [txResp, page, rowsPerPage]);

  // show success toast when transactions are fetched
  useEffect(() => {
    if (isSuccess) showToast("success", "Transaction history fetched ✅");
  }, [isSuccess, transactionTypeFilter, page, rowsPerPage]);

  // Filter-aware statistics computed from mapped data
  const totalCredit = data.data.filter((s) => s.type === "credit").reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalDebit = data.data.filter((s) => s.type === "debit").reduce((acc, s) => acc + (s.amount || 0), 0);
  const balance = totalCredit - totalDebit;

  // filteredData used by the transaction type filter summary
  const filteredData =
    transactionTypeFilter === "all" ? data.data : data.data.filter((d) => d.transactionType === transactionTypeFilter);

  // Transaction type filter options with counts derived from mapped data
  const TRANSACTION_TYPE_OPTIONS: TransactionTypeFilter[] = ["all", "savings", "contribution", "loan"];
  const transactionTypeCounts = {
    all: txResp?.total || 0,
    savings: (txResp?.transactions || []).filter((t: any) =>
      String(t.type || "")
        .toLowerCase()
        .startsWith("savings")
    ).length,
    contribution: (txResp?.transactions || []).filter((t: any) =>
      String(t.type || "")
        .toLowerCase()
        .startsWith("contribution")
    ).length,
    loan: (txResp?.transactions || []).filter((t: any) =>
      String(t.type || "")
        .toLowerCase()
        .startsWith("loan")
    ).length,
  };

  const renderTransactionTypeFilter = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Filter by Transaction Type</h3>
      <div className="flex flex-wrap gap-3">
        {TRANSACTION_TYPE_OPTIONS.map((opt) => {
          const active = transactionTypeFilter === opt;
          const count = transactionTypeCounts[opt];
          const getIcon = () => {
            switch (opt) {
              case "savings":
                return <PiggyBank className="h-4 w-4" />;
              case "contribution":
                return <GitBranchPlus className="h-4 w-4" />;
              case "loan":
                return <CreditCard className="h-4 w-4" />;
              default:
                return <FileText className="h-4 w-4" />;
            }
          };

          return (
            <button
              key={opt}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
                active
                  ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/25 scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600"
              }`}
              onClick={() => setTransactionTypeFilter(opt)}
            >
              {getIcon()}
              <span className="capitalize">{opt}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  active ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {transactionTypeFilter !== "all" && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-green-600 dark:text-green-400">{filteredData.length}</span>{" "}
          {transactionTypeFilter} transactions
        </p>
      )}
    </div>
  );

  // Return per-row allowed actions (used by BaseTable actionOptions prop)
  const allowedActionsForRow = (row: any) => {
    const base: TableActionOption[] = [{ key: "view", label: "View" }];
    if (row?.status === "pending") {
      base.push({ key: "approve", label: "Approve" });
      base.push({ key: "reject", label: "Reject" });
    }
    return base;
  };

  const handleActionClick = (action: TableActionOption, columnId: string, row: any) => {
    switch (action.key) {
      case "view":
        openModal("details", {
          title: "Statement Details",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="border-gray-100 border-r-2 space-y-4">
                <p>
                  <strong>Member:</strong> {row.member.name}
                </p>
                <p className="capitalize">
                  <strong>Transaction type:</strong> {row.type.replace(/_/g, " ")}
                </p>
                <p>
                  <strong>Transaction Date:</strong> {new Date(row.date).toLocaleDateString()}
                </p>
              </div>
              <div className="px-4 space-y-4">
                <p>
                  <strong>Amount:</strong> ₦{row.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {row.status}
                </p>
              </div>
            </div>
          ),
        });
        break;
      case "approve":
        openModal("confirm", {
          message: `Approve statement for ${row.description}?`,
          onConfirm: () => {
            showToast("success", "Statement approved!");
            closeModal();
          },
        });
        break;
      case "reject":
        openModal("confirm", {
          message: `Reject statement for ${row.description}?`,
          onConfirm: () => {
            showToast("error", "Statement rejected!");
            closeModal();
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <ConfirmModal
        open={modal.type === "confirm"}
        onClose={closeModal}
        onConfirm={modal.data?.onConfirm}
        message={modal.data?.message || ""}
      />
      <DetailsModal open={modal.type === "details"} onClose={closeModal} title={modal.data?.title}>
        {modal.data?.content}
      </DetailsModal>
      {txLoading && (
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading transactions...</div>
      )}
      {/* Transaction Type Filter */}
      {txLoading ? (
        <div className="mb-6">
          <Skeleton className="h-7 w-52 mb-3" />
          <div className="flex flex-wrap gap-3">
            {[
              { width: "w-36", label: "All Transactions" },
              { width: "w-28", label: "Savings" },
              { width: "w-32", label: "Contributions" },
              { width: "w-24", label: "Loans" },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.width} h-11 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden relative`}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 -translate-x-full animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="p-2.5 h-full flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-3.5 w-full" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Showing</span>
            <Skeleton className="h-4 w-6 inline-block" />
            <Skeleton className="h-4 w-20 inline-block" />
            <span className="text-sm text-gray-600 dark:text-gray-400">transactions</span>
          </div>
        </div>
      ) : (
        renderTransactionTypeFilter()
      )}

      {/* Filter-aware Statistics */}
      {txLoading ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {transactionTypeFilter === "all"
                ? "Overall"
                : `${transactionTypeFilter.charAt(0).toUpperCase() + transactionTypeFilter.slice(1)}`}{" "}
              Statement Summary
            </h3>
            {transactionTypeFilter !== "all" && (
              <button
                onClick={() => setTransactionTypeFilter("all")}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                View All Transactions →
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={<FileText />}
              title="Total Credit"
              value={`₦${totalCredit.toLocaleString()}`}
              iconGradient="bg-gradient-to-r from-[#5aed5f] to-[#a4f5a7] dark:from-green-800 dark:to-green-600"
            />
            <StatCard
              icon={<FileSymlink />}
              title="Total Debit"
              value={`₦${totalDebit.toLocaleString()}`}
              iconGradient="bg-gradient-to-r from-[#ed5a5a] to-[#f5a4a4] dark:from-red-900 dark:to-red-600"
            />
            <StatCard
              icon={<ChevronDown />}
              title="Balance"
              value={`₦${balance.toLocaleString()}`}
              iconGradient="bg-gradient-to-r from-[#ff8800] to-[#ffb347] dark:from-orange-900 dark:to-orange-500"
            />
          </div>
        </div>
      )}

      {txLoading ? (
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      ) : (
        <div className="mb-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              downloadCSV(
                data.data,
                TransactionHistoryColumn.filter((col) => col.id !== "ActionButton") as {
                  label: string;
                  id: keyof Statement;
                }[]
              )
            }
          >
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => downloadPDF(data.data)}>
            Export PDF
          </Button>
        </div>
      )}

      {txLoading ? (
        <div className="mb-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      ) : (
        <StatementFilterBar filters={filters} onChange={setFilters} />
      )}

      <BaseTable<TransactionRow>
        rows={transactionRows}
        columns={TransactionHistoryColumn}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPage={totalCount}
        isLoading={txLoading}
        showDownload={false}
        showCheckbox={false}
        rowName="Statement"
        actionOptions={statementActionOptions}
        actionItemOnClick={handleActionClick}
      />
    </div>
  );
}
