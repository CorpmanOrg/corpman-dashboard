import Axios from "../axios";
import { StorageUtil } from "../StorageUtil";

interface signUp {
  name: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

interface resendEmail {
  email: string;
}

export const signupFn = async (payload: signUp) => {
  const res = await Axios.post("/auth/register-org", payload);
  return res;
};

export const loginFn = async (payload: { email: string; password: string }) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
};

export const resendEmailFn = async (payload: resendEmail) => {
  const res = await fetch("/api/resendVerification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Resend email failed");
  }

  return data;
};

export const emailVerifyFn = async ({ token }: { token: string }) => {
  const res = await fetch("/api/emailVerify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Email verification failed");
  }
  return data;
};

export const logoutFn = async () => {
  await fetch("/api/logout", {
    method: "POST",
  });
  StorageUtil.removeSessionItem("logData");
  StorageUtil.clearSessionItem()
  window.location.assign("/auth?mode=signin");
};
