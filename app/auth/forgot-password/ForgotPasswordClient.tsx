"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toastbar from "@/components/Toastbar";
import { ToastSeverity, ToastState } from "@/types/types";
import { forgotPasswordFn } from "@/utils/ApiFactory/auth";

type FormValues = {
  email: string;
};

export default function ForgotPasswordClient() {
  const router = useRouter();

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
    mutationFn: forgotPasswordFn,
    onSuccess: (res: any, vars) => {
      showToast("success", res?.message || "Reset code sent successfully ✅");
      setTimeout(() => {
        router.push(`/auth/verify-reset-otp?email=${encodeURIComponent(vars.email)}`);
      }, 800);
    },
    onError: (err: any) => {
      showToast("error", err?.message || "Failed to send reset code");
    },
  });

  return (
    <main className="w-full">
      <section className="w-full max-w-md mx-auto rounded-2xl border border-green-100 bg-white/95 p-5 sm:p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Forgot Password</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Enter your email to receive a reset code.</p>

        <Formik<FormValues>
          initialValues={{ email: "" }}
          validate={(values) => {
            const errors: Partial<FormValues> = {};
            if (!values.email) {
              errors.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
              errors.email = "Enter a valid email";
            }
            return errors;
          }}
          onSubmit={(values) => {
            mutate({ email: values.email.trim() });
          }}
        >
          {(formik) => (
            <Form className="mt-6 space-y-4">
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={!formik.values.email || !formik.isValid || isPending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending..." : "Send Reset Code"}
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
