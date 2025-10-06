"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { resendEmailFn } from "@/utils/ApiFactory/auth";
import { AxiosError } from "axios";

interface EmailProps {
  formik: any;
}

const EmailVerification = ({ formik }: EmailProps) => {

  const {mutate: resendEmail, isPending} = useMutation({
    mutationFn: resendEmailFn,
    onSuccess: (data) => {
      // console.log("From Resend Email Onsuccess: ", data)
    },
    onError: (error: AxiosError) => {
      // console.log("From Resend Onerror: ", error)
    }
  })

  const handleClick = () => {
    resendEmail({email: formik?.values?.email});
  };
  return (
    <div>
      <div className="text-center">
        <p className="text-lg mb-4">Please verify your email</p>
        <p className="mb-4">
          Congratulations !!!🎉🎉, we just sent an email to{" "}
          <span className="font-bold">{formik?.values?.email || "abc@email.com"}.</span> Click the link in your email to
          verify your account
        </p>
        <div>
          <Button type="button" onClick={handleClick}>Resend Email</Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
