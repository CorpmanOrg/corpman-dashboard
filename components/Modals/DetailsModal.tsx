import React from "react";
import BaseModal from "./BaseModal";

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string
  height?: number | string
}

const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, title, children, width, height }) => (
  <BaseModal open={open} onClose={onClose} title={title} width={width} height={height}>
    {children}
  </BaseModal>
);

export default DetailsModal;