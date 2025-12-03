import * as Yup from "yup";

export const SignupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("usAddress is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please enter a valid email address"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
});

export const LoginSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const MemberContributionSchema = Yup.object().shape({
  amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
  description: Yup.string().required("Description is required"),
});

export const DepositSchema = Yup.object().shape({
  amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
  description: Yup.string().required("Description is required"),
});

export const WithdrawalSchema = Yup.object().shape({
  amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
  description: Yup.string().required("Description is required"),
});

export const paymentApproveOrRejectSchema = Yup.object({
  action: Yup.mixed<"approve" | "reject">().oneOf(["approve", "reject"]).required("Action is required"),

  rejectionReason: Yup.string().when("action", {
    is: "reject",
    then: (schema) => schema.required("Rejection reason is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const AssignRoleSchema = Yup.object({
  userId: Yup.string().required("User ID is required"),
  organizationId: Yup.string().required("Organization ID is required"),
  role: Yup.mixed<"member" | "org_admin">().oneOf(["member", "org_admin"]).required("Role is required"),
});

export const SettingsSchema = Yup.object({
  savingsMaxDays: Yup.number().min(1, "Must be at least 1").required("Savings max days is required"),
  contributionMaxDays: Yup.number().min(1, "Must be at least 1").required("Contribution max days is required"),
});
