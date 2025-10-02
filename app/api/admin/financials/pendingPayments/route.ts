import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawStatus = searchParams.get("status");
  // Preserve empty string ("") to mean ALL; only default when the param is truly absent (null)
  const status = rawStatus === null ? "pending" : rawStatus; // rawStatus may be "", "pending", "approved", etc.
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  // Build upstream query params
  const upstreamParams = new URLSearchParams();
  if (status !== undefined && status !== null) upstreamParams.set("status", status); // keeps empty string
  if (page) upstreamParams.set("page", page);
  if (limit) upstreamParams.set("limit", limit);
  const upstreamQuery = upstreamParams.toString();

  try {
    // 3. Make backend call
    const response = await fetch(`${apiUrl}/payment/organization?${upstreamQuery}`, {
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
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    // 7. Network / unexpected errors
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
