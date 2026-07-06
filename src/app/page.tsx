"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Users, ArrowRight, HelpCircle, CheckCircle2, Info } from "lucide-react";
import { services, formatRupiah } from "@/data/services";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1: HERO SECTION (Mobile Optimized Spacing & hardware accelerated fade) */}
      <section className="w-full bg-[#E21F1F] bg-[url('/hero-bg.png')] bg-[length:auto_55%] md:bg-contain bg-no-repeat bg-right-bottom md:bg-right min-h-[480px] md:min-h-[580px] flex items-center relative py-12 pt-28 pb-60 md:pt-36 md:pb-12">
        {/* Dark overlay for better readability on small screens */}
        <div className="absolute inset-0 bg-[#E21F1F]/10 md:bg-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-2xl text-left flex flex-col items-start transition-opacity duration-500 ease-out">
            
            {/* Paragraph above heading */}
            <p className="text-white text-xs sm:text-sm md:text-base font-semibold leading-relaxed mb-4 max-w-xl">
              Nikmati akses akun premium favorit Anda secara legal dengan sistem patungan otomatis. Hemat pengeluaran bulanan Anda hingga 80%
            </p>

            {/* Heading in uppercase, large bold text */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05] mb-6 font-sans">
              Patungan <br/>
              Premium Aman <br/>
              Tanpa Beban
            </h1>
            
            {/* REGISTER NOW Button */}
            <div>
              <Link 
                href="/layanan" 
                className="inline-block px-8 py-4 bg-white text-[#E21F1F] font-bold text-xs sm:text-sm tracking-wider rounded-none uppercase hover:bg-red-50 transition-colors shadow-lg active:scale-95 transition-transform"
              >
                Register Now
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: CATALOG SECTION (White Background, Red-Bordered Cards with CSS transitions) */}
      <section className="bg-white py-16 md:py-24 border-t border-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-950 mb-2 tracking-tight">Katalog Layanan Digital</h2>
            <p className="text-red-800 font-semibold text-sm sm:text-base">Pilih produk premium yang ingin Anda patungi hari ini.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="h-full"
              >
                <Link 
                  href={`/checkout/${service.id}`}
                  className="group flex flex-col justify-between h-full bg-white rounded-2xl md:rounded-3xl border border-red-100 hover:border-red-600 p-4 sm:p-6 md:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-98"
                >
                  <div>
                    <div className="h-14 sm:h-16 flex items-center justify-center mb-2 w-full p-1">
                      <img 
                        src={service.logoUrl} 
                        alt={`Logo ${service.name}`} 
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    
                    <h3 className="font-extrabold text-sm sm:text-base text-red-950 mb-3 tracking-tight group-hover:text-red-600 transition-colors">
                      {service.name}
                    </h3>
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
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:mt-12">
            <div className="inline-block">
              <Link href="/layanan" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-red-600 text-red-600 text-sm font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5">
                Lihat Semua Layanan
              </Link>
            </div>
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
              <div 
                key={idx}
                className="bg-red-900/40 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-red-800 flex items-start md:items-center md:text-center gap-4 md:gap-0 hover:bg-red-900/60 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-white text-red-950 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-0 md:mb-4">{step.num}</div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 md:mb-2 text-left md:text-center">{step.title}</h4>
                  <p className="text-xs text-red-200 font-medium leading-relaxed text-left md:text-center">{step.desc}</p>
                </div>
              </div>
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
              <div 
                key={idx}
                className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-red-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-2.5 bg-red-50 rounded-xl text-red-600 flex-shrink-0 h-10 w-10 flex items-center justify-center border border-red-100 mt-0.5">
                  {article.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-red-950 mb-2">{article.title}</h3>
                  <p className="text-red-900/80 font-medium text-xs leading-relaxed">{article.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
