import { ErrorResponse, SettingsType } from "@/types/types";

export const updateSettingsFn = async (payload: SettingsType): Promise<ErrorResponse> => {
  const res = await fetch("/api/admin/settings/updateSettings", {
    method: "PATCH",
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
