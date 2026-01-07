"use client";
import React, { useState } from "react";
import {
  Statement,
  TableActionOption,
  ToastSeverity,
  ToastState,
  StatementWithActions,
  MembersPaymentHistoryApiResponse,
  PaymentStatusFilter,
  TransactionTypeFilter,
  MemberPaymentHistory,
} from "@/types/types";
import { StatCard } from "@/components/Statistics/StatCard";
import CustomFilterBar from "@/components/Filters/CustomFilterBar";
import BaseTable, { Column } from "@/components/BaseTable";
import { downloadCSV } from "@/components/Download/CSV/csv";
import { downloadPDF } from "@/components/Download/PDF/pdf";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, FileSymlink } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Toastbar from "@/components/Toastbar";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import { getMembersHistoryFn } from "@/utils/ApiFactory/member";
import { useQuery } from "@tanstack/react-query";
import { MemberPaymentHistoryColumn } from "@/components/assets/data";
import { useSearchParams, useRouter } from "next/navigation";

type MemberPaymentHistoryRow = MemberPaymentHistory & { id: string; ActionButton: string; sn: number };

export default function History() {
  const searchParams = useSearchParams();

  const initialStatus = (() => {
    const qs = (searchParams?.get("status") || "").toLowerCase();
    if (["pending", "approved", "rejected", "all"].includes(qs)) return qs as PaymentStatusFilter;
    return "pending";
  })();
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>(initialStatus);

  const initialTransactionType = (() => {
    const qs = (searchParams?.get("transactionType") || "").toLowerCase();
    if (["savings", "contributions", "loan", "all"].includes(qs)) return qs as TransactionTypeFilter;
    return "all";
  })();
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionTypeFilter>(initialTransactionType);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<{
    type?: string;
    startDate?: string;
    endDate?: string;
  }>({});

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

  const {
    data: membersHistoryData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery<MembersPaymentHistoryApiResponse, Error>({
    queryKey: [
      "fetch-members-payment-history-query-key",
      page,
      rowsPerPage,
      statusFilter,
      transactionTypeFilter,
      filters,
    ],
    queryFn: () => {
      const queryParams = {
        page,
        limit: rowsPerPage,
        // status: statusFilter === "all" ? "all" : statusFilter, // ❌ REMOVED - not sending status to API
        type: filters.type || (transactionTypeFilter === "all" ? "all" : transactionTypeFilter),
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      console.log("🔍 [HISTORY PAGE] Query Function Called with:", {
        rawFilters: filters,
        statusFilter: "(not sent to API)",
        transactionTypeFilter,
        queryParams,
      });

      return getMembersHistoryFn(queryParams);
    },
  });

  const membersPaymentHistoryRows: MemberPaymentHistoryRow[] = (membersHistoryData?.payments || []).map(
    (tx: any, idx: number) => ({
      id: String(idx + 1),
      ActionButton: "actions",
      sn: idx + 1,
      ...tx,
    })
  );

  // Log filter changes for debugging
  React.useEffect(() => {
    console.log("🎯 [HISTORY PAGE] Filter State Changed:", {
      filters,
      statusFilter,
      transactionTypeFilter,
      page,
      rowsPerPage,
    });
  }, [filters, statusFilter, transactionTypeFilter, page, rowsPerPage]);

  console.log("membersHistoryData: ", { membersHistoryData, isLoading, membersPaymentHistoryRows });

  // Statistics - computed from actual API data
  const totalCredit = membersPaymentHistoryRows
    .filter((s) => s.type?.toLowerCase().includes("deposit"))
    .reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalDebit = membersPaymentHistoryRows
    .filter((s) => s.type?.toLowerCase().includes("withdrawal"))
    .reduce((acc, s) => acc + (s.amount || 0), 0);

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
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>

          <div className="mb-4 flex gap-2">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ) : (
        <>
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
            {/* <Button
              variant="outline"
              onClick={() =>
                downloadCSV(
                  membersPaymentHistoryRows,
                  MemberPaymentHistoryColumn.filter((col) => col.id !== "ActionButton") as {
                    label: string;
                    id: keyof Statement;
                  }[]
                )
              }
            >
              Export CSV
            </Button> */}
            <Button variant="outline" onClick={() => downloadPDF(membersPaymentHistoryRows)}>
              Export PDF
            </Button>
          </div>

          <CustomFilterBar filters={filters} onChange={setFilters} />

          <BaseTable<MemberPaymentHistoryRow>
            // rows={data.data}
            rows={membersPaymentHistoryRows}
            columns={MemberPaymentHistoryColumn}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPage={membersHistoryData?.totalPages ?? 0}
            isLoading={false}
            showDownload={false}
            showCheckbox={false}
            rowName="Statement"
            // actionOptions={statementActionOptions}
            // actionItemOnClick={handleActionClick}
          />
        </>
      )}
    </div>
  );
}
