import {
  ApproveRejectResponse,
  MemberParams,
  MembersApiResponse,
  deposit,
  withdrawal,
  MakePaymentRes,
  ErrorResponse,
} from "@/types/types";

// utils/ApiFactory/member.ts

export const memberPaymentFn = async (payload: deposit | (withdrawal & { type: string })): Promise<MakePaymentRes> => {
  const formData = new FormData();

  // Common fields
  formData.append("amount", payload.amount);
  formData.append("description", payload.description);
  formData.append("type", payload.type);

  // Only include file if it exists (Deposit case)
  if ("payment_receipt" in payload && payload.payment_receipt) {
    formData.append("paymentReceipt", payload.payment_receipt);
  }

  const res = await fetch("/api/admin/financials/transaction", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw data;

  return data;
};

export const getMembersHistoryFn = async ({ page = 1, limit = 10 }) => {
  const res = await fetch(`/api/admin/records/history?page=${page}&limit=${limit}`);

  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
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
