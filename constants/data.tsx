import { SideMenuModules } from "@/types/types";
import { Home, Users, DollarSign, FileText, Settings, LogOut, CreditCard } from "lucide-react";

export const SidebarMenuInit: SideMenuModules[] = [
  {
    type: "item",
    label: "Dashboard",
    icon: <Home />,
    key: "dashboard",
  },
  {
    type: "category",
    label: "People Management",
    icon: <Users />,
    key: "people",
    children: [
      { label: "All Cooperative", key: "all-cooperatives" },
      { label: "Members", key: "members" },
      { label: "Dispute", key: "dispute" },
      { label: "Profile", key: "profile" },
    ],
  },
  {
    type: "category",
    label: "Financials",
    icon: <DollarSign />,
    key: "financials",
    children: [
      { label: "Contributions", key: "contributions" },
      { label: "Withdrawals", key: "withdrawals" },
      { label: "Loans", key: "loans" },
      { label: "Investments", key: "investments" },
      { label: "Welfare & Support", key: "welfare" },
    ],
  },
  {
    type: "category",
    label: "Records",
    icon: <FileText />,
    key: "records",
    children: [
      { label: "Statement", key: "statement" },
      { label: "Reporting", key: "reporting" },
      { label: "Minutes of Meetings", key: "minutes" },
    ],
  },
  {
    type: "item",
    label: "Settings",
    icon: <Settings />,
    key: "settings",
  },
  {
    type: "item",
    label: "Logout",
    icon: <LogOut />,
    key: "logout",
  },
];

export const MainStatCard = [
  {
    title: "Members",
    value: "1,250",
    icon: <Users />,
  },
  {
    title: "Contributions",
    value: "150",
    icon: <DollarSign />,
  },
  {
    title: "Loans",
    value: "4560",
    icon: <CreditCard />,
  },
];
