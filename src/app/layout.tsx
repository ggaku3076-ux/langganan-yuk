import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCircle } from "lucide-react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Langganan Yuk - Patungan Akun Premium",
  description: "Platform SaaS untuk patungan layanan berlangganan premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-red-950 selection:bg-red-600 selection:text-white flex flex-col min-h-screen`}>
        <Navbar />
        
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        {/* Floating Action Button - WhatsApp */}
        <a 
          href="https://wa.me/628123456789" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group border-2 border-red-200"
          aria-label="Hubungi Customer Service via WhatsApp"
        >
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </a>
      </body>
    </html>
  );
}
