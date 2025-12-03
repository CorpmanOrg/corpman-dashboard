import React from "react";
import { BulkTransferFormProps, BankAccountDetails } from "@/types/bankTransfer.types";

/**
 * BulkTransferForm Component
 *
 * Displays bank transfer details and manages payment confirmation flow with countdown timer.
 * Supports payment gateway integration with real-time status updates.
 *
 * @component
 * @example
 * ```tsx
 * <BulkTransferForm
 *   countdownTime={300}
 *   isCountdownActive={true}
 *   formatCountdown={(sec) => `${Math.floor(sec/60)}:${sec%60}`}
 *   hasUserPaid={false}
 *   isWaitingForConfirmation={false}
 *   confirmationWaitTime={0}
 *   onPaymentConfirmation={() => console.log('Payment confirmed')}
 * />
 * ```
 */
const BulkTransferForm: React.FC<BulkTransferFormProps> = ({
  countdownTime,
  isCountdownActive,
  formatCountdown,
  hasUserPaid,
  isWaitingForConfirmation,
  confirmationWaitTime,
  onPaymentConfirmation,
  bankDetails = {
    bankName: "Providus Bank",
    accountNumber: "3085542719",
    accountName: "LASG Treasury",
    reference: "LASG2024001",
  },
  amount,
}) => {
  /**
   * Get countdown timer color classes based on remaining time
   */
  const getCountdownColorClasses = (): string => {
    if (countdownTime <= 60) {
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700";
    }
    if (countdownTime <= 180) {
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700";
    }
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700";
  };

  /**
   * Format confirmation wait time as MM:SS
   */
  const formatConfirmationTime = (): string => {
    const minutes = Math.floor(confirmationWaitTime / 60);
    const seconds = confirmationWaitTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /**
   * Get urgency message based on remaining countdown time
   */
  const getUrgencyMessage = (): string => {
    if (countdownTime <= 60) {
      return "Please complete your transfer immediately or the session will expire";
    }
    return "Complete your transfer soon to avoid session timeout";
  };

  return (
    <div className="space-y-4">
      {/* Header with Countdown Timer */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Bank Transfer Details</h4>

        {/* Countdown Timer Badge */}
        {isCountdownActive && !hasUserPaid && (
          <div
            className={`
              flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
              ${getCountdownColorClasses()}
            `}
            role="timer"
            aria-live="polite"
            aria-label={`Time remaining: ${formatCountdown(countdownTime)}`}
          >
            <div className="w-2 h-2 rounded-full animate-pulse bg-current" aria-hidden="true"></div>
            <span className="font-mono">{formatCountdown(countdownTime)}</span>
          </div>
        )}
      </div>

      {/* Payment Confirmation Status */}
      {isWaitingForConfirmation && (
        <div
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Checking for Payment...</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                We&apos;re monitoring your transfer. This usually takes 2-5 minutes.
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono">
                Checking for {formatConfirmationTime()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgency Alert for Low Time */}
      {isCountdownActive && countdownTime <= 120 && (
        <div
          className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <div className="text-lg" aria-hidden="true">
              ⚠️
            </div>
            <div>
              <div className="font-medium text-sm">Time Running Out!</div>
              <div className="text-xs">{getUrgencyMessage()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Transfer the exact amount to the account below and use the reference code
          </p>
          {isCountdownActive && (
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Session expires in {formatCountdown(countdownTime)}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Bank Name:</span>
            <span className="text-sm text-blue-900 dark:text-blue-100">{bankDetails.bankName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Account Number:</span>
            <span className="text-sm font-mono text-blue-900 dark:text-blue-100">{bankDetails.accountNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Account Name:</span>
            <span className="text-sm text-blue-900 dark:text-blue-100">{bankDetails.accountName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Reference:</span>
            <span className="text-sm font-mono text-blue-900 dark:text-blue-100">{bankDetails.reference}</span>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Button */}
      {!hasUserPaid && !isWaitingForConfirmation && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <button
              type="button"
              onClick={onPaymentConfirmation}
              className="w-full flex items-center justify-center px-6 py-2 bg-gradient-to-r from-[#FDB815] to-orange-500 hover:from-orange-500 hover:to-[#FDB815] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Confirm that you have made the payment"
            >
              <span className="text-base">I have made the payment</span>
            </button>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-md p-3 border border-orange-200 dark:border-orange-800">
              <div className="text-xs text-orange-700 dark:text-orange-300">
                💡 <strong>Click this button only after</strong> you&apos;ve successfully sent the transfer from your
                bank. We&apos;ll then verify your payment automatically.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkTransferForm;
