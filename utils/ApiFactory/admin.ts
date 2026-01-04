import {
  ApproveRejectPayload,
  ApproveRejectResponse,
  AssignRoleType,
  CreateMemberPayload,
  CreateMemberResponse,
  CreateBulkMembersPayload,
  CreateBulkMembersResponse,
  ErrorResponse,
  MemberParams,
  MembersApiResponse,
  paymentApproveOrRejectType,
  PaymentApproveRejectResponse,
} from "@/types/types";

import { fetchWrapper } from "@/utils/handleAppErr";

export type MyApproveRejectPayload = {
  id: string;
  action: "approve" | "reject";
  rejectionReason?: string; // only required for reject
};

export const getAllMembersFn = async ({
  page = 1,
  limit = 5,
  orgId,
  status = "",
}: MemberParams): Promise<MembersApiResponse> => {
  const res = await fetch(`/api/fetchMembers?orgId=${orgId}&page=${page + 1}&limit=${limit}&status=${status}`);
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};

export const getSingleMemberFn = async (orgId: string, memberId: string) => {
  const res = await fetch(`/api/admin/people/getMemberById?orgId=${orgId}&memberId=${memberId}`, { cache: "no-store" });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse balance response");
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.errors) && data.errors.join(", ")) ||
      "Failed to load member balance";
    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  return data;
};

export const approveOrRejectMembersFn = async (payload: ApproveRejectPayload): Promise<ApproveRejectResponse> => {
  const res = await fetch("/api/approveMember", {
    method: "PATCH", // matches backend route!
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text }; // fallback if not JSON
    }
  }

  if (!res.ok) {
    const msg = data?.message || "An unknown error occurred";
    throw new Error(msg);
  }

  return data;
};

export async function approveOrRejectPaymentsFn({ id, action, rejectionReason }: MyApproveRejectPayload): Promise<any> {
  if (!id) throw new Error("id is required");
  if (!action) throw new Error("action is required");

  // payload matches exactly what backend expects
  const payload: Record<string, any> = { action };
  if (action === "reject") {
    if (!rejectionReason?.trim()) {
      throw new Error("Rejection reason is required when rejecting");
    }
    payload.rejectionReason = rejectionReason;
  }

  const res = await fetch(`/api/admin/financials/adminTransaction`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const getAdminBalanceFn = async (orgId: string) => {
  const res = await fetch(`/api/admin/records/orgBalance?orgId=${orgId}`, { cache: "no-store" });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse balance response");
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.errors) && data.errors.join(", ")) ||
      "Failed to load member balance";
    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  // Expect shape { balances: { savings: number, contribution: number, loanBalance: number, ... } }
  return data?.balances || data;
};

export const getCooperativeSummaryFn = async (orgId: string) => {
  // if (!orgId) throw new Error("Organization ID is required");
  // const res = await fetch(`/api/admin/records/cooperativeSummary?orgId=${orgId}`, { cache: "no-store" });

  // let data: any;
  // try {
  //   data = await res.json();
  // } catch {
  //   throw new Error("Failed to parse cooperative summary response");
  // }

  // if (!res.ok) {
  //   const msg =
  //     data?.error ||
  //     data?.message ||
  //     (Array.isArray(data?.errors) && data.errors.join(", ")) ||
  //     "Failed to load cooperative summary";
  //   const err = new Error(msg);
  //   (err as any).status = res.status;
  //   throw err;
  // }

  // return data;

  const res = await fetch(`/api/admin/records/cooperativeSummary?orgId=${orgId}`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.errors) && data.errors.join(", ")) ||
      "Failed to load member balance";
    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  return data;
};

export const getPaymentsByStatusFn = async ({
  status,
  page = 0,
  limit = 10,
}: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  // For 'all' we explicitly send status=
  if (status === "all") {
    params.set("status", "");
  } else if (typeof status === "string") {
    params.set("status", status);
  } else {
    params.set("status", "");
  }
  params.set("page", String(page + 1));
  params.set("limit", String(limit));
  const res = await fetch(`/api/admin/financials/pendingPayments?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
  return data;
};

export const assignRoleFn = async (payload: AssignRoleType): Promise<ErrorResponse> => {
  const res = await fetch("/api/admin/people/assignRole", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
  return data;
};

export const getOrganizationSettingsFn = async (email: string) => {
  // talk about this part with him
};

// 🆕 Create Members Functions
export const createSingleMemberFn = async (payload: CreateMemberPayload): Promise<CreateMemberResponse> => {
  const data = await fetchWrapper("/api/admin/createMembers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return data as CreateMemberResponse;
};

export const createBulkMembersFn = async (payload: CreateBulkMembersPayload): Promise<CreateBulkMembersResponse> => {
  const res = await fetch("/api/admin/createMembers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "Failed to create members";
    throw new Error(msg);
  }
  return data;
};

export const getTransactionHistoryFn = async ({
  orgId,
  status,
  type = "",
  page = 0,
  limit = 10,
}: {
  orgId: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  console.log("My Query Params: ", { orgId, status, type, page, limit });
  if (!orgId) throw new Error("Organization ID is required");
  const params = new URLSearchParams();
  params.set("orgId", orgId);
  if (status === "") {
    params.set("status", "pending");
  } else if (typeof status === "string") {
    params.set("status", status);
  }
  // Always send a canonical type value; default to 'all' when empty
  params.set("type", type || "all");
  params.set("page", String(page + 1));
  params.set("limit", String(limit));
  const res = await fetch(`/api/admin/records/transactionHistory?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
  return data;
};

export const getNewPendingPaymentFn = async ({
  orgId,
  status,
  type = "",
  page = 0,
  limit = 10,
}: {
  orgId: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}) => {
  if (!orgId) throw new Error("Organization ID is required");
  const params = new URLSearchParams();
  params.set("orgId", orgId);
  if (status === "") {
    params.set("status", "pending");
  } else if (typeof status === "string") {
    params.set("status", status);
  }
  if (type && type !== "savings") {
    params.set("type", type);
  }
  params.set("page", String(page + 1));
  params.set("limit", String(limit));
  const res = await fetch(`/api/admin/financials/newPendingPayments?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
  return data;
};
