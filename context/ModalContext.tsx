import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "confirm" | "form" | "details" | "reject" | null;

interface ModalState {
  type: ModalType;
  data?: any;
}

interface ModalContextProps {
  modal: ModalState;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState>({ type: null, data: undefined });

  const openModal = (type: ModalType, data?: any) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: undefined });

  return <ModalContext.Provider value={{ modal, openModal, closeModal }}>{children}</ModalContext.Provider>;
};
