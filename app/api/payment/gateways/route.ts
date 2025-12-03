/**
 * Get Available Gateways API Route
 *
 * GET /api/payment/gateways
 * Returns list of available payment gateways
 */

import { NextRequest, NextResponse } from "next/server";
import { gatewayManager } from "@/utils/PaymentGateway/GatewayManager";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const amount = searchParams.get("amount");
    const paymentMethod = searchParams.get("paymentMethod");
    const country = searchParams.get("country");

    let gateways = gatewayManager.getAvailableGateways();

    // Filter by payment method if provided
    if (paymentMethod) {
      gateways = gatewayManager.getGatewaysByPaymentMethod(paymentMethod as any);
    }

    // If amount is provided, filter by amount limits
    if (amount) {
      const numAmount = parseFloat(amount);
      gateways = gateways.filter((gw) => numAmount >= gw.limits.min && numAmount <= gw.limits.max);
    }

    // Filter by country if provided
    if (country) {
      gateways = gateways.filter((gw) => !gw.countries || gw.countries.includes(country.toUpperCase()));
    }

    // Suggest best gateway
    let suggestedGateway = null;
    if (amount && paymentMethod) {
      suggestedGateway = gatewayManager.selectBestGateway(
        parseFloat(amount),
        paymentMethod as any,
        country || undefined
      );
    }

    return NextResponse.json({
      success: true,
      gateways,
      suggested: suggestedGateway,
      total: gateways.length,
    });
  } catch (error: any) {
    console.error("Error fetching gateways:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch gateways",
        success: false,
      },
      { status: 500 }
    );
  }
}
