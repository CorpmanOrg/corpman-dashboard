import { ErrorResponse, SettingsFormValues, GetSettingsSuccessResponse, ApiErrorResponse } from "@/types/types";

export const updateSettingsFn = async (payload: SettingsFormValues, orgId: string): Promise<ErrorResponse> => {
  const url = `/api/admin/settings/updateSettings?orgId=${encodeURIComponent(orgId)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Failed to parse response (Status: ${res.status}). The server may not be responding correctly.`);
  }

  if (!res.ok) {
    const msg = Array.isArray(data.errors)
      ? data.errors.join(", ")
      : data.message || data.error || "An unknown error occurred";
    throw new Error(msg);
  }
  return data;
};

export const getSettingsFn = async (orgId: string): Promise<GetSettingsSuccessResponse> => {
  const url = `/api/admin/settings/getSettings?orgId=${encodeURIComponent(orgId)}`;
  const res = await fetch(url, { method: "GET" });

  let data: any = null;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Failed to parse settings response");
  }

  if (!res.ok) {
    const apiErr = data as ApiErrorResponse | null;
    const msg = apiErr?.message || "Failed to fetch settings";
    throw new Error(msg);
  }

  return data as GetSettingsSuccessResponse;
};
