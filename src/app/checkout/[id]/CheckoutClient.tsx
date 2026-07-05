"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, QrCode, ArrowLeft } from "lucide-react";
import { formatRupiah } from "@/data/services";
import Link from "next/link";

export default function CheckoutClient({ service }: { service: any }) {
  const [appState, setAppState] = useState("checkout"); // checkout, payment, waiting
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    let timer: any;
    if (appState === "payment" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [appState, timeLeft]);

  return (
    <div className="flex-1 py-12 px-6">
      <AnimatePresence mode="wait">
        
        {/* CHECKOUT STATE */}
        {appState === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-xl mx-auto"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-red-600 font-bold mb-6 hover:underline">
              <ArrowLeft size={16} /> Kembali
            </Link>
            
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border-2 border-red-100 shadow-xl">
              <div className="flex items-center gap-5 mb-8 pb-8 border-b-2 border-red-50">
                <div className="h-16 w-24 flex items-center justify-center p-2 border-2 border-red-50 rounded-xl">
                   <img 
                    src={service.logoUrl} 
                    alt={service.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-red-950 tracking-tight">{service.name}</h2>
                  <p className="text-red-600 font-bold text-xl mt-1">{formatRupiah(service.sharedPrice)} <span className="text-sm text-red-700">/bulan</span></p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-red-900 mb-2">
                    Nama Panggilan
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Budi"
                    className="w-full px-5 py-4 bg-white border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-600 transition-colors text-red-950 placeholder-red-300 font-bold"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-red-900 mb-2">
                    Nomor WhatsApp
                  </label>
                  <input 
                    type="tel" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-5 py-4 bg-white border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-600 transition-colors text-red-950 placeholder-red-300 font-bold"
                  />
                  <p className="text-sm text-red-700 mt-2 flex items-center gap-1.5 font-bold">
                    <AlertCircle size={14} className="text-red-600" /> Detail akun akan dikirim ke nomor ini.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl mt-4">
                  <div className="relative flex items-start pt-1">
                    <input 
                      type="checkbox" 
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer w-5 h-5 appearance-none rounded-md border-2 border-red-300 checked:bg-red-600 checked:border-red-600 cursor-pointer transition-colors"
                    />
                    <CheckCircle2 size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none mt-[2px]" />
                  </div>
                  <label htmlFor="terms" className="text-sm text-red-900 leading-relaxed cursor-pointer font-bold">
                    Saya setuju dengan S&K. <strong className="text-red-600">Dilarang keras mengganti password atau memakai profil orang lain.</strong>
                  </label>
                </div>

                <button 
                  disabled={!name || !whatsapp || !agreed}
                  onClick={() => {
                    setTimeLeft(15 * 60);
                    setAppState("payment");
                  }}
                  className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-100 disabled:text-red-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg transition-colors active:scale-95 mt-8 flex justify-center items-center gap-2"
                >
                  <QrCode size={20} /> Lanjut Pembayaran
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PAYMENT STATE (QRIS) */}
        {appState === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white p-10 rounded-[2rem] border-2 border-red-100 shadow-xl text-center">
              <h2 className="text-2xl font-black mb-2 text-red-950">Scan QRIS</h2>
              <p className="text-red-700 text-sm mb-8 font-bold">Gunakan M-Banking atau E-Wallet pilihan Anda.</p>
              
              <div className="bg-white p-4 rounded-3xl inline-block mb-8 border-2 border-red-100">
                <div className="w-48 h-48 border-4 border-red-50 rounded-2xl flex items-center justify-center bg-white">
                  <QrCode size={160} className="text-red-950" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="mb-8 p-4 rounded-2xl border-2 border-red-50 bg-white">
                <p className="text-sm text-red-700 font-bold mb-1">Total Pembayaran</p>
                <p className="text-4xl font-black text-red-600">{formatRupiah(service.sharedPrice)}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm font-black text-red-600 bg-red-50 py-3 px-6 rounded-full mb-8 w-max mx-auto">
                <AlertCircle size={16} />
                Selesaikan dalam {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>

              <button 
                onClick={() => setAppState("waiting")}
                className="w-full py-4 text-sm font-black border-2 border-red-100 text-red-950 hover:bg-red-50 rounded-2xl transition-colors active:scale-95"
              >
                [Mockup] Anggap Pembayaran Berhasil
              </button>
            </div>
          </motion.div>
        )}

        {/* WAITING ROOM STATE */}
        {appState === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-red-100 shadow-xl text-center">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-3xl font-black mb-3 text-red-950">Pembayaran Berhasil!</h2>
              <p className="text-red-800 text-lg mb-10 font-bold leading-relaxed">
                Anda resmi masuk antrean <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{service.name}</span>
              </p>

              <div className="bg-white p-8 rounded-3xl text-left border-2 border-red-100 mb-8">
                <div className="flex justify-between text-sm mb-4">
                  <span className="font-black text-red-900">Progres Grup</span>
                  <span className="text-red-600 font-black text-lg">{service.filledSlots + 1} / {service.totalSlots}</span>
                </div>
                
                <div className="w-full bg-red-100 rounded-full h-4 overflow-hidden mb-6">
                  <motion.div 
                    initial={{ width: `${(service.filledSlots / service.totalSlots) * 100}%` }}
                    animate={{ width: `${((service.filledSlots + 1) / service.totalSlots) * 100}%` }}
                    transition={{ delay: 0.5, duration: 2, ease: "circOut" }}
                    className="h-full bg-red-600 rounded-full"
                  />
                </div>
                
                <div className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 animate-pulse"></div>
                  <p className="text-sm text-red-900 leading-relaxed font-bold">
                    Menunggu <strong className="text-red-600">{service.totalSlots - (service.filledSlots + 1)} orang lagi</strong>. Detail dikirim ke <span className="text-red-600">{whatsapp}</span>.
                  </p>
                </div>
              </div>

              <Link 
                href="/"
                className="block w-full py-4 px-6 bg-red-950 text-white hover:bg-red-900 rounded-2xl font-black text-lg transition-colors active:scale-95 text-center"
              >
                Selesai & Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
