"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import { services, formatRupiah } from "@/data/services";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 text-sm font-black mb-8 border border-red-100 shadow-sm"
        >
          <Sparkles size={16} className="text-red-600 animate-pulse" /> Akses Premium, Harga Minimum
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-red-950 leading-[1.1]">
          Patungan <span className="text-red-600">Aman</span> <br/>
          Tanpa Beban
        </h1>
        
        <p className="text-xl text-red-800 max-w-2xl mx-auto font-bold leading-relaxed mb-12">
          Nikmati layanan digital favorit Anda dengan cara patungan yang legal, instan, dan 100% transparan.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-black text-red-900 mt-10">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-red-50 shadow-sm"><ShieldCheck className="text-red-600 w-6 h-6" /> Garansi Aman</div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-red-50 shadow-sm"><Zap className="text-red-600 w-6 h-6" /> Akun Instan</div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 border-red-50 shadow-sm"><Users className="text-red-600 w-6 h-6" /> Matchmaking AI</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-red-50/30 py-24 border-t-2 border-red-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-red-950 mb-4 tracking-tight">Katalog Layanan</h2>
            <p className="text-red-800 font-bold text-lg">Pilih layanan favorit Anda dan dapatkan akun hari ini juga.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link 
                  href={`/checkout/${service.id}`}
                  className="group block bg-white rounded-[2rem] border-2 border-red-50 hover:border-red-300 p-8 text-center transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:bg-red-100 transition-colors" />
                  
                  <div className="h-24 flex items-center justify-center mb-6 w-full p-4">
                    <img 
                      src={service.logoUrl} 
                      alt={`Logo ${service.name}`} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="hidden font-black text-2xl text-red-950">{service.name}</span>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t-2 border-red-50 group-hover:border-red-100 transition-colors">
                    <p className="text-sm text-red-500 font-bold line-through mb-1">
                      {formatRupiah(service.originalPrice)}
                    </p>
                    <p className="text-3xl font-black text-red-600 mb-1">
                      {formatRupiah(service.sharedPrice)}
                    </p>
                    <p className="text-sm font-bold text-red-800">per bulan</p>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-red-600 font-black opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                    Patungan Sekarang <ArrowRight size={18} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/layanan" className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-red-600 text-red-600 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-[4px_4px_0_0_rgba(220,38,38,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
