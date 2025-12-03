"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { Dummy_Memebers_Column, dummyMembers } from "@/components/assets/data";
import { Member, TError, ToastSeverity, ToastState, TableActionOption, MemberWithActions } from "@/types/types";
import { getAllMembersFn, approveOrRejectMembersFn } from "@/utils/ApiFactory/admin";
import { StatCardOpposite } from "@/components/Statistics/StatCard";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import Toastbar from "@/components/Toastbar";
import BaseTable from "@/components/BaseTable";
import { User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityPieMiniChart } from "@/components/dashboard-charts";
import MemberContributionForm from "@/components/Contributions/MemberContributionForm";
import RecentActivities from "@/components/RecentActivities/RecentActivities";

type MembersRow = MemberWithActions & { sn: number };

export default function MembersPage() {
  const { modal, openModal, closeModal } = useModal();
  const { user, currentRole, currentOrgId } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const status: string = "";

  type BarDataType = { name: string; value: number };
  const BAR_DATA: BarDataType[] = [
    { name: "Total Joined", value: 15 },
    { name: "Active", value: 2 },
    { name: "Pending", value: 4 },
  ];

  const COLORS = ["#22c55e", "#065f46", "#4ade80"];

  const memberActionOptions: TableActionOption[] = [
    { key: "view", label: "View Details" },
    // { key: "edit", label: "Edit" },
    // { key: "delete", label: "Delete" },
    { key: "approve", label: "Approve" },
    { key: "reject", label: "Reject" },
  ];

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
    queryKey: ["fetch-members-by-admin", currentOrgId, page, rowsPerPage, status],
    queryFn: () =>
      getAllMembersFn({
        orgId: currentOrgId!,
        page,
        limit: rowsPerPage,
        status,
      }),
    enabled: !!currentOrgId,
  });

  function getPaginatedDummyData(page: number, rowsPerPage: number) {
    const totalRecords = dummyMembers.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    const startIdx = page * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    const paginatedData = dummyMembers.slice(startIdx, endIdx);

    return {
      currentPage: page + 1,
      data: paginatedData,
      nextPage: page + 1 < totalPages ? page + 2 : null,
      totalPages,
      totalRecords,
    };
  }

  const dummyApiResponse = getPaginatedDummyData(page, rowsPerPage);

  const select = (data: any) => {
    const transform = data?.data?.map((itm: any, idx: number) => ({
      ...itm,
      sn: page * rowsPerPage + idx + 1,
      ActionButton: "ActionButton",
    }));
    const totalCount = data?.totalRecords;
    const pagesCount = data?.totalPages;
    return { transform, totalCount, pagesCount };
  };

  const { transform, totalCount, pagesCount } = select(dummyApiResponse);

  const mutation = useMutation({
    mutationFn: approveOrRejectMembersFn,
    onSuccess: (data) => {
      showToast("success", data.message || "Action successful!");
      // Optionally refetch members here
    },
    onError: (error: any) => {
      showToast("error", error.message || "Action failed!");
    },
  });

  useEffect(() => {
    if (isSuccess) {
      showToast("success", "Dispute fetched successfully ✅");
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
        openModal("details", {
          title: "Member Details",
          content: (
            <div>
              <p>
                <strong>Name:</strong> {row.firstName} {row.surname}
              </p>
              <p>
                <strong>Email:</strong> {row.email}
              </p>
              {/* Add more fields as needed */}
            </div>
          ),
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
            closeModal();
          },
        });
        break;
      case "approve":
        openModal("confirm", {
          message: `Approve member ${row.firstName} ${row.surname}?`,
          onConfirm: () => {
            // console.log("Approving member:", row);
            mutation.mutate({
              updates: [{ memberId: row._id, status: "active" }],
            });
            closeModal();
          },
        });
        break;
      case "reject":
        openModal("confirm", {
          message: `Reject member ${row.firstName} ${row.surname}?`,
          onConfirm: () => {
            mutation.mutate({
              updates: [{ memberId: row._id, status: "rejected" }],
            });
            closeModal();
          },
        });
        break;
      default:
        break;
    }
  };

  // const myData: MemberWithActions[] =
  //   membersData?.members?.map((m, idx) => ({ ...m, id: m._id ?? idx, ActionButton: "ActionButton" })) || [];

  const last5Members = useMemo<Member[]>(() => {
    // if (!membersData?.members) return [];
    if (!dummyMembers) return [];

    // return [...membersData.members]
    return [...dummyMembers]
      .sort((a, b) => {
        const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return dateA - dateB;
      })
      .slice(-3);
  }, [membersData]);

  // console.log("From Mebers-Dummy-Reset: ", { transform, totalCount, pagesCount });

  return (
    <div className="px-6 space-y-8">
      {/* 🔹 Top Section: Cards */}
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
      {currentRole === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {last5Members.map((member, idx) => (
            <StatCardOpposite
              key={idx}
              title={`${member.firstName} ${member.surname}` || "Yazid"}
              value={member.mobileNumber || "N/A"}
              icon={member.image || <User className="h-5 w-5" />}
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
      {currentRole === "member" && (
        <Card className="shadow-md bg-white hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
            <CardTitle className="text-lg font-bold text-[#0e4430] dark:text-green-400">Dispute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              <div>
                <MemberContributionForm
                  moduleType="contribution"
                  // onSubmit={(payload) => {
                  //   // handle form submission here
                  //   console.log("Submitted payload:", payload);
                  // }}
                />
              </div>
              <div className="pt-8 flex-1">
                <h3 className="font-bold mb-4 text-black dark:text-green-400">Recent Transactions</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-start p-3 rounded-lg bg-[#f9fdf9] dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                        <Users className="h-5 w-5 text-[#19d21f] dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-gray-200">New member registered</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <BaseTable<MembersRow>
        rows={transform || []}
        columns={Dummy_Memebers_Column}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPage={totalCount ?? 0}
        actionOptions={memberActionOptions}
        actionItemOnClick={handleActionClick}
      />
    </div>
  );
}
