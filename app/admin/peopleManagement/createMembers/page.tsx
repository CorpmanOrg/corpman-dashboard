"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Users, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createSingleMemberFn, createBulkMembersFn } from "@/utils/ApiFactory/admin";
import { extractErrorMessage } from "@/utils/handleAppErr";
import { CreateMemberPayload, CreateMemberResponse, ToastState, ToastSeverity } from "@/types/types";
import Toastbar from "@/components/Toastbar";
import * as Yup from "yup";

const TABS = ["Single Creation", "Bulk Creation"];

// Validation Schema
const createMemberSchema = Yup.object().shape({
  surname: Yup.string().required("Surname is required"),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string().required("Middle name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  address: Yup.string().required("Address is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  stateOfOrigin: Yup.string().required("State of origin is required"),
  LGA: Yup.string().required("LGA is required"),
  maritalStatus: Yup.string().required("Marital status is required"),
  residentialAddress: Yup.string().required("Residential address is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  employer: Yup.string().required("Employer is required"),
  annualIncome: Yup.number().positive("Must be positive").required("Annual income is required"),
  monthlyContribution: Yup.number().positive("Must be positive").required("Monthly contribution is required"),
  nextOfKin: Yup.string().required("Next of kin is required"),
  nextOfKinRelationship: Yup.string().required("Next of kin relationship is required"),
  nextOfKinAddress: Yup.string().required("Next of kin address is required"),
});

// Initial form values
const initialFormValues = {
  surname: "",
  firstName: "",
  middleName: "",
  email: "",
  password: "",
  address: "",
  dateOfBirth: "",
  stateOfOrigin: "",
  LGA: "",
  maritalStatus: "",
  residentialAddress: "",
  mobileNumber: "",
  employer: "",
  annualIncome: 0,
  monthlyContribution: 0,
  nextOfKin: "",
  nextOfKinRelationship: "",
  nextOfKinAddress: "",
};

export default function CreateMembersPage() {
  const [activeTab, setActiveTab] = useState("Single Creation");
  const { activeOrgId } = useAuth();

  // Toast state
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
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Single member creation mutation
  const singleMemberMutation = useMutation<CreateMemberResponse, unknown, CreateMemberPayload>({
    mutationFn: createSingleMemberFn,
    onSuccess: (data) => {
      showToast("success", data.message || "Member created successfully! ✅");
      formik.resetForm();
    },
    onError: (error) => {
      console.log("Single member creation error: ", error);
      // Support different error shapes: use centralized extractor
      const anyErr = error as any;
      const msg = extractErrorMessage(anyErr);
      showToast("error", msg);
    },
  });

  // Single member form
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: createMemberSchema,
    onSubmit: (values) => {
      if (!activeOrgId) {
        showToast("error", "Organization ID not found. Please log in again.");
        return;
      }

      const payload: CreateMemberPayload = {
        organizationId: activeOrgId,
        ...values,
      };

      singleMemberMutation.mutate(payload);
    },
  });

  // CSV Template Download Function
  const downloadCSVTemplate = () => {
    // Define the CSV headers matching the CreateMemberPayload structure
    const headers = [
      "surname",
      "firstName",
      "middleName",
      "email",
      "password",
      "address",
      "dateOfBirth",
      "stateOfOrigin",
      "LGA",
      "maritalStatus",
      "residentialAddress",
      "mobileNumber",
      "employer",
      "annualIncome",
      "monthlyContribution",
      "nextOfKin",
      "nextOfKinRelationship",
      "nextOfKinAddress",
    ];

    // Sample data row to show format
    const sampleData = [
      "Doe",
      "John",
      "Michael",
      "john.doe@example.com",
      "securePassword123",
      "123 Main Street, City",
      "1990-01-15",
      "Lagos",
      "Ikeja",
      "Single",
      "456 Residential Ave, Lagos",
      "+2348012345678",
      "Tech Corp Ltd",
      "1200000",
      "25000",
      "Jane Doe",
      "Sister",
      "789 Family Road, Lagos",
    ];

    // Create CSV content
    const csvContent = [
      headers.join(","),
      sampleData.join(","),
      // Add an empty row for users to fill
      new Array(headers.length).fill("").join(","),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "member_creation_template.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    showToast("success", "CSV template downloaded successfully! 📊");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Toast Notifications */}
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />

      <div className="px-6 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Members</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add new members to your organization individually or in bulk
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>Admin Only</span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-lg border-t-4 border-t-green-500 dark:border-t-green-600">
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="text-lg font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Member Creation Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`px-6 py-3 font-medium focus:outline-none transition-colors duration-200 border-b-2 flex items-center gap-2 ${
                    activeTab === tab
                      ? "border-green-600 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "Single Creation" ? <UserPlus className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "Single Creation" && (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-green-600" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        name="surname"
                        placeholder="Surname"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="middleName"
                        placeholder="Middle Name"
                        value={formik.values.middleName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="dateOfBirth"
                        type="date"
                        placeholder="Date of Birth"
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={formik.values.mobileNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="maritalStatus"
                        placeholder="Marital Status"
                        value={formik.values.maritalStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                    </div>
                  </div>

                  {/* Location Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name="stateOfOrigin"
                        placeholder="State of Origin"
                        value={formik.values.stateOfOrigin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="LGA"
                        placeholder="LGA"
                        value={formik.values.LGA}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="address"
                        placeholder="Address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                        className="md:col-span-2"
                      />
                      <Input
                        name="residentialAddress"
                        placeholder="Residential Address"
                        value={formik.values.residentialAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Employment & Financial Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Employment & Financial Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        name="employer"
                        placeholder="Employer"
                        value={formik.values.employer}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="annualIncome"
                        type="number"
                        placeholder="Annual Income"
                        value={formik.values.annualIncome}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="monthlyContribution"
                        type="number"
                        placeholder="Monthly Contribution"
                        value={formik.values.monthlyContribution}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                    </div>
                  </div>

                  {/* Next of Kin Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Next of Kin Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name="nextOfKin"
                        placeholder="Next of Kin Name"
                        value={formik.values.nextOfKin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="nextOfKinRelationship"
                        placeholder="Relationship"
                        value={formik.values.nextOfKinRelationship}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                      />
                      <Input
                        name="nextOfKinAddress"
                        placeholder="Next of Kin Address"
                        value={formik.values.nextOfKinAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        formik={formik}
                        className="md:col-span-2"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      disabled={singleMemberMutation.status === "pending" || !formik.isValid}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2"
                    >
                      {singleMemberMutation.status === "pending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating Member...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Create Member
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "Bulk Creation" && (
                <div className="space-y-6">
                  {/* CSV Upload Area */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload CSV File</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Select a CSV file containing member data to create multiple members at once
                    </p>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                      <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                      <label
                        htmlFor="csv-upload"
                        className="cursor-pointer inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Choose CSV File
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Or drag and drop your CSV file here
                      </p>
                    </div>
                  </div>

                  {/* Template Download */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Download CSV Template
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Download the template file to see the required format and column headers
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        onClick={downloadCSVTemplate}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">📋 Instructions</h3>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                      <li>• Download the CSV template above to ensure correct formatting</li>
                      <li>• Template includes sample data showing the expected format</li>
                      <li>• Fill in all required fields for each member</li>
                      <li>• Ensure email addresses are unique and valid</li>
                      <li>• Date format should be YYYY-MM-DD (e.g., 1990-01-15)</li>
                      <li>• Numeric values: annualIncome and monthlyContribution (no commas)</li>
                      <li>• All members will be created with pending status</li>
                      <li>• Password must be at least 6 characters</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      🚧 Full CSV processing functionality coming soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
