import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const url = process.env.API_BASE_TEST_URL;

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("myUserToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Authentication token missing, logout and login back" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // Handle FormData (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const id = formData.get("id") as string;
      const action = formData.get("action") as string;
      const rejectionReason = formData.get("rejectionReason") as string | null;
      const transferReceipt = formData.get("transferReceipt") as File | null;

      if (!id || !action) {
        return NextResponse.json({ error: "Missing required fields (id, action)" }, { status: 400 });
      }

      // Create FormData to forward to backend
      const backendFormData = new FormData();
      backendFormData.append("action", action);
      if (rejectionReason) {
        backendFormData.append("rejectionReason", rejectionReason);
      }
      if (transferReceipt) {
        backendFormData.append("transferReceipt", transferReceipt);
      }

      // Proxy call to backend with FormData
      const res = await fetch(`${url}/payment/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: backendFormData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        return NextResponse.json({ error: errorData?.message || "Failed to update payment" }, { status: res.status });
      }

      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }

    // Handle JSON (no file upload)
    const body = await req.json();
    const { id, action, rejectionReason } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required fields (id, action)" }, { status: 400 });
    }

    // Proxy call to backend
    const res = await fetch(`${url}/payment/${id}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        rejectionReason,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData?.message || "Failed to update payment" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
