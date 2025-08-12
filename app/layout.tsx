// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { montserrat } from "./fonts";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern admin dashboard with dark mode support",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
