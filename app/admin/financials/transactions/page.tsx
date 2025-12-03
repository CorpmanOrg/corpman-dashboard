"use client";

import React, { useState } from "react";
import RadioInput from "@/components/reuseable/RadioInput";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Toastbar from "@/components/Toastbar";
import MemberContributionForm from "@/components/Contributions/MemberContributionForm";
import PaymentModal from "@/components/Payments/PaymentModal";
import { ToastSeverity, ToastState } from "@/types/types";
import { PaymentData } from "@/types/payment.types";

export default function Transactions() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [resetSignal, setResetSignal] = useState<number>(0);
  const [errorResetSignal, setErrorResetSignal] = useState<number>(0);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<PaymentData | undefined>(undefined);

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

  const handleCloseToast = () => {
    setToast((prevS) => ({
      ...prevS,
      open: false,
    }));
  };

  const allowedTypes = ["contribution", "savings", "loan"] as const;
  type ModuleType = (typeof allowedTypes)[number];
  const safeSelectedType = allowedTypes.includes(selectedType as ModuleType) ? (selectedType as ModuleType) : undefined;

  /**
   * Handle form submission by opening the Payment Modal
   * instead of calling the API directly
   */
  const handleFormSubmit = (payload: any) => {
    // Prepare payment data for the modal
    const paymentData: PaymentData = {
      amount: payload.amount,
      description: payload.description,
      type: payload.type,
      // Add any other relevant data the modal might need
    };

    setPendingPaymentData(paymentData);
    setIsPaymentModalOpen(true);
  };

  /**
   * Handle payment modal close
   */
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPendingPaymentData(undefined);
  };

  return (
    <Card className="w-full h-full shadow-md bg-white hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600 px-0 sm:px-0">
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50 px-6">
        <CardTitle className="text-lg font-bold text-[#0e4430] dark:text-green-400">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8 overflow-auto h-full">
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
          Select the type of transaction you want to perform
        </p>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RadioInput
            name="transactionType"
            value="contribution"
            label="Contribution"
            checked={selectedType === "contribution"}
            onChange={() => setSelectedType("contribution")}
          />
          <RadioInput
            name="transactionType"
            value="savings"
            label="Savings"
            checked={selectedType === "savings"}
            onChange={() => setSelectedType("savings")}
          />
          <RadioInput
            name="transactionType"
            value="loan"
            label="Loans"
            checked={selectedType === "loan"}
            onChange={() => setSelectedType("loan")}
          />
        </div>
        {safeSelectedType && (
          <div className="mt-8">
            <MemberContributionForm
              moduleType={safeSelectedType}
              onSubmit={handleFormSubmit}
              resetSignal={resetSignal}
              isLoading={false}
              errorResetSignal={errorResetSignal}
            />
          </div>
        )}
      </CardContent>

      {/* Payment Modal */}
      <PaymentModal isOpen={isPaymentModalOpen} onClose={handleClosePaymentModal} paymentData={pendingPaymentData} />
    </Card>
  );
}
