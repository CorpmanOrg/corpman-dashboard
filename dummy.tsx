import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest) {
  const apiUrl = process.env.API_BASE_TEST_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("myUserToken")?.value;

  if (!token) {
    // console.error("Token missing");
    return NextResponse.json({ error: "Token missing" }, { status: 401 });
  }

  const payload = await req.json();
  // console.log("Payload received in Next.js route:", payload);

  try {
    const response = await fetch(`${apiUrl}/member/approve/member`, {
      method: "PATCH", // <-- PATCH instead of POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();
    // console.log("Backend raw response:", rawText);

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = JSON.parse(rawText);
    } else {
      // Not JSON, log and handle as error
      // console.error("Backend did not return JSON:", rawText);
      return NextResponse.json({ error: "Backend did not return JSON", details: rawText }, { status: response.status });
    }
    // console.log("Backend response status:", response.status);
    // console.log("Backend response data:", data);

    if (!response.ok) {
      // Forward backend error details
      return NextResponse.json({ error: data.message || "Backend error", details: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // console.error("Next.js route error:", error);
    return NextResponse.json({ error: "Internal server error from frontend", details: error }, { status: 500 });
  }
}

// For Next.js App Router, PATCH handler must be exported as PATCH
export { PATCH as POST };
