/**
 * Flutterwave Payment Gateway Adapter
 *
 * Integrates with Flutterwave API for payment processing
 * Documentation: https://developer.flutterwave.com/docs
 */

import {
  PaymentGateway,
  UnifiedPaymentRequest,
  UnifiedPaymentResponse,
  PaymentVerificationResponse,
  RefundResponse,
} from "@/types/gateway.types";

class FlutterwaveAdapter implements PaymentGateway {
  private secretKey: string;
  private publicKey: string;
  private baseUrl = "https://api.flutterwave.com/v3";

  constructor() {
    // In production, get from environment variables
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || "";
    this.publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "";
  }

  /**
   * Initialize a payment with Flutterwave
   */
  async initialize(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      const amount = typeof request.amount === "string" ? parseFloat(request.amount) : request.amount;
      const reference = request.reference || `FLW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const payload = {
        tx_ref: reference,
        amount,
        currency: "NGN",
        redirect_url: request.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        payment_options: this.getPaymentOptions(request.paymentMethod),
        customer: {
          email: request.customerEmail || "customer@example.com",
          name: request.customerName || "Customer",
          phonenumber: request.customerPhone || "",
        },
        customizations: {
          title: "Payment",
          description: request.description,
          logo: process.env.NEXT_PUBLIC_APP_LOGO,
        },
        meta: {
          type: request.type,
          ...request.metadata,
        },
      };

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status !== "success" || !response.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      return {
        success: true,
        reference,
        gateway: "flutterwave",
        paymentUrl: data.data.link,
        message: "Payment initialized successfully",
        metadata: {
          hosted_link: data.data.link,
        },
      };
    } catch (error: any) {
      throw new Error(`Flutterwave initialization failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status
   */
  async verify(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/verify_by_reference?tx_ref=${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status !== "success" || !response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      const transaction = data.data;
      const status = this.mapFlutterwaveStatus(transaction.status);

      return {
        success: status === "success",
        status,
        amount: transaction.amount,
        reference: transaction.tx_ref,
        gateway: "flutterwave",
        paidAt: transaction.created_at,
        transactionId: transaction.id.toString(),
        customerEmail: transaction.customer.email,
        metadata: transaction.meta,
        message: transaction.processor_response || transaction.status,
      };
    } catch (error: any) {
      throw new Error(`Flutterwave verification failed: ${error.message}`);
    }
  }

  /**
   * Process refund
   */
  async refund(transactionId: string, amount: number, reason?: string): Promise<RefundResponse> {
    try {
      const payload = {
        amount,
        comments: reason,
      };

      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status !== "success" || !response.ok) {
        throw new Error(data.message || "Refund failed");
      }

      return {
        success: true,
        refundId: data.data.id.toString(),
        amount: data.data.amount,
        status: "success",
        message: "Refund processed successfully",
        gateway: "flutterwave",
      };
    } catch (error: any) {
      throw new Error(`Flutterwave refund failed: ${error.message}`);
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(reference: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${reference}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status !== "success" || !response.ok) {
        throw new Error(data.message || "Failed to fetch transaction");
      }

      return data.data;
    } catch (error: any) {
      throw new Error(`Flutterwave transaction fetch failed: ${error.message}`);
    }
  }

  /**
   * Map Flutterwave status to unified status
   */
  private mapFlutterwaveStatus(flwStatus: string): "pending" | "success" | "failed" | "abandoned" | "processing" {
    switch (flwStatus.toLowerCase()) {
      case "successful":
        return "success";
      case "failed":
        return "failed";
      case "cancelled":
        return "abandoned";
      case "pending":
        return "pending";
      default:
        return "processing";
    }
  }

  /**
   * Get supported payment options based on payment method
   */
  private getPaymentOptions(paymentMethod?: string): string {
    if (!paymentMethod) return "card,banktransfer,ussd,mobilemoney";

    const optionMap: Record<string, string> = {
      bank_transfer: "banktransfer",
      card: "card",
      ussd: "ussd",
      mobile_money: "mobilemoney",
      qr_code: "qr",
    };

    return optionMap[paymentMethod] || "card,banktransfer,ussd";
  }
}

export const flutterwaveAdapter = new FlutterwaveAdapter();
