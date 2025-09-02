import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import jwt to decode the token

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = token ? JSON.parse(atob(token?.split(".")[1])) : null;
    return NextResponse.json({ user: token, organization: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
