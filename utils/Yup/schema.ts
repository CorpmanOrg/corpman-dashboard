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
  paymentReceipt: Yup.mixed()
    .nullable()
    .test("required", "Payment receipt is required", (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim() !== "";
      if (value instanceof File) return true;
      return false;
    })
    .test("fileSize", "File is too large (max 5MB)", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true; // existing URL/name
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
        return allowed.includes(value.type) || value.type.startsWith("image/");
      }
      return true;
    }),
});

export const WithdrawalSchema = Yup.object().shape({
  amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
  description: Yup.string().required("Description is required"),
  paymentReceipt: Yup.mixed()
    .nullable()
    .test("fileSize", "File is too large (max 5MB)", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    })
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
        return allowed.includes(value.type) || value.type.startsWith("image/");
      }
      return true;
    }),
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
  savingsMaxDays: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Savings max days must be a number"),

  contributionMaxDays: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Contribution max days must be a number"),

  contributionMultiplier: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Contribution multiplier must be a number"),

  interestRate: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Interest rate must be a number"),

  maxLoanDuration: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Max loan duration must be a number"),

  minimumContributionMonths: Yup.number()
    .transform((value, original) => (original === "" || original === null ? null : value))
    .nullable()
    .notRequired()
    .typeError("Minimum contribution months must be a number"),

  paymentMode: Yup.string()
    .transform((value, original) => (original === "" ? null : value))
    .nullable()
    .notRequired()
    .test("is-valid-paymentMode", 'Payment mode must be either "manual" or "auto"', (val) =>
      val == null ? true : ["manual", "auto"].includes(val)
    ),
});

// Helper validator that enforces: if an initially-non-empty field becomes empty, return an error.
export async function validateSettingsWithInitial(values: any, initialValues: any) {
  const errors: Record<string, string> = {};

  try {
    await SettingsSchema.validate(values, { abortEarly: false });
  } catch (err: any) {
    if (err?.inner && Array.isArray(err.inner)) {
      err.inner.forEach((e: any) => {
        if (e.path && !errors[e.path]) errors[e.path] = e.message;
      });
    } else if (err?.path) {
      errors[err.path] = err.message;
    }
  }

  const fields: { key: string; label: string }[] = [
    { key: "savingsMaxDays", label: "Savings Max Days" },
    { key: "contributionMaxDays", label: "Contribution Max Days" },
    { key: "contributionMultiplier", label: "Contribution Multiplier" },
    { key: "interestRate", label: "Interest Rate" },
    { key: "maxLoanDuration", label: "Max Loan Duration" },
    { key: "minimumContributionMonths", label: "Minimum Contribution Months" },
    { key: "paymentMode", label: "Payment Mode" },
  ];

  fields.forEach((f) => {
    const v = values[f.key];
    const orig = initialValues ? initialValues[f.key] : undefined;
    const isEmpty = v === null || v === "" || v === undefined;
    const origEmpty = orig === null || orig === "" || orig === undefined;
    const changed = String(v) !== String(orig);
    if (isEmpty && !origEmpty && changed) {
      errors[f.key] = `${f.label} cannot be empty`;
    }
  });

  return errors;
}
