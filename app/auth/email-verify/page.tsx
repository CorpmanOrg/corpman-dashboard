import React, { Suspense } from "react";
import EmailVerifyClient from "./EmailVerifyClient";

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerifyClient />
    </Suspense>
  );
}
