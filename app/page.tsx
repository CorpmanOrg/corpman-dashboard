import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  console.log("From Cookie-Check-Token: ", token);

  if (!token) {
    redirect("/auth");
  }

  return <AdminDashboard />;
}
