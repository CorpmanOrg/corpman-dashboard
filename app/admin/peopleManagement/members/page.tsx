"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { Dummy_Memebers_Column } from "@/components/assets/data";
import {
  Member,
  TError,
  ToastSeverity,
  ToastState,
  TableActionOption,
  ApproveRejectPayload,
  ApproveRejectResponse,
  MemberWithActions,
} from "@/types/types";
import { getAllMembersFn, approveOrRejectMembersFn, getSingleMemberFn } from "@/utils/ApiFactory/admin";
import { StatCardOpposite } from "@/components/Statistics/StatCard";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import Toastbar from "@/components/Toastbar";
import BaseTable from "@/components/BaseTable";
import { User, Users, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityPieMiniChart } from "@/components/dashboard-charts";
import MemberContributionForm from "@/components/Contributions/MemberContributionForm";
import RecentActivities from "@/components/RecentActivities/RecentActivities";

type MembersRow = MemberWithActions & { sn: number; ActionButton: string; id: string };

export default function MembersPage() {
  const { modal, openModal, closeModal } = useModal();
  const { user, currentRole, currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const status: string = "";
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  type BarDataType = { name: string; value: number };

  const BAR_DATA: BarDataType[] = [
    { name: "Total Joined", value: 15 },
    { name: "Active", value: 2 },
    { name: "Pending", value: 4 },
  ];

  const COLORS = ["#22c55e", "#065f46", "#4ade80"];

  // const memberActionOptions: TableActionOption[] = [
  //   { key: "view", label: "View Details" },
  //   // { key: "edit", label: "Edit" },
  //   // { key: "delete", label: "Delete" },
  //   { key: "approve", label: "Approve" },
  //   { key: "reject", label: "Reject" },
  // ];
  const memberActionOptionsForRow = (row: MemberWithActions): TableActionOption[] => {
    const baseOptions: TableActionOption[] = [
      { key: "view", label: "View Details" },
      { key: "edit", label: "Edit" },
      { key: "delete", label: "Delete" },
    ];

    if (row.status === "pending") {
      return [...baseOptions, { key: "approve", label: "Approve" }, { key: "reject", label: "Reject" }];
    }

    // For "active" or other statuses, just return baseOptions
    return baseOptions;
  };

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) => {
    setToast({
      open: true,
      severity,
      message,
    });
  };

  const handleCloseToast = () => {
    setToast((prevS) => ({
      ...prevS,
      open: false,
    }));
  };

  const {
    data: membersData,
    isLoading: MemberLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch-members-by-admin", user?.user?._id, page, rowsPerPage, status],
    queryFn: () =>
      getAllMembersFn({
        orgId: currentOrgId!,
        page,
        limit: rowsPerPage,
        status,
      }),
    enabled: !!user?.user?._id,
  });

  const mutation = useMutation<ApproveRejectResponse, Error, ApproveRejectPayload>({
    mutationFn: approveOrRejectMembersFn,
    onSuccess: (data) => {
      // console.log("✅ Approve/Reject success:", data);
      showToast("success", data?.message || "Action successful!");
      closeModal();
      // Invalidate and refetch members data
      queryClient.invalidateQueries({ queryKey: ["fetch-members-by-admin"] });
    },
    onError: (error) => {
      console.error("❌ Approve/Reject error:", error);
      showToast("error", error.message || "Action failed!");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      showToast("success", "Members fetched successfully ✅");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      showToast(
        "error",
        (error as unknown as TError)?.message || (error as Error).message || "Failed to fetch members ❌"
      );
    }
  }, [isError, error]);

  const handleActionClick = (action: TableActionOption, columnId: string, row: MemberWithActions) => {
    switch (action.key) {
      case "view":
        setSelectedMemberId(row._id!);
        openModal("details", {
          title: "Member Details",
        });
        break;
      case "edit":
        openModal("form", { member: row });
        break;
      case "delete":
        openModal("confirm", {
          message: `Are you sure you want to delete ${row.firstName} ${row.surname}?`,
          onConfirm: () => {
            // Call your delete API here
          },
        });
        break;
      case "approve":
        openModal("confirm", {
          message: `Approve member ${row.firstName} ${row.surname}?`,
          onConfirm: () => {
            const payload: ApproveRejectPayload = {
              updates: [{ memberId: row._id, status: "active" }],
            };
            // console.log("➡️ Approving member with payload:", payload);
            mutation.mutate(payload);
          },
        });
        break;
      case "reject":
        openModal("confirm", {
          message: `Reject member ${row.firstName} ${row.surname}?`,
          onConfirm: () => {
            const payload: ApproveRejectPayload = {
              updates: [{ memberId: row._id, status: "rejected" }],
            };
            // console.log("➡️ Rejecting member with payload:", payload);
            mutation.mutate(payload);
          },
        });
        break;
      default:
        break;
    }
  };

  const myData: MemberWithActions[] =
    membersData?.members?.map((m, idx) => ({ ...m, id: m._id ?? idx, ActionButton: "ActionButton" })) || [];

  const membersRows: MembersRow[] = (membersData?.members || []).map((m: any, idx: number) => ({
    ...m,
    id: m._id ?? idx,
    sn: page * rowsPerPage + idx + 1,
    ActionButton: "ActionButton",
  }));

  const totalCount = membersData?.total ?? membersRows.length;

  const last3Members = useMemo<Member[]>(() => {
    const list = membersData?.members || [];
    if (!list.length) return [];
    // Sort by joinedAt descending (newest first) and take first 3
    return [...list]
      .sort((a, b) => {
        const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return dateB - dateA; // descending
      })
      .slice(0, 3);
  }, [membersData]);

  // Helper function to get icon gradient based on member status
  const getStatusIconGradient = (status: string) => {
    switch (status) {
      case "active":
        // return "bg-gradient-to-r from-[#5aed5f] to-[#a4f5a7] dark:from-green-800 dark:to-green-600";
        return "bg-[#15c41bff] dark:from-green-800 dark:to-green-600";
      // case "pending":
      //   return "bg-gradient-to-r from-[#ff8800] to-[#ffb347] dark:from-yellow-800 dark:to-yellow-600";
      // case "rejected":
      //   return "bg-gradient-to-r from-[#ed5a5a] to-[#f5a4a4] dark:from-red-800 dark:to-red-600";
      // case "inactive":
      //   return "bg-gradient-to-r from-[#6b7280] to-[#9ca3af] dark:from-gray-700 dark:to-gray-600";
      default:
        return "bg-[#15c41bff] dark:from-green-800 dark:to-green-600";
    }
  };

  // console.log("User Detail: ", { last3Members, currentOrgId });

  // Fetch single member details when a member is selected & modal open
  const {
    data: memberDetailData,
    isLoading: memberDetailLoading,
    isError: memberDetailError,
    error: memberDetailErrObj,
    refetch: refetchMemberDetail,
  } = useQuery({
    queryKey: ["member-detail", currentOrgId, selectedMemberId],
    queryFn: () => getSingleMemberFn(currentOrgId!, selectedMemberId!),
    enabled: !!selectedMemberId && !!currentOrgId && modal.type === "details",
    staleTime: 60_000,
  });

  useEffect(() => {
    if (modal.type !== "details") {
      setSelectedMemberId(null);
    }
  }, [modal.type]);

  const renderMemberDetails = () => {
    if (!selectedMemberId) return modal.data?.content || null;
    if (memberDetailLoading) {
      return (
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 py-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Fetching member details...
        </div>
      );
    }
    if (memberDetailError) {
      return (
        <div className="space-y-3 py-2">
          <div className="flex items-start gap-2 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span>{(memberDetailErrObj as any)?.message || "Failed to load member details."}</span>
          </div>
          <button
            onClick={() => refetchMemberDetail()}
            className="text-xs px-3 py-1 rounded border border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            Retry
          </button>
        </div>
      );
    }

    const m = (memberDetailData as any)?.member;
    if (!m) return <div className="text-sm text-gray-500">No details available.</div>;
    const org = m.organization || {};

    // Group fields into left + right
    const leftDetails = [
      { label: "Name", value: `${m.firstName || ""} ${m.middleName || ""} ${m.surname || ""}`.trim() },
      { label: "Email", value: m.email },
      { label: "Mobile", value: m.mobileNumber },
      { label: "Date of Birth", value: m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString() : "-" },
      { label: "State of Origin", value: m.stateOfOrigin },
      { label: "LGA", value: m.LGA },
      { label: "Marital Status", value: m.maritalStatus },
      { label: "Employer", value: m.employer },
      { label: "Annual Income", value: m.annualIncome?.toLocaleString() },
      { label: "Monthly Contribution", value: m.monthlyContribution?.toLocaleString() },
    ];

    const rightDetails = [
      { label: "Next of Kin", value: m.nextOfKin },
      { label: "Next of Kin Relationship", value: m.nextOfKinRelationship },
      { label: "Next of Kin Address", value: m.nextOfKinAddress },
      { label: "Residential Address", value: m.residentialAddress || m.address },
      { label: "Status", value: org.status },
      { label: "Role", value: org.role },
      { label: "Savings", value: org.balances?.savings?.toLocaleString() },
      { label: "Contribution", value: org.balances?.contribution?.toLocaleString() },
      { label: "Loan Balance", value: org.balances?.loanBalance?.toLocaleString() },
      { label: "Total Balance", value: org.balances?.totalBalance?.toLocaleString() },
      { label: "Created", value: m.createdAt ? new Date(m.createdAt).toLocaleString() : "-" },
      { label: "Updated", value: m.updatedAt ? new Date(m.updatedAt).toLocaleString() : "-" },
    ];

    return (
      <div className="grid grid-cols-10 gap-6 text-sm">
        {/* Left Side */}
        <div className="col-span-5 border-r pr-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {leftDetails.map(({ label, value }) => (
              <div key={label}>
                <p className="text-black text-[13px] font-semibold capitalize">{label}</p>
                <p className="text-[#C2C2C2] text-[11px]">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-5 pl-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {rightDetails.map(({ label, value }) => (
              <div key={label}>
                <p className="text-black text-[13px] font-semibold capitalize">{label}</p>
                <p className="text-[#C2C2C2] text-[11px]">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Advanced loading skeleton component with animations
  const MembersLoadingSkeleton = () => {
    return (
      <div className="px-6 py-6 space-y-8 animate-in fade-in duration-500">
        {/* Member Cards Loading Skeleton */}
        <p className="animate-pulse">Loading member details...</p>
        {currentRole === "org_admin" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-green-100/30 dark:via-green-900/20 to-transparent" />

                <div className="p-5 flex items-center gap-4">
                  {/* Icon skeleton with pulsing green theme */}
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800/50 dark:to-green-700/50 animate-pulse" />
                    <div
                      className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: "70%" }} />
                    <div
                      className="h-4 bg-green-200 dark:bg-green-800/30 rounded animate-pulse"
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>

                {/* Footer skeleton */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-green-50/30 dark:bg-green-900/10">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table Loading Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          {/* Table Header Skeleton */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div className="grid grid-cols-7 gap-4">
              {["S/N", "First Name", "Middle Name", "Surname", "Email", "Status", "Actions"].map((header, idx) => (
                <div
                  key={header}
                  className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    width: idx === 4 ? "80%" : "100%", // Email column wider
                  }}
                />
              ))}
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((rowIdx) => (
              <div
                key={rowIdx}
                className="relative overflow-hidden p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                style={{ animationDelay: `${rowIdx * 120}ms` }}
              >
                {/* Row shimmer effect */}
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-green-100/40 dark:via-green-900/30 to-transparent"
                  style={{ animationDelay: `${rowIdx * 300}ms` }}
                />

                <div className="grid grid-cols-7 gap-4 items-center relative z-10">
                  {/* S/N */}
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

                  {/* Name columns */}
                  {[1, 2, 3].map((nameIdx) => (
                    <div key={nameIdx} className="space-y-1">
                      <div
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                        style={{ width: `${60 + Math.random() * 30}%` }}
                      />
                    </div>
                  ))}

                  {/* Email */}
                  <div className="space-y-1">
                    <div
                      className="h-4 bg-blue-200 dark:bg-blue-800/30 rounded animate-pulse"
                      style={{ width: "85%" }}
                    />
                  </div>

                  {/* Status Badge Skeleton */}
                  <div className="flex items-center">
                    <div className="h-6 w-20 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800/50 dark:to-green-700/50 rounded-xl animate-pulse border border-green-300 dark:border-green-700/50" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3].map((actionIdx) => (
                      <div
                        key={actionIdx}
                        className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
                        style={{ animationDelay: `${(rowIdx + actionIdx) * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((pageIdx) => (
                  <div
                    key={pageIdx}
                    className="h-8 w-8 bg-green-200 dark:bg-green-800/50 rounded animate-pulse"
                    style={{ animationDelay: `${pageIdx * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 bg-green-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Toast and Modals */}
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <ConfirmModal
        open={modal.type === "confirm"}
        onClose={closeModal}
        onConfirm={modal.data?.onConfirm}
        message={modal.data?.message || ""}
        loading={mutation.status === "pending"}
      />

      <DetailsModal
        open={modal.type === "details"}
        onClose={closeModal}
        title={modal.data?.title || "Member Details"}
        width="75%"
      >
        {renderMemberDetails()}
      </DetailsModal>

      {/* Loading State */}
      {MemberLoading && <MembersLoadingSkeleton />}

      {/* Main Content */}
      {!MemberLoading && (
        <div className="px-6 py-6 space-y-8">
          {currentRole === "org_admin" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {last3Members.map((member, idx) => (
                <StatCardOpposite
                  key={idx}
                  title={`${member.firstName} ${member.surname}` || "Yazid"}
                  value={member.status || "N/A"}
                  icon={member.image || <User className="h-5 w-5" />}
                  iconGradient={getStatusIconGradient(member.status || "inactive")}
                />
              ))}
              {/* Activity Bar Chart Card */}
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:shadow-green-900/10">
                <div className="text-white p-4 h-full flex flex-col justify-between">
                  <div className="h-[100px]">
                    <ActivityPieMiniChart />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {!MemberLoading && !!membersRows.length && (
            <BaseTable<MembersRow>
              rows={membersRows || []}
              columns={Dummy_Memebers_Column}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalPage={totalCount ?? 0}
              actionOptions={memberActionOptionsForRow}
              actionItemOnClick={handleActionClick}
            />
          )}
        </div>
      )}
    </div>
  );
}
