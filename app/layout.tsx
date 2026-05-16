import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Arshaka Edu | Laboratorium Simulasi Interaktif Masa Depan",
  description: "Platform simulasi pembelajaran interaktif berbasis web yang mendefinisikan ulang cara kita belajar sains dan teknologi melalui visualisasi mendalam.",
  keywords: ["edukasi", "simulasi", "sains", "fisika", "kimia", "interaktif", "belajar gratis"],
  authors: [{ name: "Arshaka Team" }],
  openGraph: {
    title: "Arshaka Edu | Belajar Tanpa Batas",
    description: "Eksplorasi dunia sains melalui simulasi interaktif gratis.",
    type: "website",
    locale: "id_ID",
    url: "https://arshakaedu.com",
    siteName: "Arshaka Edu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arshaka Edu",
    description: "Laboratorium Simulasi Interaktif Masa Depan",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} min-h-screen flex flex-col font-sans antialiased text-zinc-300 bg-[#050505] selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
