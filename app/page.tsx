import { redirect } from "next/navigation";

export default function Home() {
  // BYPASS: Always redirect to dashboard for local development
  redirect("/admin/dashboard");
  return null;
}

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { AdminDashboard } from "@/components/admin-dashboard";

// export default async function Home() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("myUserToken")?.value;

//   if (token) {
//     redirect("/admin/dashboard");
//     // return <AdminDashboard />
//   } else {
//     redirect("/auth");
//   }
// }

