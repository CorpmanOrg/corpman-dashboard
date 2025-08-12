import { SignUpFormValues, LoginFormValues, SideMenuModules } from "@/types/types";
import {
  Home,
  Users,
  DollarSign,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export const SignUpInitialValues: SignUpFormValues = {
  name: "",
  email: "",
  address: "",
  password: "",
  confirmPassword: "",
  terms: false
};

export const LoginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

