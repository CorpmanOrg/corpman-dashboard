import { InputHTMLAttributes, ReactNode } from "react";

export interface SignUpFormValues {
  name?: string;
  email?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  terms?: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface InputFormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  touched?: boolean;
  error?: string;
  appendIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export type SubChildren = {
  label: string;
  chref: string;
  key: string;
};

export interface SideMenuModules {
  type: "item" | "category";
  label: string;
  href?: string;
  icon: ReactNode;
  key: string;
  children?: SubChildren[];
}

export interface LoggedUser {
  _id: string;
  email: string;
  surname: string;
  firstName: string;
  middleName?: string;
  address?: string;
  dateOfBirth?: string;
  stateOfOrigin?: string;
  LGA?: string;
  maritalStatus?: string;
  residentialAddress?: string;
  mobileNumber?: string;
  employer?: string;
  annualIncome?: number;
  monthlyContribution?: number;
  nextOfKin?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
  organizations?: Array<{
    organizationId: string;
    organizationName: string;
    status: string;
    role: string;
    balances: {
      savings: number;
      contribution: number;
      loanBalance: number;
    };
  }>;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type UserData = {
  message: string;
  token: string;
  user: LoggedUser;
};

export type Member = {
  id: string;
  _id: string;
  email: string;
  surname: string;
  name?: string;
  uniqueId?: string;
  contact?: string;
  status?: "active" | "rejected" | "pending" | "inactive";
  role?: "member" | "org_admin";
  address?: string;
  joinedAt?: string;
  image?: string;
  [key: string]: any;
};

export type MemberPaymentHistory = {
  id: string;
  _id: string;
  memberId: string;
  organizationId: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  interestRate: number;
  loanDurationMonths: number;
  type: TransactionTypeFilter;
  status: TransactionStatusFilter;
  paymentReceipt: string;
  description: string;
  expectedProcessingDays: number | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvedAt: string | null;
  approvedBy: {
    _id: string;
    email: string;
    surname: string;
    firstName: string;
  };
};

export interface Column<T> {
  id: keyof T | "ActionButton"; // allow action buttons too
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any, row: T, rowIndex: number) => React.ReactNode;
}

export type MemberParams = {
  page?: number;
  limit?: number;
  orgId: string;
  status?: string;
};

export type MemberPaymentHistoryParams = {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
};

export type MembersApiResponse = {
  total: number;
  page: number;
  totalPages: number;
  members: Member[];
};

export type TError = {
  message: string;
  error: string;
};

export type TData = MembersApiResponse;

export type MembersPaymentHistoryApiResponse = {
  payments: MemberPaymentHistory[];
  total: number;
  page: number;
  totalPages: number;
};

export type MemberPaymentHistoryError = {
  message: string;
  error: string;
};

export type MembersPHData = MembersPaymentHistoryApiResponse;

export type MembersQueryKey = ["fetch-members-by-admin", string | undefined, number, number, string | undefined];

export type StatementWithActions = Statement & { ActionButton: string };

export type MemberWithActions = Member & { ActionButton: string };

export type ToastbarProps = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info"; // Optional with limited values
  onClose: () => void;
};

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastState {
  open: boolean;
  severity: ToastSeverity;
  message: string;
}

export type TableAction = "view" | "edit" | "delete" | "custom" | "approve" | "reject";

export interface TableActionOption {
  key: TableAction;
  label: string;
  icon?: React.ReactNode;
}

export type MemberStatusUpdate = {
  memberId: string;
  status: "active" | "rejected" | "approve";
};

export type ApproveRejectPayload = {
  updates: MemberStatusUpdate[];
};

export interface ApproveRejectResponse {
  message: string;
  summary: {
    updated: string[];
    alreadyUpdated: string[];
    notFound: string[];
    noRequestToOrg: string[];
    invalidStatus: string[];
    errors: string[];
  };
}

export type Statement = {
  id: string;
  name: string;
  date: string; // ISO string
  description: string;
  type: "credit" | "debit";
  transactionType: "savings" | "contributions" | "loans";
  amount: number;
  balance: number;
  action?: "ActionButton";
};

export type ReportSummary = {
  category: "transactions" | "loans" | "investments" | "withdrawals" | "savings";
  total: number;
  count: number;
  growth?: number; // % change, optional
};

export type ReportTrend = {
  category: string;
  data: { date: string; value: number }[];
};

export type TopUserReport = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string; // <-- Add this line
};

export type deposit = { amount: string; type: string; description: string; paymentReceipt?: File | string | null };
export type withdrawal = { amount: string; type: string; description: string; paymentReceipt?: File | string | null };

export type MakePaymentRes = {
  message: string;
  paymentId: string;
  amount: number;
  type: string;
  status: string;
};

// Payment status filter values (includes 'all' for future backend support)
export type PaymentStatusFilter = "pending" | "approved" | "rejected" | "all";

export type ExportType = "pdf" | "csv";

export type GenerateMemberStatementParams = {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: PaymentStatusFilter | "";
  exportType?: ExportType;
};

export type GenerateOrganizationStatementParams = {
  orgId: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: PaymentStatusFilter | "";
  exportType?: ExportType;
};

export type GenerateStatementResponse = {
  blob: Blob;
  filename?: string;
  contentType?: string;
};

export type ErrorResponse = {
  message?: string;
  success?: boolean;
};

// Member Profile Types
export interface MemberOrganizationBalances {
  savings: number;
  contribution: number;
  loanBalance: number;
}

export interface MemberOrganizationInfo {
  balances: MemberOrganizationBalances;
  organization: string;
  status: string;
  role: string;
  _id: string;
}

export interface MemberProfileUser {
  _id: string;
  email: string;
  surname: string;
  firstName: string;
  middleName?: string;
  address?: string;
  dateOfBirth?: string;
  stateOfOrigin?: string;
  LGA?: string;
  maritalStatus?: string;
  residentialAddress?: string;
  mobileNumber?: string;
  employer?: string;
  annualIncome?: number;
  monthlyContribution?: number;
  nextOfKin?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
  isSuperAdmin: boolean;
  organizations: MemberOrganizationInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface MemberProfileResponse {
  message: string;
  user: MemberProfileUser;
}

// Update Member Profile Types
export interface UpdateMemberProfileParams {
  firstName?: string;
  surname?: string;
  middleName?: string;
  dateOfBirth?: string;
  stateOfOrigin?: string;
  LGA?: string;
  maritalStatus?: string;
  residentialAddress?: string;
  address?: string;
  mobileNumber?: string;
  email?: string;
  employer?: string;
  annualIncome?: number;
  monthlyContribution?: number;
  nextOfKin?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
}

export interface UpdateMemberProfileResponse {
  message: string;
  user: MemberProfileUser;
}

export interface MemberIdProps {
  _id: string;
  email: string;
  surname: string;
  firstName: string;
}

export interface PaymentDataProps {
  id: string;
  _id: string;
  memberId: MemberIdProps;
  organizationId: string;
  amount: number;
  type: string; // extend as needed
  status: string; // extend as needed
  paymentReceipt?: string; // Optional: legacy field for historical data
  description: string;
  expectedProcessingDays: number | null;
  createdAt: string; // could be Date if you parse it
  updatedAt: string;
  __v: number;
}

export interface MemberPaymentsResponse {
  payments: PaymentDataProps[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export type PaymentApproveRejectResponse = {
  message?: string;
  success?: boolean;
};

export type paymentApproveOrRejectType = {
  paymentId: string; // target payment identifier
  action: "approve" | "reject";
  rejectionReason?: string; // required when action = reject
};

export type AssignRoleType = {
  userId: string;
  organizationId: string;
  role: "member" | "org_admin";
};

export type SettingsType = {
  savingsMaxDays: number;
  contributionMaxDays: number;
};

// Types for the Settings form (Formik values and partial update payloads)
export type PaymentMode = "manual" | "auto";

export interface SettingsFormValues {
  savingsMaxDays?: number | null;
  contributionMaxDays?: number | null;
  contributionMultiplier?: number | null;
  interestRate?: number | null;
  maxLoanDuration?: number | null;
  minimumContributionMonths?: number | null;
  paymentMode?: PaymentMode | "" | null;
}

// Use when sending partial updates to the API (all fields optional)
export type PartialSettingsUpdate = Partial<SettingsFormValues>;

// Strongly-typed success response for GET /organizations/:orgId/settings
export interface OrganizationSettings {
  _id: string;
  name: string;
  withdrawalSettings: {
    savingsMaxDays: number;
    contributionMaxDays: number;
  };
  loanSettings: {
    contributionMultiplier: number;
    interestRate: number;
    maxLoanDurationMonths: number;
    minimumContributionMonths: number;
  };
  paymentSettings: {
    mode: PaymentMode;
  };
}

export interface GetSettingsSuccessResponse {
  organization: OrganizationSettings;
}

// Standard error response from the API
export interface ApiErrorResponse {
  message: string;
}

// 🆕 Create Members Types
export type CreateMemberPayload = {
  organizationId: string;
  surname: string;
  firstName: string;
  middleName: string;
  email: string;
  password: string;
  address: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  LGA: string;
  maritalStatus: string;
  residentialAddress: string;
  mobileNumber: string;
  employer: string;
  annualIncome: number;
  monthlyContribution: number;
  nextOfKin: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
};

export type CreateMemberResponse = {
  success: boolean;
  message: string;
  member?: Member;
};

export type CreateBulkMembersPayload = {
  organizationId: string;
  members: Omit<CreateMemberPayload, "organizationId">[];
};

export type CreateBulkMembersResponse = {
  success: boolean;
  message: string;
  created?: Member[];
  failed?: {
    member: Omit<CreateMemberPayload, "organizationId">;
    error: string;
  }[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
};

export type TransactionStatusFilter = "pending" | "approved" | "rejected" | "all";
export type TransactionTypeFilter = "savings" | "contribution" | "loan" | "all";

export interface TransactionHistoryMember {
  _id: string;
  name: string;
  email: string;
}

export interface TransactionHistoryBalanceImpact {
  balanceType: string;
  change: number;
  description: string;
}

export interface TransactionHistoryProps {
  id: string;
  _id: string;
  type: TransactionTypeFilter;
  // Category extracted from raw type (e.g. 'savings', 'contribution', 'loan')
  transactionType?: TransactionTypeFilter;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  member: TransactionHistoryMember;
  approvedBy: string | null;
  status: TransactionStatusFilter;
  description: string;
  balanceImpact: TransactionHistoryBalanceImpact[];
  paymentReceipt?: string | File | null;
  createdAt: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionHistoryProps[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
