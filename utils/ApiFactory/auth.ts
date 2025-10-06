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
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Create a more detailed error object that works with your error handler
      const error = new Error(data.error || "Login failed") as any;

      // Add response structure that your error handler expects
      error.response = {
        status: res.status,
        data: {
          message: data.error || "Login failed",
          payload: {
            responseMessage: data.error || "Invalid credentials provided",
          },
        },
      };

      // Add additional context for better error handling
      error.status = res.status;
      error.code = data.code || "LOGIN_FAILED";

      throw error;
    }

    return data;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error instanceof Error && (error as any).response) {
      throw error;
    }

    // Handle network errors with structure your error handler expects
    const networkError = new Error("Network error. Please check your connection and try again.") as any;
    networkError.message = "Network Error";
    networkError.response = {
      status: 0,
      data: {
        message: "Network error. Please check your connection and try again.",
      },
    };

    throw networkError;
  }
};

export const resendEmailFn = async (payload: resendEmail) => {
  try {
    const res = await fetch("/api/resendVerification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || "Resend email failed");
      (error as any).status = res.status;
      (error as any).code = data.code || "RESEND_FAILED";
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error && (error as any).status) {
      throw error;
    }
    throw new Error("Network error. Please check your connection and try again.");
  }
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
  StorageUtil.clearSessionItem();
  window.location.assign("/auth");
};
