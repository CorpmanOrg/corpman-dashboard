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
  const res = await fetch("/api/admin/createMembers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "Failed to create member";
    throw new Error(msg);
  }
  return data;
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
