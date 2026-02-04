import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
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

  // 2. Read query params from incoming request
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const type = searchParams.get("type");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!token) {
    return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
  }

  try {
    // 3. Build backend URL with query params for filtering
    const backendUrl = new URL(`${apiUrl}/payment/history`);
    backendUrl.searchParams.set("page", page);
    backendUrl.searchParams.set("limit", limit);
    if (type) backendUrl.searchParams.set("type", type);
    if (startDate) backendUrl.searchParams.set("startDate", startDate);
    if (endDate) backendUrl.searchParams.set("endDate", endDate);

    // 4. Make backend call
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // attach token
      },
    });

    // 5. Parse backend response safely
    const data = await response.json();

    // 6. Handle backend error response
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // 7. Success
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    // 8. Network / unexpected errors
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 509 });
  }
}
