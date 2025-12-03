/**
 * Payment Gateway Types
 *
 * Defines unified interfaces for multi-gateway payment integration
 */

/**
 * Supported payment gateway providers
 */
export type GatewayProvider = "paystack" | "flutterwave" | "stripe" | "providus" | "monnify" | "squad";

/**
 * Payment method types supported by gateways
 */
export type PaymentMethodType = "bank_transfer" | "card" | "ussd" | "mobile_money" | "qr_code";

/**
 * Gateway configuration
 */
export interface GatewayConfig {
  id: GatewayProvider;
  name: string;
  displayName: string;
  logo?: string;
  enabled: boolean;
  priority: number; // Lower number = higher priority (for fallback ordering)
  features: {
    bankTransfer: boolean;
    cardPayment: boolean;
    ussd: boolean;
    mobileMoney: boolean;
    qrCode: boolean;
  };
  limits: {
    min: number;
    max: number;
    currency: string;
  };
  countries?: string[]; // Supported countries (ISO codes)
}

/**
 * Unified payment request (from your app to gateway)
 */
export interface UnifiedPaymentRequest {
  amount: number | string;
  description: string;
  type: string; // contribution_deposit, savings_withdrawal, etc.
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  reference?: string; // Optional custom reference
  metadata?: Record<string, any>;
  callbackUrl?: string;
  paymentMethod?: PaymentMethodType;
}

/**
 * Bank account details for bank transfer payments
 */
export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  reference: string;
  expiresAt?: string;
}

/**
 * Unified payment response (from gateway to your app)
 */
export interface UnifiedPaymentResponse {
  success: boolean;
  reference: string;
  gateway: GatewayProvider;
  paymentUrl?: string; // For redirect-based payments (cards, etc.)
  accountDetails?: BankAccountDetails; // For bank transfer
  qrCode?: string; // For QR code payments
  ussdCode?: string; // For USSD payments
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Payment verification response
 */
export interface PaymentVerificationResponse {
  success: boolean;
  status: "pending" | "success" | "failed" | "abandoned" | "processing";
  amount: number;
  reference: string;
  gateway: GatewayProvider;
  paidAt?: string;
  transactionId?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
  message?: string;
}

/**
 * Refund response
 */
export interface RefundResponse {
  success: boolean;
  refundId: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  message: string;
  gateway: GatewayProvider;
}

/**
 * Payment gateway interface
 * All gateway adapters must implement this interface
 */
export interface PaymentGateway {
  /**
   * Initialize a payment transaction
   */
  initialize(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse>;

  /**
   * Verify payment status
   */
  verify(reference: string): Promise<PaymentVerificationResponse>;

  /**
   * Process refund (optional - not all gateways support this)
   */
  refund?(transactionId: string, amount: number, reason?: string): Promise<RefundResponse>;

  /**
   * Get transaction details
   */
  getTransaction?(reference: string): Promise<any>;
}

/**
 * Gateway initialization result with fallback info
 */
export interface GatewayInitializationResult extends UnifiedPaymentResponse {
  attemptedGateways?: GatewayProvider[];
  fallbackUsed?: boolean;
}

/**
 * Webhook payload structure
 */
export interface WebhookPayload {
  event: string;
  data: any;
  gateway: GatewayProvider;
}

/**
 * Gateway health status
 */
export interface GatewayHealthStatus {
  gateway: GatewayProvider;
  healthy: boolean;
  lastChecked: string;
  responseTime?: number;
  errorMessage?: string;
}
