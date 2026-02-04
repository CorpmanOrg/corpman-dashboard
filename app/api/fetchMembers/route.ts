import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const orgId = searchParams.get("orgId");
  const status = searchParams.get("status");

  // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
  // TODO: Re-enable when backend JWT includes organizations array
  // const authError = await requireOrgAdmin(orgId);
  // if (authError) {
  //   return authError; // Return 401/403 if unauthorized
  // }

  // 🔒 BASIC AUTH CHECK: Just verify user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/organizations/${orgId}/members?page=${page}&limit=${limit}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
