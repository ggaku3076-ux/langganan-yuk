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
    <header className="sticky top-0 z-50 bg-white border-b-2 border-red-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">
            L
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-red-600">
            Langganan Yuk
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-8">
          {links.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`font-bold transition-colors ${
                pathname === link.path 
                  ? "text-red-600" 
                  : "text-red-800 hover:text-red-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu could be added here later */}
        <div className="md:hidden text-red-600 font-bold">
          Menu
        </div>
      </div>
    </header>
  );
}
