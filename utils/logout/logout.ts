import { StorageUtil } from "../StorageUtil";

export const logUserOut = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // Ensures cookie is sent to server
    });

    StorageUtil.removeSessionItem("logData");
    StorageUtil.clearSessionItem();
    //   setUser(null);
    //   setUserLoggedData(null);
    //   setIsLoggedOut(true);

    window.location.href = "/auth?mode=signin";
  } catch (error) {
    console.error("From Logout-Function: ", error);
  }
};
