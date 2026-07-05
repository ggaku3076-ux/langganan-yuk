"use client";

import { services, formatRupiah } from "@/data/services";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LayananPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-red-950 mb-3 tracking-tight">Katalog Layanan</h1>
        <p className="text-red-850 font-medium text-base max-w-2xl mx-auto">Semua layanan premium yang tersedia untuk patungan. Pilih sesuai kebutuhan Anda!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
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
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
