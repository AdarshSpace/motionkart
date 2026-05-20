import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/ui/SplashScreen";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TalentLMS Learning Dashboard",
  description: "A professional, clean course management dashboard inspired by TalentLMS design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SplashScreen />
        
        <>{children}</>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
