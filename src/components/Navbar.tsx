"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Safely handle trailing slashes
  const cleanPath = pathname ? pathname.replace(/\/$/, "") : "";
  const isHome = cleanPath === "" || cleanPath === "/";
  
  // All pages (Home, Layanan, FAQ, Contact, Checkout) use white text / logo on red or transparent backgrounds
  const isRedNavbar = true; 

  const links = [
    { name: "Home", path: "/" },
    { name: "Layanan", path: "/layanan" },
    { name: "Lacak Pembelian", path: "/lacak" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className={`${isHome ? "absolute top-0 left-0" : "sticky top-4"} z-50 w-full px-4 md:px-6`}>
      <header 
        className={`max-w-5xl mx-auto rounded-2xl transition-all duration-200 ${
          isHome 
            ? "bg-transparent border-none shadow-none" 
            : "bg-[#E21F1F] border border-red-700/30 shadow-[0_8px_30px_rgba(226,31,31,0.08)]"
        }`}
      >
        <div className="px-6 h-14 md:h-16 flex items-center justify-between">
          
          {/* Logo + Brand Name */}
          <Link 
            href="/" 
            className="flex items-center gap-2 md:gap-2.5 cursor-pointer group"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image 
              src="/logo-emblem.webp" 
              alt="Layanan Yuk Emblem" 
              width={40}
              height={40}
              className="h-8 w-auto md:h-10 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="font-extrabold text-base md:text-lg tracking-tight transition-colors text-white group-hover:text-white/90">
              LanggananYuk
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-semibold text-sm transition-colors py-1 ${
                  cleanPath === link.path.replace(/\/$/, "")
                    ? "text-white border-b-2 border-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://wa.me/6285286502731"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-sm border border-white bg-transparent text-white hover:bg-white hover:text-[#E21F1F]"
            >
              <Send size={12} /> Hubungi CS
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-lg transition-colors focus:outline-none text-white bg-red-800/40 hover:bg-red-800/60"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

        {/* Mobile Dropdown Menu (Fast rendering, solid red background to eliminate mobile GPU lag) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="md:hidden border-t border-red-500 bg-[#E21F1F] rounded-b-2xl"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {links.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-bold text-sm py-2 transition-colors ${
                      cleanPath === link.path.replace(/\/$/, "")
                        ? "text-white pl-2 border-l-2 border-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <a 
                  href="https://wa.me/6285286502731"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold rounded-xl transition-colors shadow-sm mt-2 bg-white text-[#E21F1F] hover:bg-red-50"
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
