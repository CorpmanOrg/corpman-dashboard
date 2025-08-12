import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }
    const response = await fetch(`${apiUrl}/auth/verify-email/${token}`, {
      method: "GET",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, message: data?.message || "Verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
