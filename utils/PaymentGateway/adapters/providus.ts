/**
 * Providus Bank Payment Gateway Adapter
 *
 * Integrates with Providus Bank API for bank transfer payments
 */

import {
  PaymentGateway,
  UnifiedPaymentRequest,
  UnifiedPaymentResponse,
  PaymentVerificationResponse,
} from "@/types/gateway.types";

class ProvidusAdapter implements PaymentGateway {
  private clientId: string;
  private clientSecret: string;
  private baseUrl = "https://vps.providusbank.com/vps/api";

  constructor() {
    // In production, get from environment variables
    this.clientId = process.env.PROVIDUS_CLIENT_ID || "";
    this.clientSecret = process.env.PROVIDUS_CLIENT_SECRET || "";
  }

  /**
   * Initialize a payment with Providus Bank (Generate Virtual Account)
   */
  async initialize(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      const amount = typeof request.amount === "string" ? parseFloat(request.amount) : request.amount;
      const reference = request.reference || `PROV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Providus generates a virtual account for bank transfer
      const payload = {
        account_name: request.customerName || "Customer",
        bvn: "", // Optional: Can be collected if needed
        email: request.customerEmail,
        phoneNumber: request.customerPhone,
        amount,
        currency_code: "NGN",
        transaction_reference: reference,
      };

      const response = await fetch(`${this.baseUrl}/PiPCreateDynamicAccountNumber`, {
        method: "POST",
        headers: {
          "Client-Id": this.clientId,
          "X-Auth-Signature": this.generateSignature(payload),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.responseCode !== "00") {
        throw new Error(data.responseMessage || "Failed to generate virtual account");
      }

      return {
        success: true,
        reference,
        gateway: "providus",
        accountDetails: {
          bankName: "Providus Bank",
          accountNumber: data.account_number,
          accountName: data.account_name,
          reference: reference,
          expiresAt: this.calculateExpiry(5), // 5 minutes expiry
        },
        message: "Virtual account generated successfully",
        metadata: {
          accountDuration: 5,
          settlementAccount: data.settlement_account,
        },
      };
    } catch (error: any) {
      throw new Error(`Providus initialization failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status
   */
  async verify(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/PiPVerifyTransaction_JSON`, {
        method: "POST",
        headers: {
          "Client-Id": this.clientId,
          "X-Auth-Signature": this.generateSignature({ transaction_reference: reference }),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_reference: reference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.responseMessage || "Payment verification failed");
      }

      const status = this.mapProvidusStatus(data.responseCode);

      return {
        success: status === "success",
        status,
        amount: parseFloat(data.amount || "0"),
        reference,
        gateway: "providus",
        paidAt: data.transaction_date,
        transactionId: data.transaction_id,
        customerEmail: data.customer_email,
        message: data.responseMessage,
      };
    } catch (error: any) {
      throw new Error(`Providus verification failed: ${error.message}`);
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(reference: string): Promise<any> {
    // Providus uses the same endpoint for verification and transaction details
    return this.verify(reference);
  }

  /**
   * Generate HMAC signature for Providus API
   */
  private generateSignature(payload: any): string {
    // In production, implement proper HMAC-SHA512 signature
    // This is a placeholder - actual implementation requires crypto
    const crypto = require("crypto");
    const message = JSON.stringify(payload);
    return crypto.createHmac("sha512", this.clientSecret).update(message).digest("hex");
  }

  /**
   * Map Providus response code to unified status
   */
  private mapProvidusStatus(responseCode: string): "pending" | "success" | "failed" | "abandoned" | "processing" {
    switch (responseCode) {
      case "00":
        return "success";
      case "01":
        return "pending";
      case "02":
      case "03":
        return "failed";
      default:
        return "processing";
    }
  }

  /**
   * Calculate expiry time (ISO string)
   */
  private calculateExpiry(minutes: number): string {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry.toISOString();
  }
}

export const providusAdapter = new ProvidusAdapter();
