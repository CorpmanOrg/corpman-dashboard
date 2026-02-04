// app/api/admin/financials/transaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
  // TODO: Re-enable when backend JWT includes organizations array
  // const authError = await requireAuth();
  // if (authError) {
  //   return authError;
  // }

  // 🔒 BASIC AUTH CHECK: Just verify user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const formData = await req.formData(); // parse incoming form-data

    // Forward the multipart form-data to the external payment endpoint.
    const response = await fetch(`${apiUrl}/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ don't set Content-Type here, fetch will forward correctly
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Next.js route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
