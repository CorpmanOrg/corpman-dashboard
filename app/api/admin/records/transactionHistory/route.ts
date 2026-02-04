import { NextRequest, NextResponse } from "next/server";
import { requireOrgAdmin, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");
  const status = searchParams.get("status") ?? "pending";
  const type = searchParams.get("type") ?? "savings";
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

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

  // Build upstream query params
  const upstreamParams = new URLSearchParams();
  if (status !== undefined && status !== null) upstreamParams.set("status", status);
  if (type !== undefined && type !== null) upstreamParams.set("type", type);
  if (page) upstreamParams.set("page", page);
  if (limit) upstreamParams.set("limit", limit);
  const upstreamQuery = upstreamParams.toString();

  try {
    // Make backend call
    console.log("API Url: ", apiUrl);
    const response = await fetch(`${apiUrl}/payment/organization/${orgId}/transactions?${upstreamQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json({ error: "Backend did not return valid JSON" }, { status: response.status || 502 });
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || "Backend returned error",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
