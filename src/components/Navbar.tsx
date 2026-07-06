"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";

  const links = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/layanan" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className={`${isHome ? "absolute top-0 left-0" : "sticky top-4"} z-50 w-full px-4 md:px-6`}>
      <header 
        className={`max-w-5xl mx-auto rounded-2xl transition-all duration-300 ${
          isHome 
            ? "bg-transparent border-none shadow-none" 
            : "bg-white/95 backdrop-blur-md border border-red-100/50 shadow-[0_8px_30px_rgb(220,38,38,0.03)]"
        }`}
      >
        <div className="px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center cursor-pointer group"
            onClick={() => setIsMenuOpen(false)}
          >
            <img 
              src="/logo.png" 
              alt="Layanan Yuk Logo" 
              className="h-10 w-auto md:h-12 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform" 
            />
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-semibold text-sm transition-colors py-1 ${
                  isHome
                    ? pathname === link.path
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    : pathname === link.path 
                      ? "text-red-600 border-b-2 border-red-600" 
                      : "text-red-950/70 hover:text-red-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button (Back to the Right Side) */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                isHome
                  ? "border border-white bg-transparent text-white hover:bg-white hover:text-[#E21F1F]"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <Send size={12} /> Hubungi CS
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-1.5 rounded-lg transition-colors focus:outline-none ${
              isHome
                ? "text-white bg-red-800/40 hover:bg-red-800/60"
                : "text-red-600 bg-red-50 hover:bg-red-100"
            }`}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu (GPU-Accelerated) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`md:hidden border-t ${
                isHome ? "border-red-500 bg-[#E21F1F]/95" : "border-red-50 bg-white"
              } rounded-b-2xl`}
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {links.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-bold text-sm py-2 transition-colors ${
                      isHome
                        ? pathname === link.path
                          ? "text-white pl-2 border-l-2 border-white"
                          : "text-white/80 hover:text-white"
                        : pathname === link.path 
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
                  className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-bold rounded-xl transition-colors shadow-sm mt-2 ${
                    isHome
                      ? "bg-white text-[#E21F1F] hover:bg-red-50"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
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
