import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";

interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  onReject?: (reason: string) => void;
  message: string;
  rejectLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
  disableOutsideCloseDuringLoading?: boolean; // optional extra
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  open,
  onClose,
  onReject,
  message,
  rejectLabel = "Reject",
  cancelLabel = "Cancel",
  loading = false,
  error,
  disableOutsideCloseDuringLoading = true,
}) => {
  const [reason, setReason] = useState("");

  // Reset reason whenever modal opens/closes
  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleRequestClose = () => {
    if (loading && disableOutsideCloseDuringLoading) return;
    onClose();
  };

  const handleReject = () => {
    if (loading || !reason.trim()) return;
    onReject?.(reason.trim());
  };

  return (
    <BaseModal open={open} onClose={handleRequestClose} title="Reject Payment">
      <p className="mb-4">{message}</p>

      <textarea
        className="w-full border border-gray-300 rounded-md p-2 mb-4 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
        placeholder="Enter rejection reason..."
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={loading}
      />

      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <div className="flex gap-4 justify-end">
        <button
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-60"
          onClick={handleRequestClose}
          disabled={loading}
          type="button"
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 rounded bg-red-600 text-white flex items-center justify-center min-w-[90px] disabled:opacity-60"
          onClick={handleReject}
          disabled={loading || !reason.trim()}
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
              Rejecting...
            </span>
          ) : (
            "Reject"
          )}
        </button>
      </div>
    </BaseModal>
  );
};

export default RejectionModal;
