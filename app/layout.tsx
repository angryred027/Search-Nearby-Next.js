import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: '(隣) tonari.app',
  title: "tonari.app",
  description: "An app for collecting locations and activities of interest and quickly locating them when nearby",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tonari",
    // startupImage: []
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport: Viewport = {
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
