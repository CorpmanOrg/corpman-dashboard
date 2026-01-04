import { NextResponse } from "next/server";

export async function GET() {
  console.log("[api/payment/manualPayment] GET ping");
  return NextResponse.json({ ok: true, message: "Manual payment endpoint active" }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("[api/payment/manualPayment] Incoming payload:", payload);

    const { amount, memberId, orgId, reference } = payload || {};

    if (typeof amount !== "number" || !memberId || !orgId) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: amount (number), memberId, orgId" },
        { status: 400 }
      );
    }

    // Create a dummy payment record (in-memory response only)
    const manualPayment = {
      id: `MP_${Date.now()}`,
      amount,
      memberId,
      orgId,
      reference: reference || `REF_${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("[api/payment/manualPayment] Created dummy manual payment:", manualPayment);

    return NextResponse.json({ ok: true, data: manualPayment }, { status: 201 });
  } catch (error: any) {
    console.error("[api/payment/manualPayment] Error processing request:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Internal error" }, { status: 500 });
  }
}
