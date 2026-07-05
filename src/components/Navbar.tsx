"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/layanan" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-red-50 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-2.5">
        {/* Centered Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
            L
          </div>
          <span className="font-bold text-lg text-red-600 tracking-tight">
            Langganan Yuk
          </span>
        </Link>
        
        {/* Centered Navigation Links */}
        <nav className="flex gap-6 justify-center">
          {links.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`font-semibold text-xs transition-colors ${
                pathname === link.path 
                  ? "text-red-600" 
                  : "text-red-900/70 hover:text-red-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
