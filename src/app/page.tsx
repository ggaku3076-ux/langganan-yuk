"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Users, ArrowRight, HelpCircle, CheckCircle2, Info } from "lucide-react";
import { services, formatRupiah } from "@/data/services";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1: HERO SECTION */}
      <section className="bg-red-600 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.2] md:leading-[1.15]"
          >
            Patungan Layanan Premium <br/>
            <span className="underline decoration-white decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8">
              Aman & Tanpa Beban
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-red-100 max-w-2xl mx-auto font-semibold leading-relaxed mb-8 md:mb-12"
          >
            Nikmati akses akun premium favorit Anda secara legal dengan sistem patungan otomatis. Hemat pengeluaran bulanan Anda hingga 80%.
          </motion.p>

          {/* Centered Features inside Hero */}
          <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-bold text-red-600 mt-4 sm:mt-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl shadow-md border border-white cursor-default"><ShieldCheck className="text-red-600 w-4.5 h-4.5" /> Garansi Aman</motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl shadow-md border border-white cursor-default"><Zap className="text-red-600 w-4.5 h-4.5" /> Akun Instan</motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl shadow-md border border-white cursor-default"><Users className="text-red-600 w-4.5 h-4.5" /> Matchmaking AI</motion.div>
          </div>
        </div>
        
        {/* Asymmetrical design accent */}
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-red-700 rounded-tl-full opacity-50 pointer-events-none" />
      </section>

      {/* SECTION 2: CATALOG SECTION (Framer-Motion Hover/Tap Physics) */}
      <section className="bg-white py-16 md:py-24 border-t border-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-950 mb-2 tracking-tight">Katalog Layanan Digital</h2>
            <p className="text-red-800 font-semibold text-sm sm:text-base">Pilih produk premium yang ingin Anda patungi hari ini.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="h-full"
              >
                <Link 
                  href={`/checkout/${service.id}`}
                  className="group flex flex-col justify-between h-full bg-white rounded-2xl md:rounded-3xl border border-red-100 hover:border-red-600 p-4 sm:p-6 md:p-8 text-center transition-shadow duration-200 hover:shadow-xl"
                >
                  <div className="h-16 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 w-full p-1 sm:p-2">
                    <img 
                      src={service.logoUrl} 
                      alt={`Logo ${service.name}`} 
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="hidden font-bold text-base sm:text-xl text-red-950">{service.name}</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-red-50">
                    <p className="text-[10px] sm:text-xs text-red-400 font-semibold line-through mb-0.5 sm:mb-1">
                      {formatRupiah(service.originalPrice)}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-red-600 mb-0.5">
                      {formatRupiah(service.sharedPrice)}
                    </p>
                    <p className="text-[10px] sm:text-xs font-semibold text-red-800">per bulan</p>
                  </div>

                  <div className="mt-3 hidden sm:flex items-center justify-center gap-1 text-xs text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Patungan <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link href="/layanan" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-red-600 text-red-600 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5">
                Lihat Semua Layanan
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="bg-red-950 text-white py-16 md:py-20 border-t border-red-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">4 Langkah Praktis Patungan</h2>
            <p className="text-red-200 font-semibold text-xs sm:text-sm max-w-lg mx-auto">Sistem matchmaking otomatis kami akan mencarikan teman patungan untuk Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: 1, title: "Pilih Layanan", desc: "Pilih salah satu akun premium (Netflix, Spotify, AI) di katalog." },
              { num: 2, title: "Pilih Grup & Bayar", desc: "Pilih slot grup aktif yang kosong dan isi nomor WhatsApp Anda." },
              { num: 3, title: "Matchmaking", desc: "Bayar menggunakan QRIS, lalu sistem akan menunggu kuota grup penuh." },
              { num: 4, title: "Kirim Akun via WA", desc: "Begitu kuota penuh, email & password dikirim otomatis lewat WhatsApp." }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-red-900/40 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-red-800 flex md:flex-col items-center md:text-center gap-4 md:gap-0"
              >
                <div className="w-8 h-8 rounded-full bg-white text-red-950 font-bold text-sm flex items-center justify-center flex-shrink-0 md:mb-4">{step.num}</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 md:mb-2 text-left md:text-center">{step.title}</h4>
                  <p className="text-xs text-red-200 font-medium leading-relaxed text-left md:text-center">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SEO ARTICLES */}
      <section className="py-16 md:py-24 bg-red-50/30 border-t border-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-950 mb-3 tracking-tight">Solusi Berlangganan Hemat Terpercaya</h2>
            <p className="text-red-800 font-semibold text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">Kenapa ratusan pengguna beralih menggunakan platform patungan otomatis di Langganan Yuk?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {[
              { icon: <HelpCircle size={20} />, title: "Apa Keuntungan Patungan?", desc: "Layanan seperti Netflix Premium atau alat kecerdasan buatan seperti Claude Pro dan ChatGPT Plus memakan biaya berlangganan mandiri yang tinggi. Melalui sistem patungan, Anda mendapatkan akses legal dengan harga hemat hingga 80%." },
              { icon: <ShieldCheck size={20} />, title: "Keamanan & Legalitas Terjamin", desc: "Kami hanya menyediakan akun resmi yang didaftarkan langsung ke provider resmi. Kami memberlakukan aturan keras untuk membatasi akses profil dan mencegah penggantian password demi kenyamanan bersama." },
              { icon: <Info size={20} />, title: "Bantuan 24 Jam via WhatsApp", desc: "Lupa password atau profil Anda tidak bisa diakses? Hubungi tim support customer service kami di WhatsApp. Kami akan memulihkan dan mereset kredensial akun dalam waktu singkat." },
              { icon: <CheckCircle2 size={20} />, title: "100% Refund Otomatis", desc: "Jika kuota grup yang Anda pilih tidak kunjung terisi penuh dalam waktu 24 jam setelah pembayaran, sistem kami akan langsung melakukan pengembalian dana (refund) otomatis 100% tanpa potongan." }
            ].map((article, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -3 }}
                className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-red-100 shadow-sm flex gap-4"
              >
                <div className="p-2.5 bg-red-50 rounded-xl text-red-600 flex-shrink-0 h-10 w-10 flex items-center justify-center border border-red-100">
                  {article.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-red-950 mb-2">{article.title}</h3>
                  <p className="text-red-900/80 font-medium text-xs leading-relaxed">{article.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-red-950 text-red-100 py-12 border-t border-red-900 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Langganan Yuk</h4>
            <p className="text-xs text-red-200/80 font-semibold leading-relaxed">
              Platform patungan premium nomor satu di Indonesia. Menyediakan akses Netflix, Spotify, Claude, dan ChatGPT Premium dengan harga hemat bulanan.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Navigasi Halaman</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/layanan" className="hover:text-white transition-colors">Katalog Layanan</Link>
              <Link href="/faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Layanan Populer</h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold bg-red-900/50 px-2 py-1 rounded-md text-red-200">Patungan Netflix Premium</span>
              <span className="text-[10px] font-bold bg-red-900/50 px-2 py-1 rounded-md text-red-200">Spotify Family Murah</span>
              <span className="text-[10px] font-bold bg-red-900/50 px-2 py-1 rounded-md text-red-200">Akun Claude Pro</span>
              <span className="text-[10px] font-bold bg-red-900/50 px-2 py-1 rounded-md text-red-200">Patungan ChatGPT Plus</span>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 border-t border-red-900/60 mt-8 pt-6 text-center text-xs text-red-300 font-semibold">
          <p>© 2026 Langganan Yuk. All Rights Reserved. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>
    </div>
  );
}
