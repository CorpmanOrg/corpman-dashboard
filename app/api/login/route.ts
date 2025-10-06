import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  try {
    const payload = await req.json();

    const response = await fetch(`${apiUrl}/auth/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: any;
    try {
      data = await response.json();
    } catch {
      return NextResponse.json({ error: "Backend did not return valid JSON" }, { status: response.status });
    }

    // Handle error responses from backend
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Invalid Credentials", details: data },
        { status: response.status }
      );
    }

    // Check token
    const token = data?.token;
    if (!token) {
      return NextResponse.json({ error: "Token missing in response" }, { status: 500 });
    }

    // Success → set cookie
    const res = NextResponse.json(data, { status: 200 });
    res.cookies.set("myUserToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // ✅ fix: only secure in prod
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Could not reach backend service, Network err, Please try again later...", details: error.message },
      { status: 502 }
    );
  }
}
