"use client";

import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toastbar from "@/components/Toastbar";
import { ToastSeverity, ToastState } from "@/types/types";
import { resetPasswordFn } from "@/utils/ApiFactory/auth";

type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) =>
    setToast({ open: true, severity, message });

  const handleCloseToast = () =>
    setToast((prev) => ({
      ...prev,
      open: false,
    }));

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordFn,
    onSuccess: (res: any) => {
      showToast("success", res?.message || "Password reset successful ✅");
      setTimeout(() => {
        router.push("/auth?mode=signin");
      }, 900);
    },
    onError: (err: any) => {
      showToast("error", err?.message || "Failed to reset password");
    },
  });

  const helperText = useMemo(() => {
    if (!email || !otp) return "Missing email/otp in URL. Restart password reset flow.";
    return "Create a new password for your account.";
  }, [email, otp]);

  return (
    <main className="w-full">
      <section className="w-full max-w-md mx-auto rounded-2xl border border-green-100 bg-white/95 p-5 sm:p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Reset Password</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">{helperText}</p>

        <Formik<FormValues>
          initialValues={{ password: "", confirmPassword: "" }}
          validate={(values) => {
            const errors: Partial<FormValues> = {};

            if (!values.password) {
              errors.password = "New password is required";
            } else if (values.password.length < 6) {
              errors.password = "Password must be at least 6 characters";
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = "Confirm your new password";
            } else if (values.confirmPassword !== values.password) {
              errors.confirmPassword = "Passwords do not match";
            }

            return errors;
          }}
          onSubmit={(values) => {
            if (!email || !otp) {
              showToast("error", "Missing email/otp in reset link.");
              return;
            }

            mutate({
              email,
              otp,
              newPassword: values.password,
            });
          }}
        >
          {(formik) => (
            <Form className="mt-6 space-y-4">
              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="New Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                ) : null}
              </div>

              <div>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
                  }
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={isPending || !email || !otp}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </Form>
          )}
        </Formik>
      </section>

      <Toastbar
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </main>
  );
}
