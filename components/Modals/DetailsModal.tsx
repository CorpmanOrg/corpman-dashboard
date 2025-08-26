import React from "react";
import BaseModal from "./BaseModal";

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, title, children }) => (
  <BaseModal open={open} onClose={onClose} title={title}>
    {children}
  </BaseModal>
);

export default DetailsModal;