import { NextResponse } from "next/server";
import { requireAuth, getToken, getUserAdminOrganizations } from "@/utils/auth-helpers";
import { cookies } from "next/headers";

const url = process.env.API_BASE_TEST_URL;

export async function PATCH(req: Request) {
  try {
    // ⏸️ TEMPORARILY DISABLED: Auth-helper validation (waiting for backend to add organizations to JWT)
    // TODO: Re-enable when backend JWT includes organizations array
    // const authError = await requireAuth();
    // if (authError) {
    //   return authError;
    // }
    // const adminOrgs = await getUserAdminOrganizations();
    // if (adminOrgs.length === 0) {
    //   return NextResponse.json({ error: "Forbidden: org_admin role required" }, { status: 403 });
    // }

    // 🔒 BASIC AUTH CHECK: Just verify user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("myUserToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
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
