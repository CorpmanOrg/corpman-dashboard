import { StorageUtil } from "../StorageUtil";

export const logUserOut = async () => {
  try {
    // 🔒 CRITICAL: Set logout flag and clear localStorage FIRST
    if (typeof window !== "undefined") {
      // Set flag to prevent any writes back to localStorage
      sessionStorage.setItem("__logging_out", "true");

      // Clear localStorage immediately
      localStorage.removeItem("activeContext");
      localStorage.removeItem("activeOrgId");
      localStorage.clear();
    }

    // Clear specific session items (NOT sessionStorage.clear() - that would clear our flag!)
    StorageUtil.removeSessionItem("logData");
    // Don't call clearSessionItem() here - it clears ALL sessionStorage including our flag!

    // Make logout API call (cookie deletion)
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    // Force immediate redirect without allowing React to re-render
    window.location.replace("/auth?mode=signin");
  } catch (error) {
    console.error("From Logout-Function: ", error);
    // Even on error, force logout
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.replace("/auth?mode=signin");
    }
  }
};
