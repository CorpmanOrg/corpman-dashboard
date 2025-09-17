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
          color="linear-gradient(to right, #5aed5f, #1b951fff)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
