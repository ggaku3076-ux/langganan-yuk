"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/layanan" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="sticky top-4 z-50 w-full px-4 md:px-6">
      <header className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-red-100/50 rounded-2xl shadow-[0_8px_30px_rgb(220,38,38,0.03)] transition-all">
        <div className="px-6 h-14 md:h-16 flex items-center justify-between">
          
          {/* Logo (Kiri) */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              L
            </div>
            <span className="font-bold text-base md:text-lg text-red-600 tracking-tight">
              Langganan Yuk
            </span>
          </Link>
          
          {/* Navigation Links (Tengah) */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-semibold text-xs transition-colors py-1 ${
                  pathname === link.path 
                    ? "text-red-600 border-b border-red-600" 
                    : "text-red-950/70 hover:text-red-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button (Kanan) */}
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              <Send size={12} /> CS Online
            </a>
            
            {/* Mobile Menu Trigger */}
            <div className="md:hidden text-red-600 font-bold text-xs cursor-pointer py-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
              Menu
            </div>
          </div>

        </div>
      </header>
    </div>
  );
}
