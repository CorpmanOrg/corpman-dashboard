// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET(req: NextRequest) {
//   const apiUrl = process.env.API_BASE_TEST_URL;

//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("myUserToken")?.value;

//     // Read orgId from query params
//     const { searchParams } = new URL(req.url);
//     const orgId = searchParams.get("orgId") || "";

//     if (!orgId) {
//       return NextResponse.json({ error: "orgId is required" }, { status: 400 });
//     }

//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };
//     if (token) headers["Authorization"] = `Bearer ${token}`;

//     const response = await fetch(`${apiUrl}/api/v1/organizations/${orgId}/`, {
//       method: "GET",
//       headers,
//     });

//     let data: any;
//     try {
//       data = await response.json();
//     } catch (e) {
//       return NextResponse.json({ error: "Backend did not return valid JSON" }, { status: response.status || 502 });
//     }

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data.message || "Backend returned error", details: data },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(data, { status: response.status });
//   } catch (error: any) {
//     return NextResponse.json({ error: "Failed to reach backend service", details: error?.message }, { status: 502 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;

  // 2. Read query params from incoming request
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId") || "";

  const fullUrl = `${apiUrl}/api/v1/organizations/${orgId}/`;

  try {
    // 3. Make backend call
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to reach backend service", details: error.message }, { status: 502 });
  }
}
