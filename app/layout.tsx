import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";

export const metadata: Metadata = {
  title: "VALLIS & ORE | High Cold Winter Lifestyle & Outerwear",
  description:
    "International winter fashion and technical outerwear engineered for extreme sub-zero alpine conditions and timeless urban transit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas text-charcoal font-sans antialiased min-h-screen" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
