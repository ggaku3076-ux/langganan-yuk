"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Users, ArrowRight, HelpCircle, HeartHandshake, CheckCircle2 } from "lucide-react";
import { services, formatRupiah } from "@/data/services";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-red-950 leading-[1.15]"
        >
          Patungan Layanan Premium <br/>
          <span className="text-red-600">
            Aman & Tanpa Beban
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl text-red-800 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
        >
          Nikmati layanan digital favorit Anda dengan cara patungan yang legal, instan, dan 100% transparan.
        </motion.p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-semibold text-red-900 mt-6">
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-red-100 shadow-sm"><ShieldCheck className="text-red-600 w-5 h-5" /> Garansi Aman</div>
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-red-100 shadow-sm"><Zap className="text-red-600 w-5 h-5" /> Akun Instan</div>
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-red-100 shadow-sm"><Users className="text-red-600 w-5 h-5" /> Matchmaking AI</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-red-50/20 py-20 border-t border-red-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-red-950 mb-3 tracking-tight">Katalog Layanan</h2>
            <p className="text-red-800 font-medium text-base">Pilih layanan favorit Anda dan dapatkan akses hari ini juga.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
              >
                <Link 
                  href={`/checkout/${service.id}`}
                  className="group block bg-white rounded-3xl border border-red-100 hover:border-red-300 p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="h-20 flex items-center justify-center mb-6 w-full p-2">
                    <img 
                      src={service.logoUrl} 
                      alt={`Logo ${service.name}`} 
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="hidden font-bold text-xl text-red-950">{service.name}</span>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-red-50">
                    <p className="text-xs text-red-400 font-semibold line-through mb-1">
                      {formatRupiah(service.originalPrice)}
                    </p>
                    <p className="text-2xl font-bold text-red-600 mb-0.5">
                      {formatRupiah(service.sharedPrice)}
                    </p>
                    <p className="text-xs font-semibold text-red-800">per bulan</p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Patungan Sekarang <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/layanan" className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[3px_3px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5">
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>

      {/* SEO & CONTENT SECTION */}
      <section className="py-20 bg-white border-t border-red-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-red-950 mb-4 tracking-tight">Solusi Patungan Langganan Premium Terbaik di Indonesia</h2>
            <p className="text-red-800 font-semibold text-sm max-w-2xl mx-auto leading-relaxed">
              Mulai hemat pengeluaran bulanan Anda untuk kebutuhan hiburan dan produktivitas dengan sistem patungan otomatis yang aman, murah, dan 100% bergaransi.
            </p>
          </div>

          <div className="space-y-12">
            {/* SEO Article 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex-shrink-0">
                <HelpCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-950 mb-3">Apa Itu Patungan Akun Premium di Langganan Yuk?</h3>
                <p className="text-red-900/80 font-medium text-sm leading-relaxed mb-3">
                  Banyak dari kita yang membutuhkan akun premium untuk hiburan keluarga seperti <strong>Netflix Premium</strong> atau alat bantu kecerdasan buatan (AI) seperti <strong>Claude Pro</strong> dan <strong>ChatGPT Plus (GPT-5)</strong>. Namun, biaya berlangganan bulanan mandiri seringkali dirasa terlalu mahal bagi pelajar, mahasiswa, dan pekerja lepas (*freelancer*).
                </p>
                <p className="text-red-900/80 font-medium text-sm leading-relaxed">
                  <strong>Langganan Yuk</strong> hadir sebagai platform SaaS perantara terpercaya. Kami memfasilitasi pembagian kuota grup secara otomatis (matchmaking) sehingga Anda bisa membagi biaya langganan secara adil. Anda hanya perlu membayar sepertiga atau seperempat dari harga asli untuk menikmati fasilitas premium yang sama!
                </p>
              </div>
            </div>

            {/* SEO Article 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-950 mb-3">Layanan Patungan Netflix Murah, Spotify, dan AI yang 100% Legal</h3>
                <p className="text-red-900/80 font-medium text-sm leading-relaxed mb-3">
                  Berbeda dengan penjual akun ilegal di media sosial yang sering terkena *on hold* atau penipuan, Langganan Yuk menggunakan **akun resmi** yang didaftarkan langsung ke provider resmi. Kami memiliki aturan ketat untuk melindungi privasi dan kenyamanan setiap anggota grup patungan.
                </p>
                <p className="text-red-900/80 font-medium text-sm leading-relaxed">
                  Setiap pengguna diberikan profil khusus dan dilarang keras mengubah password akun. Jika terjadi kendala akses, Customer Support kami yang responsif di WhatsApp siap membantu memulihkan akun atau mereset password dalam hitungan menit.
                </p>
              </div>
            </div>

            {/* SEO Article 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600 flex-shrink-0">
                <HeartHandshake size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-950 mb-3">Bagaimana Cara Memulai Patungan Akun Premium?</h3>
                <p className="text-red-900/80 font-medium text-sm leading-relaxed mb-4">
                  Kami merancang alur transaksi sesederhana mungkin tanpa memerlukan pendaftaran akun yang rumit. Ikuti 4 langkah mudah berikut:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 bg-red-50/50 p-4 rounded-xl border border-red-50">
                    <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 mb-1">1. Pilih Layanan Digital</h4>
                      <p className="text-xs text-red-800 font-medium leading-relaxed">Tentukan layanan premium yang Anda inginkan dari katalog kami.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-red-50/50 p-4 rounded-xl border border-red-50">
                    <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 mb-1">2. Pilih & Masuk Antrean</h4>
                      <p className="text-xs text-red-800 font-medium leading-relaxed">Pilih grup patungan aktif yang masih kosong dan isi data WhatsApp Anda.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-red-50/50 p-4 rounded-xl border border-red-50">
                    <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 mb-1">3. Scan QRIS & Bayar</h4>
                      <p className="text-xs text-red-800 font-medium leading-relaxed">Lakukan pembayaran instan menggunakan E-Wallet atau M-Banking favorit Anda.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-red-50/50 p-4 rounded-xl border border-red-50">
                    <CheckCircle2 size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-red-950 mb-1">4. Terima Akun via WA</h4>
                      <p className="text-xs text-red-800 font-medium leading-relaxed">Setelah kuota grup penuh, detail login akun akan langsung dikirim via WhatsApp.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-red-950 text-red-100 py-12 border-t border-red-900 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
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
        <div className="max-w-6xl mx-auto px-6 border-t border-red-900/60 mt-8 pt-6 text-center text-xs text-red-300 font-semibold">
          <p>© 2026 Langganan Yuk. All Rights Reserved. Seluruh hak cipta dilindungi undang-undang.</p>
        </div>
      </footer>
    </div>
  );
}
