import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientChatWrapper from "@/components/ClientChatWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UGCFY Brand Portal | Escrow UGC Creator Marketplace",
  description: "Scale your brand content with vetted micro-influencers and creators. Manage mandates, review video submissions, and distribute escrow payouts securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-gray-900" suppressHydrationWarning>
        {children}
        <ClientChatWrapper />
      </body>
    </html>
  );
}
