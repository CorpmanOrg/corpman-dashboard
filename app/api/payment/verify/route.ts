/**
 * Payment Verification API Route
 *
 * POST /api/payment/verify
 * Verifies payment status with the gateway
 */

import { NextRequest, NextResponse } from "next/server";
import { paystackAdapter } from "@/utils/PaymentGateway/adapters/paystack";
import { flutterwaveAdapter } from "@/utils/PaymentGateway/adapters/flutterwave";
import { providusAdapter } from "@/utils/PaymentGateway/adapters/providus";
import { PaymentGateway, GatewayProvider } from "@/types/gateway.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, gateway } = body as { reference: string; gateway: GatewayProvider };

    // Validate required fields
    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 });
    }

    if (!gateway) {
      return NextResponse.json({ error: "Gateway is required" }, { status: 400 });
    }

    // Select the appropriate gateway adapter
    let adapter: PaymentGateway;

    switch (gateway) {
      case "paystack":
        adapter = paystackAdapter;
        break;
      case "flutterwave":
        adapter = flutterwaveAdapter;
        break;
      case "providus":
        adapter = providusAdapter;
        break;
      case "stripe":
      case "monnify":
      case "squad":
        return NextResponse.json({ error: `${gateway} adapter not yet implemented` }, { status: 501 });
      default:
        return NextResponse.json({ error: "Unsupported gateway" }, { status: 400 });
    }

    // Verify payment through the selected adapter
    const result = await adapter.verify(reference);

    // TODO: Update transaction status in database here
    // if (result.success) {
    //   await updateTransactionStatus(reference, 'success');
    // }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      {
        error: error.message || "Payment verification failed",
        success: false,
      },
      { status: 500 }
    );
  }
}
