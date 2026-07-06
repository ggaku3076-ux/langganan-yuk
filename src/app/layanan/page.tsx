"use client";

import { services, formatRupiah } from "@/data/services";
import Link from "next/link";

export default function LayananPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-red-950 mb-3 tracking-tight">Katalog Layanan</h1>
        <p className="text-red-800 font-medium text-sm sm:text-base max-w-2xl mx-auto">Semua layanan premium yang tersedia untuk patungan. Pilih sesuai kebutuhan Anda!</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="h-full"
          >
            <Link 
              href={`/checkout/${service.id}`}
              className="group flex flex-col justify-between bg-white rounded-2xl md:rounded-3xl border border-red-100 p-4 sm:p-6 md:p-8 text-center transition-all duration-300 md:hover:border-red-600 md:hover:shadow-xl md:hover:-translate-y-1 relative overflow-hidden h-full"
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
