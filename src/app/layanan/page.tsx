"use client";

import { services, formatRupiah } from "@/data/services";
import Link from "next/link";

export default function LayananPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-red-950 mb-4">Katalog Layanan</h1>
        <p className="text-red-800 font-bold max-w-2xl mx-auto">Semua layanan premium yang tersedia untuk patungan. Pilih sesuai kebutuhan Anda!</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link 
            key={service.id}
            href={`/checkout/${service.id}`}
            className="group bg-white rounded-3xl border-2 border-red-100 hover:border-red-600 p-8 flex flex-col items-center text-center transition-all hover:shadow-lg active:scale-95"
          >
            <div className="h-20 flex items-center justify-center mb-6 w-full">
              <img 
                src={service.logoUrl} 
                alt={`Logo ${service.name}`} 
                className="max-h-full max-w-full object-contain transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden font-black text-xl text-red-950">{service.name}</span>
            </div>
            
            <div className="mt-auto w-full">
              <p className="text-sm text-red-500 font-bold line-through mb-1">
                {formatRupiah(service.originalPrice)}
              </p>
              <p className="text-2xl font-black text-red-600">
                {formatRupiah(service.sharedPrice)}<span className="text-xs text-red-700">/bln</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
