"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { MemberPaymentsData } from "@/components/assets/data";
import {
  TError,
  ToastSeverity,
  ToastState,
  TableActionOption,
  PaymentDataProps,
  MemberPaymentsResponse,
} from "@/types/types";
import { getPaymentsByStatusFn, approveOrRejectPaymentsFn } from "@/utils/ApiFactory/admin";
import { PaymentStatusFilter } from "@/types/types";
import { useSearchParams, useRouter } from "next/navigation";
import { MainStatisticsCard } from "@/components/Statistics/MainStatisticsCard";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import RejectionModal from "@/components/Modals/RejectionModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import Toastbar from "@/components/Toastbar";
import BaseTable from "@/components/BaseTable";
import { CreditCard, GitBranchPlus, PiggyBank } from "lucide-react";

type PaymentRow = PaymentDataProps & { id: string; ActionButton: string; sn: number };

// Simple direct embed viewer (avoids CORS issues by not using fetch)
function ReceiptViewer({ path }: { path: string }) {
  if (!path) return null;
  const fullUrl = /^https?:\/\//i.test(path)
    ? path
    : `${(process.env.NEXT_PUBLIC_API_TEST_URL || "").replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const ext = fullUrl.split("?")[0].split(".").pop()?.toLowerCase();
  const isPdf = ext === "pdf";
  const isImage = /(png|jpe?g|gif|webp|svg)$/i.test(ext || "");
  return (
    <div className="mt-1 space-y-1">
      {isPdf && <iframe src={fullUrl} className="w-full h-72 border rounded" title="Receipt PDF" />}
      {isImage && !isPdf && <img src={fullUrl} alt="Receipt" className="max-h-72 rounded border" />}
      {!isPdf && !isImage && (
        <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
          Open Receipt
        </a>
      )}
      <div className="flex items-center gap-3">
        <a
          href={fullUrl}
          download
          className="inline-block text-[11px] text-emerald-600 hover:text-emerald-700 underline"
        >
          Download
        </a>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-500 hover:text-slate-700 underline"
        >
          Open in Tab
        </a>
      </div>
      <p className="text-[10px] text-gray-400 break-all">{fullUrl}</p>
    </div>
  );
}

export default function ContributionsPaymentsPage() {
  const { modal, openModal, closeModal } = useModal();
  const { selectedOrganization } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const stats = [
    { title: "Savings", value: selectedOrganization?.balances?.savings ?? 0, icon: <PiggyBank /> },
    { title: "Contributions", value: selectedOrganization?.balances?.contribution ?? 0, icon: <GitBranchPlus /> },
    { title: "Loans", value: selectedOrganization?.balances?.loanBalance ?? 0, icon: <CreditCard /> },
  ];

  // Status filter (pending | approved | rejected | all)
  const initialStatus = (() => {
    const qs = (searchParams?.get("status") || "").toLowerCase();
    if (["pending", "approved", "rejected", "all"].includes(qs)) return qs as PaymentStatusFilter;
    return "pending";
  })();
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>(initialStatus);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) => setToast({ open: true, severity, message });

  const handleCloseToast = () =>
    setToast((t) => ({
      ...t,
      open: false,
    }));

  const {
    data: paymentsResp,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery<MemberPaymentsResponse>({
    queryKey: ["payments", statusFilter, page, rowsPerPage],
    queryFn: () =>
      getPaymentsByStatusFn({ status: statusFilter, page, limit: rowsPerPage }) as Promise<MemberPaymentsResponse>,
  });

  const paymentRows: PaymentRow[] = (paymentsResp?.payments || []).map((p: any, idx: number) => ({
    ...p,
    id: p._id || String(idx),
    sn: page * rowsPerPage + idx + 1,
    ActionButton: "ActionButton",
  }));

  const totalCount = paymentsResp?.total ?? paymentRows.length;

  const allowedActionsForRow = (row: PaymentRow): TableActionOption[] => {
    const base: TableActionOption[] = [{ key: "view", label: "View Details" }];
    if (row.status === "pending") {
      base.push({ key: "approve", label: "Approve" }, { key: "reject", label: "Reject" });
    }
    return base;
  };

  const allActions: TableActionOption[] = [
    { key: "view", label: "View Details" },
    { key: "approve", label: "Approve" },
    { key: "reject", label: "Reject" },
  ];

  // const mutation = useMutation({
  //   mutationFn: approveOrRejectPaymentsFn,
  //   // Optimistic update for current visible page
  //   onMutate: async (vars: { id: string; action: string; rejectionReason?: string }) => {
  //     await queryClient.cancelQueries({ queryKey: ["payments", statusFilter, page, rowsPerPage] });
  //     const key = ["payments", statusFilter, page, rowsPerPage];
  //     const previous = queryClient.getQueryData<MemberPaymentsResponse>(key as any);
  //     if (previous) {
  //       const updated = { ...previous } as MemberPaymentsResponse;
  //       updated.payments = updated.payments.map((p: any) => {
  //         if (p._id === vars.id || p.id === vars.id) {
  //           if (vars.action === "approve") {
  //             return { ...p, status: "approved" };
  //           }
  //           if (vars.action === "reject") {
  //             return { ...p, status: "rejected" };
  //           }
  //         }
  //         return p;
  //       });
  //       // If we are on pending list and approving/rejecting, we can optionally filter them out
  //       if (statusFilter === "pending") {
  //         updated.payments = updated.payments.filter((p: any) => p.status === "pending");
  //         updated.total = updated.payments.length;
  //       }
  //       queryClient.setQueryData(key as any, updated);
  //     }
  //     return { previous }; // context for rollback
  //   },
  //   onError: (err: any, _vars, context: any) => {
  //     if (context?.previous) {
  //       queryClient.setQueryData(["payments", statusFilter, page, rowsPerPage], context.previous);
  //     }
  //     showToast("error", err?.message || "Failed to update payment");
  //   },
  //   onSuccess: () => {
  //     showToast("success", "Payment updated successfully");
  //     closeModal();
  //   },
  //   onSettled: async () => {
  //     // Broad invalidate (predicate catches every variant of payments queries regardless of page/status)
  //     await queryClient.invalidateQueries({
  //       predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "payments",
  //     });
  //     // Force immediate refetch to observe backend change even if data not considered stale yet
  //     await queryClient.refetchQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "payments" });
  //   },
  // });
  const mutation = useMutation({
    mutationFn: approveOrRejectPaymentsFn,

    // 🔹 Optimistic update
    onMutate: async (vars: { id: string; action: "approve" | "reject"; rejectionReason?: string }) => {
      // Cancel any outgoing queries for payments so we don’t overwrite
      await queryClient.cancelQueries({ queryKey: ["payments"] });

      // Snapshot the previous value
      const key = ["payments", statusFilter, page, rowsPerPage];
      const previous = queryClient.getQueryData<MemberPaymentsResponse>(key);

      if (previous) {
        const updated: MemberPaymentsResponse = {
          ...previous,
          payments: previous.payments.map((p) => {
            if (p._id === vars.id || (p as any).id === vars.id) {
              return {
                ...p,
                status: vars.action === "approve" ? "approved" : "rejected",
              };
            }
            return p;
          }),
          total: previous.total,
        };

        // If we’re in the "pending" tab, hide the row immediately
        if (statusFilter === "pending") {
          updated.payments = updated.payments.filter((p) => p.status === "pending");
          updated.total = updated.payments.length;
        }

        queryClient.setQueryData(key, updated);
      }

      // Return context for rollback
      return { previous };
    },

    // 🔹 Rollback on error
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["payments", statusFilter, page, rowsPerPage], context.previous);
      }
      showToast("error", (err as Error).message || "Failed to update payment ❌");
    },

    // 🔹 Success feedback
    onSuccess: () => {
      showToast("success", "Payment updated successfully ✅");
      closeModal();
    },

    // 🔹 Always refetch from server (ensures totals are correct)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  useEffect(() => {
    if (isSuccess) showToast("success", "Payments fetched ✅");
  }, [isSuccess, statusFilter, page, rowsPerPage]);
  // Sync statusFilter to URL when it changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (statusFilter === "pending") {
      // remove to keep default clean
      params.delete("status");
    } else {
      params.set("status", statusFilter);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [statusFilter]);

  // When status changes reset to first page
  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  const STATUS_OPTIONS: PaymentStatusFilter[] = ["pending", "approved", "rejected", "all"];

  const renderStatusFilter = () => (
    <div className="flex flex-wrap gap-2 items-center">
      {STATUS_OPTIONS.map((opt) => {
        const active = statusFilter === opt;
        const disabled = opt === "all" && statusFilter !== "all" && false; // keep logic placeholder if need disabling
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled || isLoading}
            onClick={() => setStatusFilter(opt)}
            className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors
              ${
                active
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            aria-pressed={active}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        );
      })}
    </div>
  );

  useEffect(() => {
    if (isError && error) {
      showToast(
        "error",
        (error as unknown as TError)?.message || (error as Error).message || "Failed to fetch payments ❌"
      );
    }
  }, [isError, error]);

  const handleActionClick = (action: TableActionOption, _columnId: string, row: PaymentRow) => {
    if (!allowedActionsForRow(row).some((a) => a.key === action.key)) return;
    if (action.key === "view") {
      const formattedType = (() => {
        const raw = String(row.type || "").toLowerCase();
        const parts = raw.split(/[\-_]/).filter(Boolean);
        if (!parts.length) return row.type;
        const categoryRaw = parts[0];
        const actionRaw = parts.slice(1).join(" ");
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
        const mappedAction = actionRaw
          .split(/\s+/)
          .filter(Boolean)
          .map((t) => actionMap[t] || t.charAt(0).toUpperCase() + t.slice(1))
          .join(" ")
          .trim();
        return mappedAction ? `${cat} (${mappedAction})` : cat;
      })();
      openModal("details", {
        title: "Payment Details",
        content: (
          <div className="space-y-2 text-sm">
            <p>
              <strong>Member:</strong> {row.memberId?.firstName} {row.memberId?.surname}
            </p>
            <p>
              <strong>Amount:</strong> {row.amount}
            </p>
            <p>
              <strong>Type:</strong> {formattedType}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  row.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : row.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : row.status === "rejected"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {row.status}
              </span>
            </p>
            {row.description && (
              <p>
                <strong>Description:</strong> {row.description}
              </p>
            )}
            <p>
              <strong>Created:</strong> {new Date(row.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong> {new Date(row.updatedAt).toLocaleString()}
            </p>
            {row.paymentReceipt && (
              <div>
                <strong>Receipt:</strong>
                <ReceiptViewer path={row.paymentReceipt} />
              </div>
            )}
          </div>
        ),
      });
    }
    if (action.key === "approve") {
      openModal("confirm", {
        message: `Are you sure you want to approve payment of ₦${row.amount}?`,
        onConfirm: () =>
          mutation.mutate({
            id: row.id,
            action: "approve",
          }),
      });
    }

    if (action.key === "reject") {
      openModal("reject", {
        message: `Please provide a reason for rejecting ₦${row.amount}`,
        onReject: (reason: string) =>
          mutation.mutate({
            id: row.id,
            action: "reject",
            rejectionReason: reason,
          }),
      });
    }
  };

  const isMutating = mutation.status === "pending";

  console.log("Statistics Data:", { stats, selectedOrganization });

  return (
    <div className="space-y-8">
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />

      <ConfirmModal
        open={modal.type === "confirm"}
        onClose={closeModal}
        onConfirm={modal.data?.onConfirm}
        message={modal.data?.message || ""}
        loading={isMutating} // Only if your ConfirmModal supports this prop
      />

      <RejectionModal
        open={modal.type === "reject"}
        onClose={closeModal}
        onReject={modal.data?.onReject}
        message={modal.data?.message || ""}
        loading={isMutating}
      />

      <DetailsModal open={modal.type === "details"} onClose={closeModal} title={modal.data?.title}>
        {modal.data?.content}
      </DetailsModal>

      <MainStatisticsCard stats={stats} showActivityCard={false} />

      <div className="px-6">{renderStatusFilter()}</div>

      {isLoading && (
        <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading payments...</div>
      )}

      {!isLoading && !paymentRows.length && (
        <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          {statusFilter === "all" ? "No payments found." : `No ${statusFilter} payments found.`}
        </div>
      )}

      {!isLoading && !!paymentRows.length && (
        <div className="px-6">
          <BaseTable<PaymentRow>
            rows={paymentRows}
            columns={MemberPaymentsData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPage={totalCount}
            actionOptions={allActions}
            actionItemOnClick={handleActionClick}
          />
        </div>
      )}
    </div>
  );
}
