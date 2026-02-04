import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken, getUserAdminOrganizations } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
  // TODO: Re-enable when backend JWT includes organizations array
  // const authError = await requireAuth();
  // if (authError) {
  //   return authError;
  // }
  // const adminOrgs = await getUserAdminOrganizations();
  // if (adminOrgs.length === 0) {
  //   return NextResponse.json({ error: "Forbidden: org_admin role required" }, { status: 403 });
  // }

  // 🔒 BASIC AUTH CHECK: Just verify user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const payload = await req.json();
  // console.log("✅ Payload received in Next.js route:", JSON.stringify(payload, null, 2));

  try {
    const fullUrl = `${apiUrl}/member/approve/member`;
    // console.log("➡️ Calling backend:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();
    // console.log("⬅️ Backend raw response:", rawText);

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = JSON.parse(rawText);
    } else {
      console.error("❌ Backend did not return JSON");
      return NextResponse.json({ error: "Backend did not return JSON", details: rawText }, { status: response.status });
    }

    if (!response.ok) {
      console.error("❌ Backend returned error:", data);
      return NextResponse.json(data, { status: response.status });
    }

    // console.log("✅ Backend returned success:", data);
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Next.js route error:", error);
    return NextResponse.json({ error: "Internal server error from frontend" }, { status: 500 });
  }
}
