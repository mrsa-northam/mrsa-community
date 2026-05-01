import type { Metadata } from "next";
import "./globals.css";
import { AppSessionProvider } from "./tennis-app";

export const metadata: Metadata = {
  title: "MRSA Tennis",
  description: "MRSA player login, tournament registration, dashboard, and profile experience."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppSessionProvider>{children}</AppSessionProvider>
      </body>
    </html>
  );
}
