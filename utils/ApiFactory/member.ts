import {
  ApproveRejectResponse,
  MemberParams,
  MembersApiResponse,
  deposit,
  withdrawal,
  MakePaymentRes,
  ErrorResponse,
  MemberPaymentHistoryParams,
  MembersPaymentHistoryApiResponse,
  GenerateMemberStatementParams,
  GenerateStatementResponse,
  MemberProfileResponse,
  UpdateMemberProfileParams,
  UpdateMemberProfileResponse,
} from "@/types/types";

// utils/ApiFactory/member.ts

export const memberPaymentFn = async (payload: deposit | (withdrawal & { type: string })): Promise<MakePaymentRes> => {
  const formData = new FormData();

  // Common fields
  formData.append("amount", payload.amount);
  formData.append("description", payload.description);
  formData.append("type", payload.type);

  // Optional file (paymentReceipt) - only append when provided and not for withdrawals without a file
  const maybeFile = (payload as any).paymentReceipt;
  if (maybeFile) {
    // If it's a File (from input), append directly; if it's a string (URL), append as-is
    if (typeof maybeFile === "string") {
      formData.append("paymentReceipt", maybeFile);
    } else if (maybeFile instanceof File) {
      formData.append("paymentReceipt", maybeFile);
    }
  }

  const res = await fetch("/api/admin/financials/transaction", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw data;

  return data;
};

export const getMembersHistoryFn = async ({
  page = 1,
  limit = 10,
  status,
  type = "",
  startDate,
  endDate,
}: MemberPaymentHistoryParams & {
  startDate?: string;
  endDate?: string;
}): Promise<MembersPaymentHistoryApiResponse> => {
  const params = new URLSearchParams();
  // ❌ STATUS REMOVED - Not sending status to API
  // if (status === "") {
  //   params.set("status", "all");
  // } else if (typeof status === "string") {
  //   params.set("status", status);
  // }
  if (type && type !== "savings") {
    params.set("type", type);
  }
  if (startDate) {
    params.set("startDate", startDate);
  }
  if (endDate) {
    params.set("endDate", endDate);
  }
  params.set("page", String(page + 1));
  params.set("limit", String(limit));

  const finalUrl = `/api/admin/records/history?${params.toString()}`;

  // 🔍 DEBUG LOGGING - Exact payload that would be sent to backend
  console.log("📤 [API HELPER] getMembersHistoryFn - Payload Prepared:", {
    inputParams: { page, limit, status, type, startDate, endDate },
    urlSearchParams: Object.fromEntries(params.entries()),
    finalUrl,
    timestamp: new Date().toISOString(),
  });

  // ✅ BACKEND CALL ENABLED - Making network request
  console.log("🌐 [API HELPER] Initiating network request...");
  const res = await fetch(finalUrl);
  const data = await res.json();

  // 📥 LOG COMPLETE BACKEND RESPONSE
  console.log("📥 [API HELPER] Backend Response Received:", {
    status: res.status,
    ok: res.ok,
    statusText: res.statusText,
    responseData: data,
    responseStructure: {
      hasPayments: !!data?.payments,
      paymentsCount: data?.payments?.length || 0,
      total: data?.total,
      page: data?.page,
      limit: data?.limit,
      totalPages: data?.totalPages,
    },
    timestamp: new Date().toISOString(),
  });

  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    console.error("❌ [API HELPER] Request failed:", msg);
    throw new Error(msg);
  }

  // ✅ RETURNING ACTUAL DATA - UI will now populate
  console.log("✅ [API HELPER] Returning actual data to populate UI");
  return data;
};

export const getMembersBalanceFn = async () => {
  const res = await fetch(`/api/admin/records/balance`, { cache: "no-store" });

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

export const getMembersLoanEligibilityFn = async () => {
  const res = await fetch(`/api/admin/records/loanEligibility`, { cache: "no-store" });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse loan eligibility response");
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      (Array.isArray(data.errors) ? data.errors.join(", ") : data.message) ||
      "An unknown error occured";
    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }
  return data;
};

// export const generateMemberStatementFn, please create this here

export const generateMemberStatementFn = async (
  params: GenerateMemberStatementParams
): Promise<GenerateStatementResponse> => {
  const search = new URLSearchParams();
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.type) search.set("type", params.type);
  if (typeof params.status !== "undefined" && params.status !== null && params.status !== "")
    search.set("status", params.status as string);
  if (params.exportType) search.set("exportType", params.exportType);

  const finalUrl = `/api/admin/records/memberStatement?${search.toString()}`;

  // Initiate request to proxy route which will stream the file back
  const res = await fetch(finalUrl);

  if (!res.ok) {
    let errData: any = null;
    try {
      errData = await res.json();
    } catch (_) {}
    const msg = errData?.message || errData?.error || `Failed to generate statement (status ${res.status})`;
    throw new Error(msg);
  }

  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || undefined;
  const disposition = res.headers.get("content-disposition") || "";
  let filename: string | undefined;
  const match = disposition.match(/filename\*?=\s*(?:UTF-8''?)?"?([^";]+)"?/i);
  if (match) filename = decodeURIComponent(match[1]);
  else filename = params.exportType === "csv" ? "statement.csv" : "statement.pdf";

  const blob = new Blob([arrayBuffer], {
    type: contentType || (params.exportType === "csv" ? "text/csv" : "application/pdf"),
  });

  return { blob, filename, contentType };
};

// Get Member Profile
export const getMemberProfileFn = async (): Promise<MemberProfileResponse> => {
  const res = await fetch("/api/admin/records/memberProfile");

  if (!res.ok) {
    let errData: any = null;
    try {
      errData = await res.json();
    } catch (_) {}
    const msg = errData?.message || errData?.error || `Failed to fetch member profile (status ${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  return data;
};

// Update Member Profile
export const updateMemberProfileFn = async (
  params: UpdateMemberProfileParams
): Promise<UpdateMemberProfileResponse> => {
  const res = await fetch("/api/admin/records/memberProfile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let errData: any = null;
    try {
      errData = await res.json();
    } catch (_) {}
    const msg = errData?.message || errData?.error || `Failed to update member profile (status ${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  return data;
};

// export const getMemberSummaryFn, generate me here
