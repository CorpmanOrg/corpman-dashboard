"use client";

import React, { useState } from "react";
import RadioInput from "@/components/reuseable/RadioInput";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MemberContributionForm from "@/components/Contributions/MemberContributionForm";
import { MemberContributionInitialValues } from "@/components/assets/data";
import { MemberContributionSchema } from "@/utils/Yup/schema";

export default function Transactions() {
  const [selectedType, setSelectedType] = useState<string>("");

  const allowedTypes = ["contribution", "savings", "loan"] as const;
  type ModuleType = (typeof allowedTypes)[number];
  const safeSelectedType = allowedTypes.includes(selectedType as ModuleType) ? (selectedType as ModuleType) : undefined;

  return (
    <Card className="w-full h-full shadow-md bg-white hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600 px-0 sm:px-0">
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
              initialValues={MemberContributionInitialValues}
              validationSchema={MemberContributionSchema}
              onSubmit={(payload) => {
                // handle form submission here
                console.log("Submitted payload:", payload);
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
