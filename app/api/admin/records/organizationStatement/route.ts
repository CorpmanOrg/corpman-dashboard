import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  // Read query params
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const exportType = searchParams.get("exportType");

  if (!token) {
    return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
  }

  if (!orgId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
  }

  try {
    const backendUrl = new URL(`${apiUrl}/payment/organization/${orgId}/export`);
    if (startDate) backendUrl.searchParams.set("startDate", startDate);
    if (endDate) backendUrl.searchParams.set("endDate", endDate);
    if (type) backendUrl.searchParams.set("type", type);
    if (status) backendUrl.searchParams.set("status", status);
    if (exportType) backendUrl.searchParams.set("exportType", exportType);

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If backend returned non-ok JSON, forward it
    if (!response.ok) {
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {}
      return NextResponse.json(data || { error: "Upstream error" }, { status: response.status });
    }

    // Stream binary response (PDF/CSV) back to client
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition") || "inline; filename=organization-statement";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reach backend service", details: error?.message }, { status: 502 });
  }
}
