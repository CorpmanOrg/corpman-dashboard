import { LucideIcon } from "lucide-react";

/**
 * Payment step states during the payment flow
 */
export type PaymentStep =
  | "methods"
  | "processing"
  | "validating"
  | "authorizing"
  | "completing"
  | "success"
  | "failed"
  | "generating_receipt"
  | "receipt_ready";

/**
 * Payment method identifiers
 */
export type PaymentMethodId = "bank" | "debit";

/**
 * Payment method configuration
 */
export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  icon: LucideIcon;
  color: string;
  accentColor: string;
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * Payment data passed to the modal
 */
export interface PaymentData {
  amount?: number | string;
  description?: string;
  type?: string;
  reference?: string;
  [key: string]: any;
}

/**
 * Props for the PaymentModal component
 */
export interface PaymentModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Payment data including amount and other details */
  paymentData?: PaymentData;
}
