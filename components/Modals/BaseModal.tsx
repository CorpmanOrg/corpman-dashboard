import React from "react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: number | string;
}

const BaseModal: React.FC<BaseModalProps> = ({ open, onClose, children, title, width = 400 }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 relative"
        style={{ width }}
      >
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;