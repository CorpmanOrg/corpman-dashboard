import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch full user profile from backend (includes organizations)
    const response = await fetch(`${apiUrl}/api/v1/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Fallback to decoded token if profile fetch fails
      const decoded = token ? JSON.parse(atob(token?.split(".")[1])) : null;
      return NextResponse.json({ user: token, organization: decoded }, { status: 200 });
    }

    const userData = await response.json();
    const decoded = token ? JSON.parse(atob(token?.split(".")[1])) : null;

    return NextResponse.json(
      {
        user: token,
        organization: decoded,
        profile: userData, // Full user data with organizations
      },
      { status: 200 },
    );
  } catch (error) {
    // Fallback to decoded token
    const decoded = token ? JSON.parse(atob(token?.split(".")[1])) : null;
    return NextResponse.json({ user: token, organization: decoded }, { status: 200 });
  }
}
