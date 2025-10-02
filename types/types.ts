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

export type MembersQueryKey = ["fetch-members-by-admin", string | undefined, number, number, string | undefined];

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

export type deposit = { amount: string; type: string; description: string; payment_receipt: null | File };
export type withdrawal = { amount: string; type: string; description: string };

export type MakePaymentRes = {
  message: string;
  paymentId: string;
  amount: number;
  type: string;
  status: string;
};

// Payment status filter values (includes 'all' for future backend support)
export type PaymentStatusFilter = "pending" | "approved" | "rejected" | "all";

export type ErrorResponse = {
  message?: string;
  success?: boolean;
};

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
  paymentReceipt: string;
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
