import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    // 1. Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("myUserToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
    }

    // 2. Read query params from incoming request
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || "";
    // const page = searchParams.get("page") || "1";
    // const limit = searchParams.get("limit") || "10";

    // 3. Make backend call
    const response = await fetch(`${apiUrl}/api/v1/organizations/${orgId}/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // attach token
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
        { status: response.status }
      );
    }

    // 6. Success
    const normalized = data && typeof data === "object" && "balances" in data ? data : { balances: data };
    return NextResponse.json(normalized, { status: response.status });
  } catch (error: any) {
    // 7. Network / unexpected errors
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
