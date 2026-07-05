"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/layanan" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="sticky top-4 z-50 w-full px-4 md:px-6">
      <header className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md border border-red-100/50 rounded-2xl shadow-[0_8px_30px_rgb(220,38,38,0.03)] transition-all">
        <div className="px-6 h-14 md:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105">
              L
            </div>
            <span className="font-bold text-base md:text-lg text-red-600 tracking-tight">
              Langganan Yuk
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
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

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              <Send size={12} /> CS Online
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-red-600 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu (GPU-Accelerated for 100% Lag-free Performance) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="md:hidden border-t border-red-50"
            >
              <div className="px-6 py-4 flex flex-col gap-3 bg-white rounded-b-2xl">
                {links.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-bold text-sm py-2 transition-colors ${
                      pathname === link.path 
                        ? "text-red-600 pl-2 border-l-2 border-red-600" 
                        : "text-red-950/70 hover:text-red-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <a 
                  href="https://wa.me/628123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm mt-2"
                >
                  <Send size={14} /> Hubungi CS Online
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </div>
  );
}
