"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import { LoginInitialValues } from "../../../components/assets/data";
import { LoginSchema } from "@/utils/Yup/schema";
import { loginFn } from "@/utils/ApiFactory/auth";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { StorageUtil } from "@/utils/StorageUtil";
import Toastbar from "@/components/Toastbar";
import { ToastSeverity, ToastState } from "@/types/types";
import { createErrorHandler, shouldLogout } from "@/utils/handleAppErr";
import { useLoading } from "@/context/LoadingContext";

interface BackProps {
  flipBack: (val: boolean) => void;
}

const Signin = () => {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const { setLoading } = useLoading();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) => {
    setToast({
      open: true,
      severity,
      message,
    });
  };

  // Create your amazing error handler!
  const handleLoginError = createErrorHandler({
    showToast: (message, type) => {
      const severity = type === "error" ? "error" : "warning";
      showToast(severity, message);
    },
    onLogout: () => {
      // Handle forced logout if needed
      // console.log("Session expired - redirecting to login");
      // Could clear storage and redirect if needed
    },
    onRetry: () => {
      // console.log("Error suggests retry - user can try again");
    },
  });

  const handleCloseToast = () => {
    setToast((prevS) => ({
      ...prevS,
      open: false,
    }));
  };

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      try {
        setIsRedirecting(true);
        setLoading(true, "Preparing your dashboard...");

        // 🔒 Clear logout flag on successful login
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("__logging_out");
        }

        StorageUtil.setSessionItem("logData", data);
        showToast("success", "Login successful! Loading dashboard...");

        // Small delay to ensure smooth transition
        setTimeout(async () => {
          await refetchUser();
          router.push("/");
          // Loading will be cleared by the dashboard page or auth context
        }, 800);
      } catch (error) {
        console.error("Post-login error:", error);
        setIsRedirecting(false);
        setLoading(false);
        showToast("error", "Login successful, but there was an issue redirecting. Please refresh the page.");
      }
    },
    onError: (error: any) => {
      console.error("From Login Error: ", error);

      // Use your amazing error handler! 🎉
      const errorResult = handleLoginError(error);

      // Optional: Additional logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("Error Details:", {
          // type: errorResult.type,
          // shouldRetry: errorResult.shouldRetry,
          // status: errorResult.status,
          "error object": "error",
        });
      }
    },
  });

  // const handleBack = () => {
  //   flipBack(false);
  // };

  return (
    <>
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <div className="px-6">
        <h1 className="text-lg text-center text-gray-800 mb-1 font-bold">Sign In</h1>
        <p className="text-[#8D8D8D] text-sm text-center mb-10">Sign in with your correct credentials</p>

        <Formik
          initialValues={LoginInitialValues}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting }) => {
            try {
              loginUser(values);
            } catch (error) {
              console.error("Form submission error:", error);
              showToast("error", "An unexpected error occurred. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                <Input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Email"
                  className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="mt-[10px] space-y-2">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Password"
                  className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
                  appendIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                )}
              </div>

              <div className="mt-[25px]">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !formik.values.email || !formik.values.password || isPending || !formik.isValid || isRedirecting
                  }
                >
                  {isRedirecting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Loading Dashboard...
                    </div>
                  ) : isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Validating...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Signin;
