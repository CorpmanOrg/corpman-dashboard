import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../reuseable/FileUpload";
import { DepositSchema, WithdrawalSchema } from "@/utils/Yup/schema";
import { memberPaymentFn } from "@/utils/ApiFactory/member";
import { toast } from "@/hooks/use-toast";
import { depositInitialValues, withdrawalInitialValues } from "../assets/data";

const TABS = ["Deposit", "Withdrawal"];

type MemberContributionFormProps = {
  moduleType?: "savings" | "contribution" | "loan" | "statement" | "updateProfile" | "disputeResolution";
  onSubmit?: (payload: any) => void;
  resetSignal?: number; // 👈 new prop to trigger form reset
  isLoading?: boolean; // 👈 external loading state control
  errorResetSignal?: number; // 👈 new prop to trigger error state reset
};

const MemberContributionForm = ({
  moduleType = "contribution",
  onSubmit = () => {},
  resetSignal = 0, // 👈 default value
  isLoading = false, // 👈 external loading control
  errorResetSignal = 0, // 👈 error reset signal
}: MemberContributionFormProps) => {
  const [activeTab, setActiveTab] = useState("Deposit");

  const getTransactionType = (moduleType: string, activeTab: string) => {
    if (moduleType === "loan") {
      if (activeTab === "Deposit") return "loan_repayment";
      if (activeTab === "Withdrawal") return "loan";
    }
    return `${moduleType}_${activeTab.toLowerCase()}`;
  };

  const formik = useFormik({
    initialValues: activeTab === "Deposit" ? depositInitialValues : withdrawalInitialValues,
    validationSchema: activeTab === "Deposit" ? DepositSchema : WithdrawalSchema, // 👈 swap schema
    enableReinitialize: true, // 👈 important so schema + initialValues reset when tab changes
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const type = getTransactionType(moduleType, activeTab);
      const payload = { ...values, type } as any;
      console.log("[MemberContributionForm] Submitting payload:", payload);

      try {
        setSubmitting(true);
        const res = await memberPaymentFn(payload);
        console.log("[MemberContributionForm] API success:", res);
        // Show toast using backend message and awaiting-approval derived from status
        const message = res?.message || "Payment submitted";
        const status = res?.status;
        const awaiting = status === "pending" ? "Your payment is awaiting approval." : "";
        toast({ title: message, description: awaiting, variant: "default" });
        onSubmit?.(res);
        // reset form to initial values for current tab
        resetForm({ values: activeTab === "Deposit" ? depositInitialValues : withdrawalInitialValues });
      } catch (err: any) {
        console.error("[MemberContributionForm] API error:", err);
        const errMsg = err?.message || (err?.response?.data?.message ?? "An error occurred");
        toast({ title: errMsg, variant: "destructive" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Deposit") {
      formik.resetForm({ values: depositInitialValues });
    } else {
      formik.resetForm({ values: withdrawalInitialValues });
    }
  };

  useEffect(() => {
    if (resetSignal > 0) {
      formik.resetForm({
        values: activeTab === "Deposit" ? depositInitialValues : withdrawalInitialValues,
      });
      formik.setSubmitting(false); // Ensure submitting state is reset
    }
  }, [resetSignal, activeTab]); // 👈 Removed formik from dependency array

  // Reset submitting state when external loading changes
  useEffect(() => {
    if (!isLoading && formik.isSubmitting) {
      formik.setSubmitting(false);
    }
  }, [isLoading]); // 👈 Removed formik from dependency array

  // Handle error reset signal - reset submitting state on error
  useEffect(() => {
    if (errorResetSignal > 0) {
      formik.setSubmitting(false);
    }
  }, [errorResetSignal]); // 👈 Removed formik from dependency array

  // console.log("MemberContributionForm User & Role: ", { formik });

  return (
    <div className="w-full max-w-md py-3 px-2 sm:px-4 h-full overflow-auto">
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700 h-full overflow-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2 font-medium focus:outline-none transition-colors duration-200 border-b-2 ${
              activeTab === tab
                ? "border-green-600 text-green-700 dark:text-green-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-green-600"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {/* {tab} */}
            {moduleType === "loan" && tab === "Deposit"
              ? "Loan Repayment"
              : moduleType === "loan" && tab === "Withdrawal"
              ? "New Loan"
              : tab}
          </button>
        ))}
      </div>
      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        {activeTab === "Deposit" && (
          <div className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4">
            <Input
              name="amount"
              type="number"
              placeholder="Enter amount"
              onChange={formik.handleChange}
              formik={formik}
            />
            <Input
              formik={formik}
              name="description"
              type="text"
              placeholder="Description"
              onChange={formik.handleChange}
            />
            <div className="md:col-span-2">
              <FileUpload formik={formik} name="paymentReceipt" labelText="Upload supporting file (optional)" />
            </div>
          </div>
        )}
        {activeTab === "Withdrawal" && (
          <div className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4">
            <Input
              formik={formik}
              name="amount"
              type="number"
              placeholder="Withdrawal amount"
              onChange={formik.handleChange}
            />
            <Input
              formik={formik}
              name="description"
              type="text"
              placeholder="Withdrawal description"
              onChange={formik.handleChange}
            />
            {/* Upload button hidden for withdrawals as per backend advice */}
            {/* You can add more fields for withdrawal if needed */}
          </div>
        )}
        <Button type="submit" className="mt-6 w-full" disabled={isLoading || formik.isSubmitting || !formik.isValid}>
          {isLoading || formik.isSubmitting
            ? moduleType === "loan"
              ? "Processing..."
              : "Submitting..."
            : moduleType === "loan"
            ? "Process Loans"
            : `Submit ${activeTab}`}
        </Button>
      </form>
    </div>
  );
};

export default MemberContributionForm;
