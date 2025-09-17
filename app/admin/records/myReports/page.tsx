"use client";

import React, { useState } from "react";
import RadioInput from "@/components/reuseable/RadioInput";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MemberContributionForm from "@/components/Contributions/MemberContributionForm";

import GenerateStatement from "./generateStatement";
import UpdateProfile from "./updateProfile";
import DisputeResolution from "./dispute";
import { MemberContributionInitialValues } from "@/components/assets/data";
import { MemberContributionSchema } from "@/utils/Yup/schema";

export default function MyReports() {
  const [selectedType, setSelectedType] = useState<string>("");

  const allowedTypes = ["statement", "updateProfile", "disputeResolution"] as const;
  type ModuleType = (typeof allowedTypes)[number];
  const safeSelectedType = allowedTypes.includes(selectedType as ModuleType) ? (selectedType as ModuleType) : undefined;

  return (
    <Card className="w-full min-h-screen shadow-md bg-white hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600 px-0 sm:px-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50 px-6">
        <CardTitle className="text-lg font-bold text-[#0e4430] dark:text-green-400">My Reports</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-8">
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
          Select the type of report you want to generate
        </p>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RadioInput
            name="reportType"
            value="statement"
            label="Generate Statement"
            checked={selectedType === "statement"}
            onChange={() => setSelectedType("statement")}
          />
          <RadioInput
            name="reportType"
            value="updateProfile"
            label="Update Profile"
            checked={selectedType === "updateProfile"}
            onChange={() => setSelectedType("updateProfile")}
          />
          <RadioInput
            name="reportType"
            value="disputeResolution"
            label="Dispute Resolution"
            checked={selectedType === "disputeResolution"}
            onChange={() => setSelectedType("disputeResolution")}
          />
        </div>
        {safeSelectedType && (
          <div className="mt-8">
            {safeSelectedType === "statement" ? (
              <GenerateStatement />
            ) : safeSelectedType === "updateProfile" ? (
              <UpdateProfile />
            ) : safeSelectedType === "disputeResolution" ? (
              <DisputeResolution />
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
