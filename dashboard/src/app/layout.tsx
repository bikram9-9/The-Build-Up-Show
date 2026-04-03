import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Build Up — Outreach Dashboard",
  description: "Manage podcast guest outreach for The Build Up Show",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex font-sans">
        <Sidebar />
        <main className="flex-1 bg-gray-50/50 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
