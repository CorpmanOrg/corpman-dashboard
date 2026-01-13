"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateMemberStatementFn } from "@/utils/ApiFactory/member";
import { generateOrganizationStatementFn } from "@/utils/ApiFactory/admin";
import { useMutation } from "@tanstack/react-query";
import { GenerateMemberStatementParams, GenerateStatementResponse } from "@/types/types";
import { Formik } from "formik";
import { MemberStatementSchema } from "@/utils/Yup/schema";
import { MemberStatementInitialValues } from "@/components/assets/data";
import BaseModal from "@/components/Modals/BaseModal";
import { useAuth } from "@/context/AuthContext";

export default function GenerateStatement({ autoOpen }: { autoOpen?: boolean }) {
  const { toast } = useToast();
  const { activeContext, activeOrgId } = useAuth();

  const [open, setOpen] = useState(false);

  // Determine if user is admin
  const isAdmin = activeContext === "org_admin";

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  // Member Statement Mutation (for regular members)
  const memberMutation = useMutation<GenerateStatementResponse, Error, GenerateMemberStatementParams>({
    mutationFn: generateMemberStatementFn,
  });

  // Organization Statement Mutation (for org_admin)
  const orgMutation = useMutation<GenerateStatementResponse, Error, Omit<GenerateMemberStatementParams, "orgId">>({
    mutationFn: async (params) => {
      if (!activeOrgId) throw new Error("Organization ID not found");
      return generateOrganizationStatementFn(activeOrgId, params);
    },
  });

  // Use the appropriate mutation based on role
  const activeMutation = isAdmin ? orgMutation : memberMutation;
  const { mutateAsync, isPending, isError, error } = activeMutation;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Generate Statement
      </Button>

      <BaseModal
        open={open}
        onClose={() => setOpen(false)}
        title={isAdmin ? "Generate Organization Statement" : "Generate Member Statement"}
        width={700}
      >
        <div className="w-full">
          {/* Role-based information banner */}
          {isAdmin && !activeOrgId && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              ⚠️ Organization ID not found. Please ensure you're logged in as an admin.
            </div>
          )}

          {isAdmin && activeOrgId && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
              ℹ️ Generating organization-wide statement for all members in your organization.
            </div>
          )}

          <Formik
            initialValues={MemberStatementInitialValues}
            validationSchema={MemberStatementSchema}
            onSubmit={async (values, actions) => {
              try {
                // Call the appropriate mutation based on role
                const res = await mutateAsync(values);

                // Generate download
                const url = window.URL.createObjectURL(res.blob);
                const a = document.createElement("a");
                a.href = url;

                // Set filename based on role and export type
                const defaultFilename = isAdmin
                  ? values.exportType === "csv"
                    ? "organization-statement.csv"
                    : "organization-statement.pdf"
                  : values.exportType === "csv"
                  ? "statement.csv"
                  : "statement.pdf";

                a.download = res.filename || defaultFilename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                // Success notification
                toast({
                  title: "Export started",
                  description: `Downloading ${a.download}`,
                  open: true,
                  action: undefined,
                });

                setOpen(false);
                actions.resetForm();
              } catch (e: any) {
                console.error("Generate statement error", e);
                toast({
                  title: "Export failed",
                  description: e?.message || "Failed to generate statement",
                  open: true,
                });
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {(formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate && (
                      <span className="text-xs text-red-500">{formik.errors.startDate}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">End Date</label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {(formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate && (
                      <span className="text-xs text-red-500">{formik.errors.endDate}</span>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Transaction Type</label>
                    <select
                      name="type"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="">Select transaction type</option>
                      <option value="all">All</option>
                      <option value="savings_deposit">Savings (Deposit)</option>
                      <option value="savings_withdrawal">Savings (Withdrawal)</option>
                      <option value="contribution_deposit">Contribution (Deposit)</option>
                      <option value="contribution_withdrawal">Contribution (Withdrawal)</option>
                      <option value="loan">Loan</option>
                      <option value="loan_repayment">Loan Repayment</option>
                      <option value="organization_fund_deposit">Organization Fund Deposit</option>
                    </select>
                    {(formik.touched.type || formik.submitCount > 0) && formik.errors.type && (
                      <span className="text-xs text-red-500">{formik.errors.type}</span>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="">Select status</option>
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    {(formik.touched.status || formik.submitCount > 0) && formik.errors.status && (
                      <span className="text-xs text-red-500">{formik.errors.status}</span>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Export Type</label>
                    <select
                      name="exportType"
                      value={formik.values.exportType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="">Select export type</option>
                      <option value="pdf">PDF</option>
                      <option value="csv">CSV</option>
                    </select>
                    {(formik.touched.exportType || formik.submitCount > 0) && formik.errors.exportType && (
                      <span className="text-xs text-red-500">{formik.errors.exportType}</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formik.isSubmitting || isPending || (isAdmin && !activeOrgId)}>
                    {isPending || formik.isSubmitting ? "Generating..." : "Generate Statement"}
                  </Button>
                </div>
                {isError && (
                  <div className="mt-3 text-sm text-red-500">Error: {String((error as any)?.message || "Failed")}</div>
                )}
              </form>
            )}
          </Formik>
        </div>
      </BaseModal>
    </>
  );
}
