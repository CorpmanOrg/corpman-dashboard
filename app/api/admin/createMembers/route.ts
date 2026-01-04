import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  try {
    // Safely parse the incoming JSON body; if it's missing, return 400 with details
    const body = await req.json().catch(() => null);
    if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
      return NextResponse.json(
        { error: "Missing request body", details: "req.body is undefined or empty" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${apiUrl}/auth/members/request`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // Read response as text first so we can gracefully handle non-JSON error responses
    const text = await response.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      data = text;
    }

    // Forward the backend response (JSON or plain text) and preserve status code
    if (response.ok) {
      return NextResponse.json(data ?? null, { status: response.status });
    }

    // For error responses, if backend returned JSON-like object forward it directly,
    // otherwise wrap the plain text in an `error` field so downstream clients get useful info.
    if (typeof data === "string") {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data ?? { error: "Failed to create member(s)" }, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Could not reach backend service, Network err, Please try again later...",
        details: error?.message ?? String(error),
      },
      { status: 502 }
    );
  }
}
