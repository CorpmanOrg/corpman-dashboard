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
  key: string;
};

export interface SideMenuModules {
  type: "item" | "category";
  label: string;
  icon: ReactNode;
  key: string;
  children?: SubChildren[];
}
