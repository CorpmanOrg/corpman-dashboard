import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
  }

  try {
    const backendUrl = `${apiUrl}/member/profile`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If backend returned non-ok, forward error
    if (!response.ok) {
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {}
      return NextResponse.json(data || { error: "Upstream error" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reach backend service", details: error?.message }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Authentication token missing" }, { status: 401 });
  }

  try {
    // Parse request body
    const body = await req.json();

    const backendUrl = `${apiUrl}/member/profile`;

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // If backend returned non-ok, forward error
    if (!response.ok) {
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {}
      return NextResponse.json(data || { error: "Upstream error" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reach backend service", details: error?.message }, { status: 502 });
  }
}
