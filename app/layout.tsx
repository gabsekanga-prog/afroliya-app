import { Baloo_2, Geist, Geist_Mono } from "next/font/google";

import { ScrollToTopButton } from "@/app/components/scroll-to-top-button";
import { rootLayoutMetadata } from "@/lib/site-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

export const metadata = rootLayoutMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
