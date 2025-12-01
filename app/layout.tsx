import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import BackgroundAnimation from "@/components/BackgroundAnimation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "AI Interstellar Explorer",
  description: "Explore the cosmos with AI-powered tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} antialiased text-white overflow-x-hidden`}>
        <BackgroundAnimation />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
