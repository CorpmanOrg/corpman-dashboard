import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const response = await fetch(`${apiUrl}/api/v1/auth/members/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to create member(s)" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create members API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
