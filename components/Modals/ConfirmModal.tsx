import React from "react";
import BaseModal from "./BaseModal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => (
  <BaseModal open={open} onClose={onClose} title="Confirm Action">
    <p className="mb-6">{message}</p>
    <div className="flex gap-4 justify-end">
      <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
        {cancelLabel}
      </button>
      <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  </BaseModal>
);

export default ConfirmModal;
