import type { Metadata, Viewport } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import { NotificationContext } from "./contexts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: '(隣) Tonari.io',
  title: "Tonari.io",
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
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <body className={inter.className}>
        <Navigation />
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
