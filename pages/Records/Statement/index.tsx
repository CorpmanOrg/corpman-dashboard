"use client";
import React, { useState } from "react";
import { fetchStatements } from "@/utils/ApiFactory/statement";
import { Statement, TableActionOption, ToastSeverity, ToastState } from "@/types/types";
import { StatCard } from "@/components/Statistics/MainStatisticsCard.tsx";
import { LineCharts } from "@/components/Charts/LineCharts";
import { PieCharts } from "@/components/Charts/PieCharts";
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

export type StatementWithActions = Statement & { ActionButton: string };

export const Dummy_Statements_Column: Column<StatementWithActions>[] = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "amount", label: "Amount", minWidth: 100, format: (v) => `₦${v.toLocaleString()}` },
  {
    id: "type",
    label: "Type",
    minWidth: 80,
    format: (v) => (
      <span
        style={{
          display: "inline-block",
          padding: "4px 16px",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "0.95rem",
          backgroundColor: v === "credit" ? "#e6f9ed" : "#fdeaea",
          color: v === "credit" ? "#166534" : "#991b1b",
          border: "1px solid",
          borderColor: v === "credit" ? "#b6f2d7" : "#f5c2c7",
        }}
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
        <StatCard icon={<FileText />} title="Total Credit" value={`₦${totalCredit.toLocaleString()}`} />
        <StatCard icon={<FileSymlink />} title="Total Debit" value={`₦${totalDebit.toLocaleString()}`} />
        <StatCard icon={<ChevronDown />} title="Balance" value={`₦${(totalCredit - totalDebit).toLocaleString()}`} />
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
        columns={Dummy_Statements_Column}
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
