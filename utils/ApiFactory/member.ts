import { StorageUtil } from "../StorageUtil";

export const getAllMembersFn = async (page = 1, limit = 5, status = "") => {
  const res = await fetch(`api/v1/organizations/:orgId/members?page=${page}&limit=${limit}&status=${status}`);
  const data = await res.json();

  if (!res.ok) {
    const msg = Array.isArray(data.errors) ? data.errors.join(", ") : data.message || "An unknown error occured";

    throw new Error(msg);
  }
  return data;
};
