"use client";

import { useMemo, useState } from "react";
import { Formik, Form } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import OtpCodeInput from "@/components/common/OtpCodeInput";
import Toastbar from "@/components/Toastbar";
import { ToastSeverity, ToastState } from "@/types/types";
import { otpFormSchema } from "@/utils/Yup/otpSchema";
import { verifyResetOtpFn } from "@/utils/ApiFactory/auth";

type FormValues = {
  otp: string;
};

export default function VerifyResetOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

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
    mutationFn: verifyResetOtpFn,
    onSuccess: (res: any, vars) => {
      showToast("success", res?.message || "OTP verified successfully ✅");
      setTimeout(() => {
        router.push(
          `/auth/reset-password?email=${encodeURIComponent(vars.email)}&otp=${encodeURIComponent(vars.otp)}`
        );
      }, 800);
    },
    onError: (err: any) => {
      showToast("error", err?.message || "Invalid or expired OTP");
    },
  });

  const helperText = useMemo(() => {
    if (!email) return "Missing email in URL. Go back and request reset code again.";
    return "Enter the 6-digit code sent to your email.";
  }, [email]);

  return (
    <main className="w-full">
      <section className="w-full max-w-md mx-auto rounded-2xl border border-green-100 bg-white/95 p-5 sm:p-8 shadow-xl backdrop-blur">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Verify Reset OTP</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">{helperText}</p>

        <Formik<FormValues>
          initialValues={{ otp: "" }}
          validationSchema={otpFormSchema(6)}
          onSubmit={(values) => {
            if (!email) {
              showToast("error", "Missing email in reset link.");
              return;
            }

            mutate({ email, otp: values.otp });
          }}
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
            <Form className="mt-6">
              <OtpCodeInput
                value={values.otp}
                onChange={(next) => setFieldValue("otp", next)}
                onBlur={() => setFieldTouched("otp", true)}
                onComplete={() => submitForm()}
                disabled={isPending || !email}
                error={touched.otp ? errors.otp : undefined}
              />

              <Button
                type="submit"
                disabled={isPending || !email}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Verifying..." : "Verify Code"}
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
