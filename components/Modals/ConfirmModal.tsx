import React from "react";
import BaseModal from "./BaseModal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void; // made optional (since you pass modal.data?.onConfirm)
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
  disableOutsideCloseDuringLoading?: boolean; // optional extra
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  error,
  disableOutsideCloseDuringLoading = true,
}) => {
  const handleRequestClose = () => {
    if (loading && disableOutsideCloseDuringLoading) return;
    onClose();
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm?.();
  };

  return (
    <BaseModal open={open} onClose={handleRequestClose} title="Confirm Action">
      <p className="mb-6">{message}</p>
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}
      <div className="flex gap-4 justify-end">
        <button
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-60"
          onClick={handleRequestClose}
          disabled={loading}
          type="button"
        >
          {cancelLabel}
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white flex items-center justify-center min-w-[90px] disabled:opacity-60"
          onClick={handleConfirm}
          disabled={loading || !onConfirm}
          type="button"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Loading...
            </span>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;
