/**
 * Payment Initialization API Route
 *
 * POST /api/payment/initialize
 * Initializes payment with the selected gateway
 */

import { NextRequest, NextResponse } from "next/server";
import { paystackAdapter } from "@/utils/PaymentGateway/adapters/paystack";
import { flutterwaveAdapter } from "@/utils/PaymentGateway/adapters/flutterwave";
import { providusAdapter } from "@/utils/PaymentGateway/adapters/providus";
import { PaymentGateway, GatewayProvider, UnifiedPaymentRequest } from "@/types/gateway.types";

export async function POST(request: NextRequest) {
  try {
    const body: UnifiedPaymentRequest & { gateway: GatewayProvider } = await request.json();

    const {
      gateway,
      amount,
      description,
      type,
      customerEmail,
      customerName,
      customerPhone,
      reference,
      metadata,
      callbackUrl,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!gateway) {
      return NextResponse.json({ error: "Gateway is required" }, { status: 400 });
    }

    if (!amount || !description) {
      return NextResponse.json({ error: "Amount and description are required" }, { status: 400 });
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

    // Initialize payment through the selected adapter
    const result = await adapter.initialize({
      amount,
      description,
      type,
      customerEmail,
      customerName,
      customerPhone,
      reference,
      metadata,
      callbackUrl,
      paymentMethod,
    });

    // TODO: Save transaction to database here
    // await saveTransaction({
    //   reference: result.reference,
    //   gateway: result.gateway,
    //   amount,
    //   status: 'pending',
    //   ...
    // });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Payment initialization error:", error);

    return NextResponse.json(
      {
        error: error.message || "Payment initialization failed",
        success: false,
      },
      { status: 500 }
    );
  }
}
