/**
 * Bank account details for transfer
 */
export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  reference: string;
}

/**
 * Props for the BulkTransferForm component
 */
export interface BulkTransferFormProps {
  /** Countdown time in seconds */
  countdownTime: number;
  /** Whether the countdown timer is active */
  isCountdownActive: boolean;
  /** Function to format countdown time as MM:SS */
  formatCountdown: (seconds: number) => string;
  /** Whether the user has confirmed payment */
  hasUserPaid: boolean;
  /** Whether the system is waiting for payment confirmation */
  isWaitingForConfirmation: boolean;
  /** Time spent waiting for confirmation in seconds */
  confirmationWaitTime: number;
  /** Callback when user confirms they made the payment */
  onPaymentConfirmation: () => void;
  /** Optional bank account details (defaults to Providus Bank LASG Treasury) */
  bankDetails?: BankAccountDetails;
  /** Optional amount to display in alerts and messages */
  amount?: number | string;
}
