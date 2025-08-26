// app/providers.tsx
"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext"; // <-- Import your ModalProvider

// This ensures the QueryClient is created in the client-side
export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system">
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
