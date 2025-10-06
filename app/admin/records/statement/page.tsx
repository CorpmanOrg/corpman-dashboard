"use client";
import React, { useState, useEffect } from "react";
import { fetchStatements } from "@/utils/ApiFactory/statement";
import { Statement, TableActionOption, ToastSeverity, ToastState } from "@/types/types";
import { StatCard } from "@/components/Statistics/StatCard";
import { StatementFilterBar, StatementFilterProps } from "@/components/Filters/StatementFilterBar";
import BaseTable, { Column } from "@/components/BaseTable";
import { downloadCSV } from "@/components/Download/CSV/csv";
import { downloadPDF } from "@/components/Download/PDF/pdf";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, FileText, FileSymlink, PiggyBank, GitBranchPlus, CreditCard } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Toastbar from "@/components/Toastbar";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";

// Transaction type filter type
type TransactionTypeFilter = "savings" | "contributions" | "loans" | "all";

export type StatementWithActions = Statement & { ActionButton: string };

export const Dummy_Statements_Column: Column<StatementWithActions>[] = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "amount", label: "Amount", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
  {
    id: "transactionType",
    label: "Category",
    minWidth: 100,
    format: (v) => (
      <span
        className={
          `inline-block px-3 py-1 rounded-lg font-medium text-sm capitalize ` +
          (v === "savings"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
            : v === "contributions"
            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
            : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200")
        }
      >
        {v}
      </span>
    ),
  },
  {
    id: "type",
    label: "Type",
    minWidth: 80,
    format: (v) => (
      <span
        className={
          `inline-block px-4 py-1 rounded-xl font-semibold text-[0.95rem] border ` +
          (v === "credit"
            ? "bg-[#e6f9ed] text-[#166534] border-[#b6f2d7] dark:bg-green-900/40 dark:text-green-200 dark:border-green-700"
            : "bg-[#fdeaea] text-[#991b1b] border-[#f5c2c7] dark:bg-red-900/40 dark:text-red-200 dark:border-red-700")
        }
      >
        {v === "credit" ? "Credit" : "Debit"}
      </span>
    ),
  },
  { id: "balance", label: "Balance", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
  { id: "description", label: "Description", minWidth: 180 },
  { id: "date", label: "Date", minWidth: 120, format: (v) => new Date(v).toLocaleDateString() },
  { id: "ActionButton", label: "Actions", align: "center", minWidth: 120 },
];

const statementActionOptions: TableActionOption[] = [
  { key: "view", label: "View Statement" },
  { key: "approve", label: "Approve" },
  { key: "reject", label: "Reject" },
];

export default function StatementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<StatementFilterProps["filters"]>({});
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionTypeFilter>("all");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading simulation for better visibility

    return () => clearTimeout(timer);
  }, []);

  // Enhanced dummy data with transaction types
  const allDummyData: StatementWithActions[] = [
    {
      id: "1",
      name: "John Doe",
      amount: 50000,
      type: "credit",
      transactionType: "savings",
      balance: 150000,
      description: "Monthly savings deposit",
      date: "2024-10-01",
      ActionButton: "actions",
    },
    {
      id: "2",
      name: "Jane Smith",
      amount: 25000,
      type: "debit",
      transactionType: "savings",
      balance: 125000,
      description: "Savings withdrawal",
      date: "2024-10-02",
      ActionButton: "actions",
    },
    {
      id: "3",
      name: "Mike Johnson",
      amount: 75000,
      type: "credit",
      transactionType: "contributions",
      balance: 200000,
      description: "Annual contribution",
      date: "2024-10-03",
      ActionButton: "actions",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      amount: 30000,
      type: "debit",
      transactionType: "contributions",
      balance: 170000,
      description: "Contribution adjustment",
      date: "2024-10-04",
      ActionButton: "actions",
    },
    {
      id: "5",
      name: "David Brown",
      amount: 100000,
      type: "credit",
      transactionType: "loans",
      balance: 270000,
      description: "Loan disbursement",
      date: "2024-10-05",
      ActionButton: "actions",
    },
    {
      id: "6",
      name: "Lisa Davis",
      amount: 20000,
      type: "debit",
      transactionType: "loans",
      balance: 250000,
      description: "Loan repayment",
      date: "2024-10-06",
      ActionButton: "actions",
    },
    {
      id: "7",
      name: "Robert Miller",
      amount: 45000,
      type: "credit",
      transactionType: "savings",
      balance: 295000,
      description: "Emergency fund deposit",
      date: "2024-10-07",
      ActionButton: "actions",
    },
    {
      id: "8",
      name: "Emily Taylor",
      amount: 60000,
      type: "credit",
      transactionType: "contributions",
      balance: 355000,
      description: "Special contribution",
      date: "2024-10-08",
      ActionButton: "actions",
    },
  ];

  const [data, setData] = useState<{
    data: StatementWithActions[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
  }>({ data: allDummyData, totalPages: 1, totalRecords: allDummyData.length, currentPage: 0 });

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

  // Filter data based on transaction type AND StatementFilterBar filters
  const filteredData = React.useMemo(() => {
    let result = allDummyData;

    // Filter by transaction type
    if (transactionTypeFilter !== "all") {
      result = result.filter((item) => item.transactionType === transactionTypeFilter);
    }

    // Filter by Credit/Debit type from StatementFilterBar
    if (filters.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    // Filter by amount range
    if (filters.minAmount) {
      result = result.filter((item) => item.amount >= filters.minAmount!);
    }
    if (filters.maxAmount) {
      result = result.filter((item) => item.amount <= filters.maxAmount!);
    }

    // Filter by date range
    if (filters.startDate) {
      result = result.filter((item) => new Date(item.date) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      result = result.filter((item) => new Date(item.date) <= new Date(filters.endDate!));
    }

    return result;
  }, [transactionTypeFilter, filters]);

  React.useEffect(() => {
    // Update data when filter changes
    setData({
      data: filteredData,
      totalPages: 1,
      totalRecords: filteredData.length,
      currentPage: 0,
    });
  }, [filteredData, page, rowsPerPage]);

  // Filter-aware statistics
  const totalCredit = filteredData.filter((s) => s.type === "credit").reduce((acc, s) => acc + s.amount, 0);
  const totalDebit = filteredData.filter((s) => s.type === "debit").reduce((acc, s) => acc + s.amount, 0);
  const balance = totalCredit - totalDebit;

  // Transaction type filter options with counts
  const getTransactionTypeCounts = () => {
    const counts = {
      all: allDummyData.length,
      savings: allDummyData.filter((item) => item.transactionType === "savings").length,
      contributions: allDummyData.filter((item) => item.transactionType === "contributions").length,
      loans: allDummyData.filter((item) => item.transactionType === "loans").length,
    };
    return counts;
  };

  const transactionTypeCounts = getTransactionTypeCounts();
  const TRANSACTION_TYPE_OPTIONS: TransactionTypeFilter[] = ["all", "savings", "contributions", "loans"];

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
              case "contributions":
                return <GitBranchPlus className="h-4 w-4" />;
              case "loans":
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

  const handleActionClick = (action: TableActionOption, columnId: string, row: StatementWithActions) => {
    switch (action.key) {
      case "view":
        openModal("details", {
          title: "Statement Details",
          content: (
            <div>
              <p>
                <strong>Date:</strong> {new Date(row.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong> {row.description}
              </p>
              <p>
                <strong>Type:</strong> {row.type}
              </p>
              <p>
                <strong>Amount:</strong> ₦{row.amount.toLocaleString()}
              </p>
              <p>
                <strong>Balance:</strong> ₦{row.balance.toLocaleString()}
              </p>
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
      {/* Transaction Type Filter */}
      {isLoading ? (
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
      {isLoading ? (
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

      {isLoading ? (
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
                Dummy_Statements_Column.filter((col) => col.id !== "ActionButton") as {
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

      {isLoading ? (
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

      <BaseTable
        rows={data.data}
        columns={Dummy_Statements_Column}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPage={data.totalPages}
        isLoading={isLoading}
        showDownload={false}
        showCheckbox={false}
        rowName="Statement"
        actionOptions={statementActionOptions}
        actionItemOnClick={handleActionClick}
      />
    </div>
  );
}
