import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { emailVerifyFn } from "@/utils/ApiFactory/auth";
import EmailVerifyClient from "./EmailVerifyClient";

export default function EmailVerifyPage() {
  return (
    <Suspense>
      <EmailVerifyClient />
    </Suspense>
  );
}

// Removed the previous EmailVerifyPage component code as it's now in EmailVerifyClient
