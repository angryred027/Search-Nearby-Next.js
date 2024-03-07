import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";
import Providers from "./utils/providers";
import Notify from "./components/notify";
import Search from "./components/search";

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
        <Providers>
          <Navigation />
          <div className="absolute z-10 w-full justify-center flex flex-row gap-4 top-16 justify-center h-[72px] backdrop-blur backdrop-filter bg-gray-800/10">
            <div className="max-w-prose p-4 flex flex-row flex-grow gap-4">
              <div className="flex-grow">
                <Search />
              </div>
              <Notify />
            </div>
          </div>
          <span id="buffer" className="block min-h-20" aria-hidden />
          {children}
        </Providers>
      </body>
    </html>
  );
}
