import { Suspense } from "react";
import VerifyResetOtpClient from "./VerifyResetOtpClient";

export default function VerifyResetOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyResetOtpClient />
    </Suspense>
  );
}
