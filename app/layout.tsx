import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Midway Restaurant - Business Dashboard",
  description: "Manage your restaurant orders and notifications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">{children}</body>
    </html>
  );
}
