"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormik } from "formik";
import { SettingsSchema, validateSettingsWithInitial } from "@/utils/Yup/schema";
import { SettingsFormValues } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getSettingsFn, updateSettingsFn } from "@/utils/ApiFactory/settings";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { currentOrgId } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch settings when the page loads
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["organization-settings", currentOrgId],
    queryFn: () => getSettingsFn(currentOrgId as string),
    enabled: !!currentOrgId,
  });

  // Mutation for updating settings
  const updateMutation = useMutation({
    mutationFn: (payload: Partial<SettingsFormValues>) =>
      updateSettingsFn(payload as SettingsFormValues, currentOrgId as string),
    onSuccess: async (response) => {
      toast({
        title: "Settings updated",
        description: response.message || "Your settings have been saved successfully.",
      });
      // Refetch settings to get latest data
      await refetch();
    },
    onError: (error: any) => {
      console.log("Settings update error:", error);
      toast({
        title: "Update failed",
        description: error?.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Log when data or error changes
  if (data) {
    console.log("Settings API Response:", data);
  }
  if (error) {
    console.error("Settings API Error:", error);
  }

  // Map fetched data to form values, with fallback to defaults
  const initialValues = React.useMemo(() => {
    if (data?.organization) {
      const org = data.organization;
      return {
        savingsMaxDays: org.withdrawalSettings?.savingsMaxDays ?? 0,
        contributionMaxDays: org.withdrawalSettings?.contributionMaxDays ?? 0,
        contributionMultiplier: org.loanSettings?.contributionMultiplier ?? 0,
        interestRate: org.loanSettings?.interestRate ?? 0,
        maxLoanDuration: org.loanSettings?.maxLoanDurationMonths ?? 0,
        minimumContributionMonths: org.loanSettings?.minimumContributionMonths ?? 0,
        paymentMode: org.paymentSettings?.mode ?? "",
      } as SettingsFormValues;
    }
    // Default values before data is loaded
    return {
      savingsMaxDays: 0,
      contributionMaxDays: 0,
      contributionMultiplier: 0,
      interestRate: 0,
      maxLoanDuration: 0,
      minimumContributionMonths: 0,
      paymentMode: "",
    } as SettingsFormValues;
  }, [data]);

  const formik = useFormik<SettingsFormValues>({
    initialValues,
    enableReinitialize: true,
    validate: (values) => validateSettingsWithInitial(values, initialValues),
    onSubmit: async (values, { setSubmitting }) => {
      // Additional safety check: don't submit if form has errors
      if (Object.keys(formik.errors).length > 0) {
        setSubmitting(false);
        return;
      }

      // Build a PATCH-style payload containing only modified fields
      const payload: Partial<SettingsFormValues> = {};
      Object.keys(initialValues).forEach((k) => {
        const key = k as keyof SettingsFormValues;
        const orig = initialValues[key];
        const cur = values[key];
        // treat NaN and undefined carefully; simple strict compare is suitable here
        if (cur !== orig) {
          // @ts-ignore
          payload[key] = cur;
        }
      });

      // Check if there are any changes
      if (Object.keys(payload).length === 0) {
        toast({
          title: "No changes",
          description: "No fields were modified.",
        });
        setSubmitting(false);
        return;
      }

      // Call the mutation to update settings
      updateMutation.mutate(payload);
      setSubmitting(false);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdrawal Settings Skeleton */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
            </div>
          </div>

          {/* Loan Settings Skeleton */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-44 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
            </div>
          </div>

          {/* Payment Settings Skeleton */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure withdrawal, loan, and payment rules for your cooperative.
          </p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-card p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              <h2 className="text-lg font-semibold">Withdrawal Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Control withdrawal limits for savings and contributions.
              </p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Savings Max Days</label>
                <Input name="savingsMaxDays" placeholder="e.g. 3" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">Maximum days allowed for savings withdrawals.</p>
              </div>

              <div>
                <label className="block text-sm mb-1">Contribution Max Days</label>
                <Input name="contributionMaxDays" placeholder="e.g. 90" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">Maximum days allowed for contribution withdrawals.</p>
              </div>
            </div>
          </section>

          <section className="bg-card p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              <h2 className="text-lg font-semibold">Loan Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Configure loan multiplier, rates and eligibility.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Contribution Multiplier</label>
                <Input name="contributionMultiplier" type="number" placeholder="e.g. 2" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">
                  Multiplier applied to members' contributions for loan eligibility.
                </p>
              </div>

              <div>
                <label className="block text-sm mb-1">Interest Rate (%)</label>
                <Input name="interestRate" type="number" placeholder="e.g. 5" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">Annual interest rate applied to loans.</p>
              </div>

              <div>
                <label className="block text-sm mb-1">Max Loan Duration (Months)</label>
                <Input name="maxLoanDuration" type="number" placeholder="e.g. 12" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">Maximum loan tenure in months.</p>
              </div>

              <div>
                <label className="block text-sm mb-1">Minimum Contribution Months</label>
                <Input name="minimumContributionMonths" type="number" placeholder="e.g. 3" formik={formik} />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum contribution months required to apply for a loan.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card p-6 rounded-lg shadow-sm">
            <header className="mb-4">
              <h2 className="text-lg font-semibold">Payment Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the preferred payment mode for this organization.
              </p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={formik.values.paymentMode || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-input focus:outline-none"
                >
                  <option value="">Select payment mode</option>
                  <option value="manual">Manual</option>
                  <option value="auto">Automatic</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Manual = admin uploads/records payments. Automatic = integrated payment gateway.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded"
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
