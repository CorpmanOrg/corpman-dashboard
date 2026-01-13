import React, { useEffect, useState, useRef } from "react";
import { PaymentMethod, PaymentMethodId, PaymentModalProps, PaymentStep } from "@/types/payment.types";
import { LucideIcon } from "lucide-react";
import { Building, Wallet, X, Lock } from "lucide-react";
import { gatewayManager } from "@/utils/PaymentGateway/GatewayManager";
import BulkTransferForm from "./BulkTransferForm";

// PaymentModal temporarily disabled — original implementation moved to VCS.
// Re-enable by restoring the previous implementation from history.

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentData }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod["id"] | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("methods");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [countdownTime, setCountdownTime] = useState<number>(300);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [availableGateways, setAvailableGateways] = useState<any[]>([]);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);

  // ✅ User confirmation flow ("I have made payment")
  const [hasUserPaid, setHasUserPaid] = useState<boolean>(false);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState<boolean>(false);
  const [confirmationWaitTime, setConfirmationWaitTime] = useState<number>(0);

  const modalRef = useRef<HTMLDivElement>(null);

  /** ===============================
   *  💳 Payment Methods
   *  =============================== */
  const paymentMethods: PaymentMethod[] = [
    {
      id: "bank",
      title: "Pay by Bank Transfer",
      icon: Building,
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      accentColor: "border-l-[#FDB815]",
      disabled: false,
    },
    {
      id: "debit",
      title: "Pay by Direct Debit",
      icon: Wallet,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      accentColor: "border-l-purple-500",
      disabled: true,
      disabledReason: "Coming soon",
    },
  ];

  /** ===============================
   *  🎯 Effects
   *  =============================== */
  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Escape key + scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isProcessing, onClose]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCountdownActive && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            setIsCountdownActive(false);
            onClose(); // Auto-close when expired
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountdownActive, countdownTime, onClose]);

  // Load available gateways when modal opens
  useEffect(() => {
    if (isOpen) {
      const gateways = gatewayManager.getAvailableGateways();
      setAvailableGateways(gateways);

      // Auto-select best gateway based on payment data
      if (paymentData?.amount) {
        const paymentMethod = selectedMethod === "bank" ? "bank_transfer" : undefined;
        const best = gatewayManager.selectBestGateway(paymentData.amount, paymentMethod as any);
        setSelectedGateway(best);
      } else {
        // Default to first available gateway
        setSelectedGateway(gateways[0]?.id || null);
      }
    }
  }, [isOpen, paymentData, selectedMethod]);

  // Start countdown only for Bank Transfer
  useEffect(() => {
    if (selectedMethod === "bank" && !isCountdownActive && countdownTime === 300) {
      setIsCountdownActive(true);
    } else if (selectedMethod !== "bank") {
      setIsCountdownActive(false);
      setCountdownTime(300);
    }
  }, [selectedMethod, isCountdownActive, countdownTime]);

  // Confirmation wait timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isWaitingForConfirmation) {
      interval = setInterval(() => setConfirmationWaitTime((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWaitingForConfirmation]);

  /** ===============================
   *  ⚙️ Handlers
   *  =============================== */
  const handleMethodSelect = (methodId: PaymentMethodId): void => {
    setSelectedMethod(methodId);
  };

  const handlePaymentConfirmation = (): void => {
    setHasUserPaid(true);
    setIsWaitingForConfirmation(true);
    setConfirmationWaitTime(0);
    handlePayment();
  };

  // 🎬 Main Payment Flow (Simulated)
  const handlePayment = async (): Promise<void> => {
    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      // Step 1: Initial processing
      await new Promise((r) => setTimeout(r, 1000));
      setPaymentStep("validating");

      // Step 2: Validation
      await new Promise((r) => setTimeout(r, 1500));

      // Random failure simulation (30% chance)
      if (Math.random() < 0.3) {
        const errors: string[] = [
          "Account validation failed",
          "Insufficient funds in account",
          "Network connection error",
          "Transaction authorization failed",
        ];
        throw new Error(errors[Math.floor(Math.random() * errors.length)]);
      }

      // Step 3: Authorization
      setPaymentStep("authorizing");
      await new Promise((r) => setTimeout(r, 2000));

      // Step 4: Completion
      setPaymentStep("completing");
      await new Promise((r) => setTimeout(r, 1000));

      // Step 5: Success
      setPaymentStep("success");

      // Step 6: Receipt generation
      setTimeout(async () => {
        setPaymentStep("generating_receipt");
        await new Promise((r) => setTimeout(r, 2000));
        setPaymentStep("receipt_ready");

        // Auto close after receipt ready
        setTimeout(() => {
          onClose();
          setPaymentStep("methods");
          setSelectedMethod(null);
          setIsProcessing(false);
        }, 4000);
      }, 2000);
    } catch (error) {
      // 🧨 Handle simulated failure
      setPaymentStep("failed");
      setIsProcessing(false);

      // Reset after delay
      setTimeout(() => {
        setPaymentStep("methods");
      }, 4000);
    }
  };

  const handleClose = (): void => {
    if (!isProcessing) {
      onClose();
      setSelectedMethod(null);
      setPaymentStep("methods");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && !isProcessing) {
      handleClose();
    }
  };

  const formatCountdown = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  /** ===============================
   *  💅 UI: Conditional Rendering
   *  =============================== */
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/45 to-gray-900/40 backdrop-blur-md" />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-2xl bg-gradient-to-br from-white via-white to-gray-50/30 
          dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50 rounded-2xl border border-gray-200/60 
          dark:border-gray-700/60 shadow-2xl overflow-hidden flex flex-col backdrop-blur-sm 
          transform transition-all duration-500 ease-out
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 via-white to-gray-50/80 dark:from-gray-900/80 dark:via-gray-800 dark:to-gray-900/60 border-b border-gray-200/40 dark:border-gray-700/40">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Providus Logo" className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Secured by Providus</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Enterprise Payment Gateway</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="group p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* 💥 Payment States (Success, Generating, Receipt) */}
        {(paymentStep === "success" ||
          paymentStep === "generating_receipt" ||
          paymentStep === "receipt_ready" ||
          paymentStep === "failed") && (
          <div className="absolute inset-0 z-10 bg-white dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center px-6 py-8 max-w-md">
              {paymentStep === "success" && (
                <>
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold text-[#FDB815] mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 dark:text-gray-300">Processing your receipt...</p>
                </>
              )}

              {paymentStep === "failed" && (
                <>
                  <div className="text-4xl mb-3">❌</div>
                  <h3 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Something went wrong during payment. Please try again.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* 💳 Payment Body */}
        {/* 💳 Payment Body */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden transition-all duration-300 max-h-[85vh]">
          {/* Left: Payment Method List */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-gray-200/40 dark:border-gray-700/40 overflow-y-auto max-h-[85vh]">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Choose Payment Method</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select how you’d like to pay</p>

            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                const isDisabled = method.disabled || isProcessing;
                return (
                  <button
                    key={method.id}
                    onClick={() => !method.disabled && handleMethodSelect(method.id)}
                    disabled={isDisabled}
                    className={`group w-full p-4 rounded-xl border-2 text-left transition-all duration-300 relative ${
                      isDisabled
                        ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        : isSelected
                        ? `${method.color} border-l-4 ${method.accentColor} shadow-lg ring-2 ring-[#FDB815]/20`
                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-[#FDB815]/30"
                    }`}
                    aria-label={`${method.title}${method.disabled ? ` - ${method.disabledReason || "Disabled"}` : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          isDisabled
                            ? "bg-gray-200 dark:bg-gray-700"
                            : isSelected
                            ? "bg-gradient-to-br from-[#FDB815] to-amber-600"
                            : "bg-gray-100 dark:bg-gray-600 group-hover:bg-[#FDB815]/10"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isDisabled
                              ? "text-gray-400 dark:text-gray-500"
                              : isSelected
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300 group-hover:text-[#FDB815]"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`font-semibold text-sm ${
                            isDisabled
                              ? "text-gray-500 dark:text-gray-400"
                              : isSelected
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {method.title}
                        </span>
                        {method.disabled && method.disabledReason && (
                          <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {method.disabledReason}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Payment Details */}
          <div className="flex-1 p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/20 overflow-y-auto max-h-[85vh]">
            {!selectedMethod ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Lock className="w-10 h-10 text-gray-400 mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Select a Payment Method</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Choose your preferred option to continue securely.
                </p>
              </div>
            ) : (
              <>
                {/* Payment Summary */}
                <div className="bg-[#FDB815]/5 p-4 rounded-lg border border-[#FDB815]/20 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-[#FDB815]">{`₦${paymentData?.amount || "200.00"}`}</span>
                  </div>
                </div>

                {/* Payment Form */}
                {selectedMethod === "bank" && (
                  <BulkTransferForm
                    countdownTime={countdownTime}
                    isCountdownActive={isCountdownActive}
                    formatCountdown={formatCountdown}
                    hasUserPaid={hasUserPaid}
                    isWaitingForConfirmation={isWaitingForConfirmation}
                    confirmationWaitTime={confirmationWaitTime}
                    onPaymentConfirmation={handlePaymentConfirmation}
                  />
                )}
                {/* {selectedMethod === "debit" && <DirectDebitForm />} */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
