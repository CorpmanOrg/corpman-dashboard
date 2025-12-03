/**
 * Payment Gateway Manager
 *
 * Manages multiple payment gateways with automatic fallback and selection logic
 */

import {
  GatewayProvider,
  GatewayConfig,
  UnifiedPaymentRequest,
  UnifiedPaymentResponse,
  GatewayInitializationResult,
  PaymentMethodType,
} from "@/types/gateway.types";

class GatewayManager {
  private gateways: Map<GatewayProvider, GatewayConfig>;

  constructor() {
    this.gateways = new Map();
    this.loadGatewayConfigs();
  }

  /**
   * Load gateway configurations
   * In production, these should come from environment variables or database
   */
  private loadGatewayConfigs(): void {
    const configs: GatewayConfig[] = [
      {
        id: "paystack",
        name: "paystack",
        displayName: "Paystack",
        enabled: true,
        priority: 1,
        features: {
          bankTransfer: true,
          cardPayment: true,
          ussd: true,
          mobileMoney: false,
          qrCode: false,
        },
        limits: {
          min: 100,
          max: 5000000,
          currency: "NGN",
        },
        countries: ["NG", "GH", "ZA"],
      },
      {
        id: "flutterwave",
        name: "flutterwave",
        displayName: "Flutterwave",
        enabled: true,
        priority: 2,
        features: {
          bankTransfer: true,
          cardPayment: true,
          ussd: true,
          mobileMoney: true,
          qrCode: false,
        },
        limits: {
          min: 100,
          max: 10000000,
          currency: "NGN",
        },
        countries: ["NG", "GH", "KE", "UG", "ZA"],
      },
      {
        id: "providus",
        name: "providus",
        displayName: "Providus Bank",
        enabled: true,
        priority: 3,
        features: {
          bankTransfer: true,
          cardPayment: false,
          ussd: false,
          mobileMoney: false,
          qrCode: false,
        },
        limits: {
          min: 100,
          max: 50000000,
          currency: "NGN",
        },
        countries: ["NG"],
      },
      {
        id: "stripe",
        name: "stripe",
        displayName: "Stripe",
        enabled: false, // Disabled by default for Nigerian market
        priority: 4,
        features: {
          bankTransfer: false,
          cardPayment: true,
          ussd: false,
          mobileMoney: false,
          qrCode: false,
        },
        limits: {
          min: 50,
          max: 999999999,
          currency: "USD",
        },
        countries: ["US", "GB", "CA"],
      },
      {
        id: "monnify",
        name: "monnify",
        displayName: "Monnify",
        enabled: false,
        priority: 5,
        features: {
          bankTransfer: true,
          cardPayment: true,
          ussd: false,
          mobileMoney: false,
          qrCode: false,
        },
        limits: {
          min: 100,
          max: 10000000,
          currency: "NGN",
        },
        countries: ["NG"],
      },
      {
        id: "squad",
        name: "squad",
        displayName: "Squad",
        enabled: false,
        priority: 6,
        features: {
          bankTransfer: true,
          cardPayment: true,
          ussd: false,
          mobileMoney: false,
          qrCode: true,
        },
        limits: {
          min: 100,
          max: 5000000,
          currency: "NGN",
        },
        countries: ["NG"],
      },
    ];

    configs.forEach((config) => this.gateways.set(config.id, config));
  }

  /**
   * Get all available (enabled) gateways sorted by priority
   */
  getAvailableGateways(): GatewayConfig[] {
    return Array.from(this.gateways.values())
      .filter((g) => g.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get a specific gateway configuration
   */
  getGateway(provider: GatewayProvider): GatewayConfig | undefined {
    return this.gateways.get(provider);
  }

  /**
   * Select the best gateway based on amount, payment method, and country
   */
  selectBestGateway(
    amount: number | string,
    paymentMethod?: PaymentMethodType,
    country?: string
  ): GatewayProvider | null {
    const available = this.getAvailableGateways();
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    for (const gateway of available) {
      // Check if gateway supports the payment method
      if (paymentMethod) {
        const supportsMethod = this.gatewaySupportsMethod(gateway, paymentMethod);
        if (!supportsMethod) continue;
      }

      // Check amount limits
      if (numAmount < gateway.limits.min || numAmount > gateway.limits.max) {
        continue;
      }

      // Check country support
      if (country && gateway.countries && !gateway.countries.includes(country)) {
        continue;
      }

      return gateway.id;
    }

    // If no perfect match, return the highest priority gateway
    return available[0]?.id || null;
  }

  /**
   * Check if a gateway supports a specific payment method
   */
  private gatewaySupportsMethod(gateway: GatewayConfig, method: PaymentMethodType): boolean {
    switch (method) {
      case "bank_transfer":
        return gateway.features.bankTransfer;
      case "card":
        return gateway.features.cardPayment;
      case "ussd":
        return gateway.features.ussd;
      case "mobile_money":
        return gateway.features.mobileMoney;
      case "qr_code":
        return gateway.features.qrCode;
      default:
        return false;
    }
  }

  /**
   * Initialize payment with automatic fallback to other gateways if the preferred one fails
   */
  async initializePaymentWithFallback(
    request: UnifiedPaymentRequest,
    preferredGateway?: GatewayProvider
  ): Promise<GatewayInitializationResult> {
    const gateways = this.getAvailableGateways();
    const attemptedGateways: GatewayProvider[] = [];
    let lastError: Error | null = null;

    // Try preferred gateway first
    if (preferredGateway) {
      const preferred = gateways.find((g) => g.id === preferredGateway);
      if (preferred) {
        attemptedGateways.push(preferredGateway);
        try {
          const result = await this.callGatewayAPI(preferredGateway, request);
          return {
            ...result,
            attemptedGateways,
            fallbackUsed: false,
          };
        } catch (error) {
          console.warn(`Preferred gateway ${preferredGateway} failed:`, error);
          lastError = error as Error;
        }
      }
    }

    // Fallback to other gateways in priority order
    for (const gateway of gateways) {
      if (gateway.id === preferredGateway) continue; // Already tried

      attemptedGateways.push(gateway.id);
      try {
        const result = await this.callGatewayAPI(gateway.id, request);
        return {
          ...result,
          attemptedGateways,
          fallbackUsed: true,
        };
      } catch (error) {
        console.warn(`Gateway ${gateway.id} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    // All gateways failed
    throw new Error(`All payment gateways failed. Last error: ${lastError?.message || "Unknown error"}`);
  }

  /**
   * Call the backend API to initialize payment with a specific gateway
   */
  private async callGatewayAPI(
    gateway: GatewayProvider,
    request: UnifiedPaymentRequest
  ): Promise<UnifiedPaymentResponse> {
    const response = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gateway,
        ...request,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Payment initialization failed");
    }

    return data;
  }

  /**
   * Verify payment status
   */
  async verifyPayment(reference: string, gateway: GatewayProvider): Promise<any> {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference,
        gateway,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Payment verification failed");
    }

    return data;
  }

  /**
   * Get list of gateways that support a specific payment method
   */
  getGatewaysByPaymentMethod(method: PaymentMethodType): GatewayConfig[] {
    return this.getAvailableGateways().filter((gateway) => this.gatewaySupportsMethod(gateway, method));
  }

  /**
   * Enable or disable a gateway dynamically
   */
  setGatewayStatus(provider: GatewayProvider, enabled: boolean): void {
    const gateway = this.gateways.get(provider);
    if (gateway) {
      gateway.enabled = enabled;
    }
  }

  /**
   * Update gateway priority
   */
  setGatewayPriority(provider: GatewayProvider, priority: number): void {
    const gateway = this.gateways.get(provider);
    if (gateway) {
      gateway.priority = priority;
    }
  }
}

// Export singleton instance
export const gatewayManager = new GatewayManager();
