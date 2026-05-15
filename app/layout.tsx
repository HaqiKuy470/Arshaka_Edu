import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Arshaka Edu | Platform Simulasi Interaktif Edukatif",
  description: "Platform simulasi pembelajaran interaktif berbasis web, gratis, dan dapat diakses oleh semua kalangan. Jelajahi Fisika, Kimia, Matematika, Biologi, dan lainnya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} min-h-screen flex flex-col font-sans antialiased text-white bg-zinc-950 selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
