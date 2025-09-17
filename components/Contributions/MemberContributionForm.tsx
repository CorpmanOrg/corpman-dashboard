import React, { useState } from "react";
import { useFormik } from "formik";
import { Input } from "../ui/input";
import FileUpload from "../reuseable/FileUpload";

const TABS = ["Deposit", "Withdrawal"];

type MemberContributionFormProps = {
  moduleType?: "savings" | "contribution" | "loan" | "statement" | "updateProfile" | "disputeResolution";
  initialValues: any;
  validationSchema: any;
  onSubmit?: (payload: any) => void;
};

const MemberContributionForm = ({
  moduleType = "contribution",
  initialValues,
  validationSchema,
  onSubmit = () => {},
}: MemberContributionFormProps) => {
  const [activeTab, setActiveTab] = useState("Deposit");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const type = `${moduleType}_${activeTab.toLowerCase()}`; // e.g. 'savings_deposit'
      const payload = {
        ...values,
        type,
      };
      if (onSubmit) {
        onSubmit(payload);
      } else {
        console.log(payload);
      }
    },
  });

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
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        {activeTab === "Deposit" && (
          <div className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4">
            <Input formik={formik} name="amount" type="number" placeholder="Enter amount" />
            <Input formik={formik} name="description" type="text" placeholder="Description" />
            <div className="md:col-span-2">
              <FileUpload formik={formik} name="payment_receipt" />
            </div>
          </div>
        )}
        {activeTab === "Withdrawal" && (
          <div className="flex flex-col gap-y-4 md:grid md:grid-cols-2 md:gap-4">
            <Input formik={formik} name="amount" type="number" placeholder="Withdrawal amount" />
            <Input formik={formik} name="description" type="text" placeholder="Withdrawal description" />
            {/* You can add more fields for withdrawal if needed */}
          </div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-6 w-full"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting
            ? moduleType === "loan"
              ? "Processing..."
              : "Submitting..."
            : moduleType === "loan"
            ? "Process Loans"
            : `Submit ${activeTab}`}
        </button>
      </form>
    </div>
  );
};

export default MemberContributionForm;
