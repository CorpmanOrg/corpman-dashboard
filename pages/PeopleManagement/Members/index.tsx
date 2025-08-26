"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { Dummy_Memebers_Column } from "@/components/assets/data";
import { Member, TError, ToastSeverity, ToastState, TableActionOption } from "@/types/types";
import { getAllMembersFn } from "@/utils/ApiFactory/member";
import ConfirmModal from "@/components/Modals/ConfirmModal";
import DetailsModal from "@/components/Modals/DetailsModal";
import Toastbar from "@/components/Toastbar";
import axios from "axios";
import Image from "next/image";
import BaseTable from "@/components/BaseTable";

export type MemberWithActions = Member & { ActionButton: string };

export default function MembersPage() {
  const { modal, closeModal } = useModal();
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const status: string = "";

  const memberActionOptions: TableActionOption[] = [
    { key: "view", label: "View Details" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
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
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["fetch-members-by-admin", user?.id, page, rowsPerPage, status],
    queryFn: () =>
      getAllMembersFn({
        orgId: user?.id!,
        page,
        limit: rowsPerPage,
        status,
      }),
    enabled: !!user?.id,
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
        // open view modal
        break;
      case "edit":
        // open edit modal
        break;
      case "delete":
        // confirm and delete
        break;
      default:
        // custom action
        break;
    }
  };

  const myData: MemberWithActions[] =
    membersData?.members?.map((m, idx) => ({ ...m, id: m._id ?? idx, ActionButton: "ActionButton" })) || [];

  const last5Members = useMemo<Member[]>(() => {
    if (!membersData?.members) return [];

    return [...membersData.members]
      .sort((a, b) => {
        const dateA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const dateB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return dateA - dateB;
      })
      .slice(-5);
  }, [membersData]);

  return (
    <div className="p-6 space-y-8">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {last5Members.map((member, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#4ade80] to-[#86efac] dark:from-green-500 dark:to-green-900 border border-green-300 dark:border-green-700 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-4 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
          >
            <div className="w-16 h-16 mb-3 rounded-full overflow-hidden border border-green-100 dark:border-green-900/30 bg-gray-100 dark:bg-black">
              {member.image ? (
                <Image
                  src={member.image || "/default-avatar.png"}
                  alt={member.name || "Member"}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-200">
                  <span className="text-xl">👤</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{member.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.contact}</p>
          </div>
        ))}
      </div>

      <BaseTable<MemberWithActions>
        rows={myData || []}
        columns={Dummy_Memebers_Column}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPage={myData?.length ?? 0}
        actionOptions={memberActionOptions}
        actionItemOnClick={handleActionClick}
      />
    </div>
  );
}
