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

export type Member = {
  id: string;
  _id: string;
  email: string;
  surname: string;
  name?: string;
  uniqueId?: string;
  contact?: string;
  status?: string;
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

export type ApproveRejectResponse = {
  success: boolean;
  message: string;
  updatedMembers?: Member[];
};

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
