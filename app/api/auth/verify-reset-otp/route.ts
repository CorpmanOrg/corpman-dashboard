import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    const body = await req.json();
    const email = body?.email;
    const otp = body?.otp;

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    const response = await fetch(`${apiUrl}/auth/verify-reset-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
