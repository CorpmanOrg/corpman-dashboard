"use client";
import React, { useState } from "react";
import { fetchStatements } from "@/utils/ApiFactory/statement";
import { Statement, TableActionOption, ToastSeverity, ToastState, StatementWithActions } from "@/types/types";
import { StatCard } from "@/components/Statistics/StatCard";
import { StatementFilterBar } from "@/components/Filters/StatementFilterBar";
import BaseTable, { Column } from "@/components/BaseTable";
import { downloadCSV } from "@/components/Download/CSV/csv";
import { downloadPDF } from "@/components/Download/PDF/pdf";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, FileSymlink } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Toastbar from "@/components/Toastbar";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import { Dummy_Statements_Column } from "@/components/assets/data";

// Styled column definition with proper colors for history page
const StyledStatementsColumn: Column<StatementWithActions>[] = [
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

export default function History() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState<{
    data: StatementWithActions[];
    totalPages: number;
    totalRecords: number;
    currentPage: number;
  }>({ data: [], totalPages: 1, totalRecords: 0, currentPage: 0 });

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

  React.useEffect(() => {
    fetchStatements({ page, pageSize: rowsPerPage, ...filters }).then(setData);
  }, [page, rowsPerPage, filters]);

  // Statistics
  const totalCredit = data.data.filter((s) => s.type === "credit").reduce((acc, s) => acc + s.amount, 0);
  const totalDebit = data.data.filter((s) => s.type === "debit").reduce((acc, s) => acc + s.amount, 0);

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
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          value={`₦${(totalCredit - totalDebit).toLocaleString()}`}
          iconGradient="bg-gradient-to-r from-[#ff8800] to-[#ffb347] dark:from-orange-900 dark:to-orange-500"
        />
      </div>

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

      <StatementFilterBar filters={filters} onChange={setFilters} />

      <BaseTable
        rows={data.data}
        columns={StyledStatementsColumn}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPage={data.totalPages}
        isLoading={false}
        showDownload={false}
        showCheckbox={false}
        rowName="Statement"
        actionOptions={statementActionOptions}
        actionItemOnClick={handleActionClick}
      />
    </div>
  );
}
