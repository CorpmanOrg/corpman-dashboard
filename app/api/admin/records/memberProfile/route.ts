import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getToken } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
  // TODO: Re-enable when backend JWT includes organizations array
  // const authError = await requireAuth();
  // if (authError) {
  //   return authError;
  // }

  // 🔒 BASIC AUTH CHECK: Just verify user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
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

  // 🔒 SECURITY: Validate authentication
  const authError = await requireAuth();
  if (authError) {
    return authError;
  }

  const token = await getToken();

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
