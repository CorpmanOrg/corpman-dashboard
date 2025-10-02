"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { emailVerifyFn } from "@/utils/ApiFactory/auth";

export default function EmailVerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const { mutate, data, isPending, error, isSuccess } = useMutation({
    mutationFn: emailVerifyFn,
    onSuccess: () => {
      setTimeout(() => {
        router.push("/auth?mode=signin");
      });
    },
    onError: (error: any) => {
      // console.log("From error: ", error);
    },
  });

  useEffect(() => {
    if (token) {
      mutate({ token });
    }
  }, [token]);

  return (
    <div>
      <div>My Yaz EmailVerify</div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Verifying Your Email...</h1>
        {isPending && <p className="mt-4 text-blue-500">Processing verification...</p>}
        {isSuccess && <p className="mt-4 text-green-600">Email verified! Redirecting to Sign In...</p>}
        {error && <p className="mt-4 text-red-600">Error: {(error as Error).message}</p>}
      </div>
    </div>
  );
}
