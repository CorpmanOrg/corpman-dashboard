import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    const response = await fetch(`${apiUrl}/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Forbidden request" }, { status: 403 });
    }

    const data = await response.json();

    if (data) {
      return NextResponse.json({ data: data }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
