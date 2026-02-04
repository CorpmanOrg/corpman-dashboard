import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
    // TODO: Re-enable when backend JWT includes organizations array
    // const authError = await requireAuth();
    // if (authError) {
    //   return authError; // Return 401 if not authenticated
    // }

    // 🔒 BASIC AUTH CHECK: Just verify user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("myUserToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 3. Make backend call
    // NOTE: Backend collection endpoint appears to be /payment/balances (plural)
    const response = await fetch(`${apiUrl}/payment/balances`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // 4. Parse backend response safely
    let data;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json({ error: "Backend did not return valid JSON" }, { status: response.status || 502 });
    }

    // 5. Handle backend error response
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || "Backend returned error",
          details: data,
        },
        { status: response.status },
      );
    }

    // 6. Success - normalize a consistent shape
    // If backend already returns { balances: {...} } just forward.
    // Otherwise wrap primitives in balances key.
    const normalized = data && typeof data === "object" && "balances" in data ? data : { balances: data };
    return NextResponse.json(normalized, { status: response.status });
  } catch (error: any) {
    // 7. Network / unexpected errors
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
