import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken, getUserAdminOrganizations } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
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

    // 2. Parse the incoming request body
    const payload = await req.json();

    // 3. Make backend call
    const response = await fetch(`${apiUrl}/member/assign-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // attach token here
      },
      body: JSON.stringify(payload),
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

    // 6. Success
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    // 7. Network / unexpected errors
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
