import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HomeProvider } from "@contexts/home.context";
import HomeLayout from "@layouts/home.layout";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description:
    "Professional investment portfolio tracking with live market data and fundamental analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full antialiased" suppressHydrationWarning>
        <HomeProvider>
          <HomeLayout>{children}</HomeLayout>
        </HomeProvider>
      </body>
    </html>
  );
}
