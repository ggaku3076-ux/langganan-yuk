"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Users } from "lucide-react";
import { services, formatRupiah } from "@/data/services";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border-2 border-red-200 text-red-600 text-sm font-bold mb-6">
          <Sparkles size={16} /> Premium Access, Fraction of the Cost
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-red-950 leading-tight">
          Nikmati Layanan Premium <br/>
          <span className="text-red-600">
            Tanpa Bikin Kering
          </span>
        </h1>
        <p className="text-lg md:text-xl text-red-800 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          Patungan akun langganan secara instan, aman, dan bergaransi. Tunggu kuota penuh, akun langsung dikirim via WhatsApp.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-red-900">
          <div className="flex items-center gap-2"><ShieldCheck className="text-red-600 w-5 h-5" /> Aman & Legal</div>
          <div className="flex items-center gap-2"><Zap className="text-red-600 w-5 h-5" /> Proses Instan</div>
          <div className="flex items-center gap-2"><Users className="text-red-600 w-5 h-5" /> Matchmaking Otomatis</div>
        </div>
      </section>

      {/* Services Section (Logos Only) */}
      <section className="bg-red-50/50 py-16 border-t-2 border-red-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-red-950 mb-4">Pilih Layanan</h2>
            <p className="text-red-800 font-bold">Pilih layanan favorit Anda dan mulai patungan sekarang!</p>
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
                      // Fallback if image fails to load
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
          
          <div className="text-center mt-12">
            <Link href="/layanan" className="inline-block px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors">
              Lihat Semua Layanan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
