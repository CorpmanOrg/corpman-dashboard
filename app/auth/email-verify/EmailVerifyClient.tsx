"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import { otpFormSchema } from "@/utils/Yup/otpSchema";
import { ToastSeverity, ToastState } from "@/types/types";
import { resendOtpFn, verifyOtpFn } from "@/utils/ApiFactory/auth";
import OtpCodeInput from "@/components/common/OtpCodeInput";
import Toastbar from "@/components/Toastbar";

type FormValues = {
  otp: string;
};

const RESEND_SECONDS = 30;

export default function EmailVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email") || "";
  const token = searchParams?.get("token") || ""; // kept for future flexibility

  const [resendCountdown, setResendCountdown] = useState(0);

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

  const { mutate: verifyMutate, isPending, isSuccess, error } = useMutation({
    mutationFn: verifyOtpFn,
    onSuccess: (res: any) => {
      showToast("success", res?.message || "Email verified successfully ✅");
      setTimeout(() => {
        router.push("/auth?mode=signin");
      }, 1200);
    },
    onError: (err: any) => {
      showToast("error", err?.message || "OTP verification failed");
    },
  });

  const { mutate: resendMutate, isPending: isResending } = useMutation({
    mutationFn: resendOtpFn,
    onSuccess: (res: any) => {
      setResendCountdown(RESEND_SECONDS);
      showToast("success", res?.message || "OTP resent successfully ✅");
    },
    onError: (err: any) => {
      showToast("error", err?.message || "Failed to resend OTP");
    },
  });

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleResendClick = () => {
    if (!email) {
      showToast("error", "Missing email in verification link.");
      return;
    }

    resendMutate({ email });
  };

  const canResend = !isPending && !isResending && !!email && resendCountdown === 0;

  const statusMessage = useMemo(() => {
    if (!email) return "Missing email in URL. Open the verification link from your email.";
    if (isPending) return "Processing verification...";
    if (isSuccess) return "Email verified successfully. Redirecting...";
    if (error) return (error as Error).message || "Verification failed.";
    return "Enter the 6-digit code sent to your email.";
  }, [email, isPending, isSuccess, error]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3FFF460] flex items-center justify-center px-4">
      <div className="pointer-events-none absolute top-0 right-0 h-[340px] w-[340px] rounded-bl-[100%] bg-gradient-to-r from-lime-400 to-green-600 opacity-80" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-[260px] w-[260px] rounded-full bg-green-200/70 blur-3xl" />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-green-100 bg-white/95 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
        <p className="mt-2 text-sm text-gray-600">{statusMessage}</p>

        <Formik<FormValues>
          initialValues={{ otp: "" }}
          validationSchema={otpFormSchema(6)}
          onSubmit={(values) => {
            if (!email) {
              showToast("error", "Missing email in verification link.");
              return;
            }

            verifyMutate({ email, otp: values.otp });
          }}
        >
          {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
            <Form className="mt-6">
              <OtpCodeInput
                value={values.otp}
                onChange={(next) => setFieldValue("otp", next)}
                onBlur={() => setFieldTouched("otp", true)}
                onComplete={() => submitForm()}
                disabled={isPending || isSuccess || !email}
                error={touched.otp ? errors.otp : undefined}
              />

              <button
                type="submit"
                disabled={isPending || isSuccess || !email}
                className="mt-6 w-full rounded-md bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Verifying..." : "Verify Email"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-600">Didn’t get the code?</span>
                <button
                  type="button"
                  onClick={handleResendClick}
                  disabled={!canResend}
                  className="font-semibold text-green-700 transition hover:text-green-800 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {isResending
                    ? "Sending..."
                    : canResend
                    ? "Resend OTP"
                    : `Resend in ${resendCountdown}s`}
                </button>
              </div>
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
