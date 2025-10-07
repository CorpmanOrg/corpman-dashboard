import { SideMenuModules, SubChildren } from "@/types/types";
import { Home, Users, DollarSign, FileText, Settings, CreditCard, EarthLock } from "lucide-react";

export const SidebarMenuInit: SideMenuModules[] = [
  {
    type: "item",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <Home className="w-5 h-5" />,
    key: "dashboard",
  },
  {
    type: "category",
    label: "People Management",
    href: "/admin/peopleManagement",
    icon: <Users className="w-5 h-5" />,
    key: "people",
    children: [
      { label: "All Corperative", chref: "/admin/peopleManagement/allCorporative", key: "allCorporative" },
      { label: "Members", chref: "/admin/peopleManagement/members", key: "members" },
      { label: "Dispute", chref: "/admin/peopleManagement/dispute", key: "dispute" },
    ],
  },
  {
    type: "category",
    label: "Financials",
    href: "/admin/financials",
    icon: <DollarSign className="w-5 h-5" />,
    key: "financials",
    children: [
      { label: "Payments", chref: "/admin/financials/contributions", key: "payments" },
      { label: "Withdrawals", chref: "/admin/financials/withdrawals", key: "withdrawals" },
      { label: "Approved Payments", chref: "/admin/financials/approvedPayments", key: "approvedPayments" },
      { label: "Rejected Payments", chref: "/admin/financials/rejectedPayments", key: "rejectedPayments" },
      { label: "Transactions", chref: "/admin/financials/transactions", key: "transactions" },
      { label: "Loans", chref: "/admin/financials/loans", key: "loans" },
      { label: "Investments", chref: "/admin/financials/investments", key: "investments" },
      { label: "Welfare & Support", chref: "/admin/financials/welfareSupport", key: "welfare" },
    ],
  },
  {
    type: "category",
    label: "Records",
    href: "/admin/records",
    icon: <FileText className="w-5 h-5" />,
    key: "records",
    children: [
      { label: "Statement", chref: "/admin/records/statement", key: "statement" },
      { label: "Reporting", chref: "/admin/records/reporting", key: "reporting" },
      { label: "Minutes of Meetings", chref: "/admin/records/minutesOfMeeting", key: "minutes" },
      { label: "My Reports", chref: "/admin/records/myReports", key: "myReports" },
      { label: "Profile", chref: "/admin/records/profile", key: "profile" },
      { label: "History", chref: "/admin/records/history", key: "history" },
    ],
  },
  {
    type: "item",
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
    key: "settings",
  },
  {
    type: "item",
    label: "Audit Logs",
    href: "/admin/auditLogs",
    icon: <EarthLock className="w-5 h-5" />,
    key: "audit",
  },
];

export const MainStatCard = [
  {
    title: "Members",
    value: "1,250",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Contributions / Savings",
    value: "150 / 45",
    icon: <DollarSign className="w-5 h-5" />,
  },
  // {
  //   title: "Savings",
  //   value: "150",
  //   icon: <DollarSign />,
  // },
  {
    title: "Loans",
    value: "4560",
    icon: <CreditCard className="w-5 h-5" />,
  },
];
