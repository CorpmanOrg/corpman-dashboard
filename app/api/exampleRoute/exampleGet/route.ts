import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";

  // console.log("From Server Endpoint: ", { searchParams, page, limit });

  try {
    const response = await fetch(`${apiUrl}/a******it?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data;
    try {
      data = await response.json();
    } catch {
      // In case backend returns HTML or non-JSON
      return NextResponse.json(
        { error: "Backend did not return valid JSON" },
        { status: response.status || 502 } // 502 = Bad Gateway (backend issue)
      );
    }

    if (!response.ok) {
      // Bubble up backend error instead of masking as 500
      return NextResponse.json(
        { error: data.message || "Backend returned error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // Distinguish network errors
    return NextResponse.json(
      { error: "Failed to reach backend service", details: error.message },
      { status: 502 } // 502 fits better than 500 here
    );
  }
}
