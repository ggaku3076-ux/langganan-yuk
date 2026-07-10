"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-red-950 text-red-100 border-t border-red-900/60 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Logo & Deskripsi */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/logo-emblem.webp" 
                alt="LanggananYuk Emblem" 
                width={32}
                height={32}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-extrabold text-lg text-white tracking-tight">
                LanggananYuk
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-red-200/80 font-medium leading-relaxed max-w-sm">
              Platform patungan akun premium nomor satu di Indonesia. Dapatkan akses Netflix, Spotify, Claude, dan ChatGPT Premium legal dengan harga hemat s.d. 80%.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <a 
                href="https://wa.me/6285286502731" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-xs font-semibold text-red-200 hover:text-white transition-colors"
              >
                <Phone size={14} className="text-red-400" />
                <span>0852-8650-2731 (WhatsApp Support)</span>
              </a>
              <a 
                href="mailto:rehanalay9@gmail.com" 
                className="flex items-center gap-2 text-xs font-semibold text-red-200 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-red-400" />
                <span>rehanalay9@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Navigasi Halaman */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase border-b border-red-900 pb-2">Navigasi</h4>
            <div className="flex flex-col gap-2 text-xs sm:text-sm font-semibold">
              <Link href="/" className="hover:text-white text-red-200/90 transition-colors flex items-center gap-1 group">
                Home <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/layanan" className="hover:text-white text-red-200/90 transition-colors flex items-center gap-1 group">
                Katalog Layanan <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/faq" className="hover:text-white text-red-200/90 transition-colors flex items-center gap-1 group">
                Tanya Jawab (FAQ) <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="/contact" className="hover:text-white text-red-200/90 transition-colors flex items-center gap-1 group">
                Hubungi Kami <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Layanan Populer & Jaminan */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="font-bold text-white text-sm tracking-wide uppercase border-b border-red-900 pb-2">Layanan Populer</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[10px] sm:text-xs font-bold bg-red-900/40 px-2.5 py-1 rounded-lg text-red-200 border border-red-900/30">Netflix Premium</span>
              <span className="text-[10px] sm:text-xs font-bold bg-red-900/40 px-2.5 py-1 rounded-lg text-red-200 border border-red-900/30">Spotify Family</span>
              <span className="text-[10px] sm:text-xs font-bold bg-red-900/40 px-2.5 py-1 rounded-lg text-red-200 border border-red-900/30">Claude Pro</span>
              <span className="text-[10px] sm:text-xs font-bold bg-red-900/40 px-2.5 py-1 rounded-lg text-red-200 border border-red-900/30">ChatGPT Plus</span>
            </div>

            <div className="bg-red-900/20 border border-red-900/40 rounded-xl p-3.5 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] sm:text-xs font-bold text-white mb-0.5">Garansi Aman & Legal</p>
                <p className="text-[10px] sm:text-xs text-red-200/70 font-semibold leading-relaxed">
                  Semua transaksi diproses aman dan akun bergaransi penuh sepanjang masa langganan aktif.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Hak Cipta */}
        <div className="border-t border-red-900/50 mt-10 pt-6 text-center text-[10px] sm:text-xs text-red-300/80 font-semibold leading-relaxed">
          <p>© 2026 LanggananYuk. All Rights Reserved. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  );
}
