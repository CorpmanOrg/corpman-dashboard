import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const apiUrl = process.env.API_BASE_TEST_URL

  const response = await fetch(`${apiUrl}/auth/org/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });


  if (!response.ok) {
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
  }

  const data = await response.json();
  const token = data?.token;

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 500 });
  }

  const res = NextResponse.json(data, { status: 200 });
  res.cookies.set("myUserToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
