import { ApproveRejectPayload, ApproveRejectResponse, MemberParams, MembersApiResponse } from "@/types/types";

export const getAllMembersFn = async ({
  page = 1,
  limit = 5,
  orgId,
  status = "",
}: MemberParams): Promise<MembersApiResponse> => {
  const res = await fetch(`/api/fetchMembers?orgId=${orgId}&page=${page + 1}&limit=${limit}&status=${status}`);

  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";
    throw new Error(msg);
  }
  return data;
};

export const approveOrRejectMembersFn = async (payload: ApproveRejectPayload): Promise<ApproveRejectResponse> => {
  const res = await fetch("/api/approveMember", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data.message || "An unknown error occurred";
    throw new Error(msg);
  }
  return data;
};
