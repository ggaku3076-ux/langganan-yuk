"use client";

import Link from "next/link";
import { ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import { services, formatRupiah } from "@/data/services";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full">
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
    </div>
  );
}
