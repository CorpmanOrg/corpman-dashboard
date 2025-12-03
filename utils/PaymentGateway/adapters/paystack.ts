/**
 * Paystack Payment Gateway Adapter
 *
 * Integrates with Paystack API for payment processing
 * Documentation: https://paystack.com/docs/api/
 */

import {
  PaymentGateway,
  UnifiedPaymentRequest,
  UnifiedPaymentResponse,
  PaymentVerificationResponse,
  RefundResponse,
} from "@/types/gateway.types";

class PaystackAdapter implements PaymentGateway {
  private secretKey: string;
  private publicKey: string;
  private baseUrl = "https://api.paystack.co";

  constructor() {
    // In production, get from environment variables
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || "";
    this.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  }

  /**
   * Initialize a payment with Paystack
   */
  async initialize(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      // Convert amount to kobo (Paystack uses lowest currency unit)
      const amountInKobo = this.convertToKobo(request.amount);

      // Generate unique reference if not provided
      const reference = request.reference || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const payload = {
        email: request.customerEmail || "customer@example.com",
        amount: amountInKobo,
        reference,
        currency: "NGN",
        callback_url: request.callbackUrl,
        metadata: {
          description: request.description,
          type: request.type,
          customer_name: request.customerName,
          ...request.metadata,
        },
        channels: this.getChannels(request.paymentMethod),
      };

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.status || !response.ok) {
        throw new Error(data.message || "Payment initialization failed");
      }

      return {
        success: true,
        reference: data.data.reference,
        gateway: "paystack",
        paymentUrl: data.data.authorization_url,
        message: "Payment initialized successfully",
        metadata: {
          access_code: data.data.access_code,
        },
      };
    } catch (error: any) {
      throw new Error(`Paystack initialization failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status
   */
  async verify(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.status || !response.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      const transaction = data.data;

      // Map Paystack status to our unified status
      const status = this.mapPaystackStatus(transaction.status);

      return {
        success: status === "success",
        status,
        amount: transaction.amount / 100, // Convert from kobo to naira
        reference: transaction.reference,
        gateway: "paystack",
        paidAt: transaction.paid_at,
        transactionId: transaction.id.toString(),
        customerEmail: transaction.customer.email,
        metadata: transaction.metadata,
        message: transaction.gateway_response,
      };
    } catch (error: any) {
      throw new Error(`Paystack verification failed: ${error.message}`);
    }
  }

  /**
   * Process refund
   */
  async refund(transactionId: string, amount: number, reason?: string): Promise<RefundResponse> {
    try {
      const amountInKobo = this.convertToKobo(amount);

      const payload = {
        transaction: transactionId,
        amount: amountInKobo,
        merchant_note: reason,
      };

      const response = await fetch(`${this.baseUrl}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.status || !response.ok) {
        throw new Error(data.message || "Refund failed");
      }

      return {
        success: true,
        refundId: data.data.id.toString(),
        amount: data.data.amount / 100,
        status: "success",
        message: "Refund processed successfully",
        gateway: "paystack",
      };
    } catch (error: any) {
      throw new Error(`Paystack refund failed: ${error.message}`);
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(reference: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/${reference}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.status || !response.ok) {
        throw new Error(data.message || "Failed to fetch transaction");
      }

      return data.data;
    } catch (error: any) {
      throw new Error(`Paystack transaction fetch failed: ${error.message}`);
    }
  }

  /**
   * Convert amount to kobo (smallest currency unit)
   */
  private convertToKobo(amount: number | string): number {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return Math.round(numAmount * 100);
  }

  /**
   * Map Paystack status to unified status
   */
  private mapPaystackStatus(paystackStatus: string): "pending" | "success" | "failed" | "abandoned" | "processing" {
    switch (paystackStatus.toLowerCase()) {
      case "success":
        return "success";
      case "failed":
        return "failed";
      case "abandoned":
        return "abandoned";
      case "pending":
        return "pending";
      default:
        return "processing";
    }
  }

  /**
   * Get supported payment channels based on payment method
   */
  private getChannels(paymentMethod?: string): string[] | undefined {
    if (!paymentMethod) return undefined;

    const channelMap: Record<string, string[]> = {
      bank_transfer: ["bank", "bank_transfer"],
      card: ["card"],
      ussd: ["ussd"],
      mobile_money: ["mobile_money"],
      qr_code: ["qr"],
    };

    return channelMap[paymentMethod];
  }
}

export const paystackAdapter = new PaystackAdapter();
