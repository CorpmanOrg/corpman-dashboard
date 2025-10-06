// app/layout.tsx
import React from "react";
import type { Metadata } from "next";
import { montserrat } from "./fonts";
import Providers from "./providers";
import NextTopLoader from "nextjs-toploader";
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
        <NextTopLoader
          color="linear-gradient(to right, #10b981, #059669)"
          initialPosition={0.08}
          crawlSpeed={150}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={150}
          shadow="0 0 10px #10b981,0 0 5px #10b981"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
