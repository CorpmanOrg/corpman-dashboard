"use client";
import React, { createContext, useContext, useState } from "react";
import RouteLoader from "@/components/Loading/RouteLoader";

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  loadingMessage: "Loading...",
  setLoading: () => {},
});

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const setLoading = (loading: boolean, message: string = "Loading...") => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, setLoading }}>
      {children}
      <RouteLoader isLoading={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
