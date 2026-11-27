import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { NavigationProgressBar } from "@/components/storefront/navigation-progress-bar";

export const metadata: Metadata = {
  title: "MAULI FASHION | High Cold Winter Lifestyle & Outerwear",
  description:
    "MAULI FASHION international winter fashion and technical outerwear engineered for extreme sub-zero alpine conditions and timeless urban transit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas text-charcoal font-sans antialiased min-h-screen" suppressHydrationWarning>
        <NavigationProgressBar />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
