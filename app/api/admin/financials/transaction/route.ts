// app/api/admin/financials/transaction/route.ts
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
    const formData = await req.formData(); // parse incoming form-data

    const response = await fetch(`${apiUrl}/payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ don't set Content-Type here, fetch will forward correctly
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Next.js route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
