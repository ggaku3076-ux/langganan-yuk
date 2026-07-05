"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, QrCode, ArrowLeft, Loader2 } from "lucide-react";
import { formatRupiah } from "@/data/services";
import Link from "next/link";

export default function CheckoutClient({ service }: { service: any }) {
  const [appState, setAppState] = useState("checkout"); // checkout, payment, waiting
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (appState === "payment" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [appState, timeLeft]);

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTimeLeft(15 * 60);
      setAppState("payment");
    }, 800);
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAppState("waiting");
    }, 1500);
  };

  return (
    <div className="flex-1 py-12 px-6 bg-red-50/20">
      <AnimatePresence mode="wait">
        
        {/* CHECKOUT STATE */}
        {appState === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-red-700 font-black mb-8 hover:text-red-600 transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
            </Link>
            
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-red-100 shadow-2xl shadow-red-900/5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 pb-10 border-b-2 border-red-50">
                <div className="h-24 w-32 flex items-center justify-center p-4 bg-white border-2 border-red-100 rounded-3xl shadow-sm">
                   <img 
                    src={service.logoUrl} 
                    alt={service.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-red-950 tracking-tight mb-2">{service.name}</h2>
                  <div className="flex items-center gap-3">
                    <p className="text-red-600 font-black text-2xl">{formatRupiah(service.sharedPrice)}</p>
                    <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-full">Per Bulan</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black text-red-950 mb-3">
                    Nama Panggilan
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Budi Santoso"
                    className="w-full px-6 py-4 bg-red-50/50 border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-bold text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-red-950 mb-3">
                    Nomor WhatsApp Aktif
                  </label>
                  <input 
                    type="tel" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-6 py-4 bg-red-50/50 border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-bold text-lg"
                  />
                  <p className="text-sm text-red-700 mt-3 flex items-center gap-2 font-bold bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={16} className="text-red-600 flex-shrink-0" /> Akun premium akan dikirim ke nomor ini via WA.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white border-2 border-red-100 rounded-2xl mt-4 cursor-pointer hover:border-red-300 transition-colors" onClick={() => setAgreed(!agreed)}>
                  <div className="relative flex items-start pt-1">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-red-600 border-red-600' : 'border-red-300 bg-white'}`}>
                      <CheckCircle2 size={16} className={`text-white transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                    </div>
                  </div>
                  <div className="text-sm text-red-900 leading-relaxed font-bold">
                    Saya menyetujui Syarat & Ketentuan. <strong className="text-red-600 block mt-1">Dilarang mengubah profil atau password orang lain di dalam akun.</strong>
                  </div>
                </div>

                <button 
                  disabled={!name || !whatsapp || !agreed || isLoading}
                  onClick={handleCheckout}
                  className="relative w-full py-5 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-100 disabled:text-red-300 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xl transition-all active:scale-[0.98] mt-8 flex justify-center items-center gap-3 overflow-hidden group shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] disabled:shadow-none"
                >
                  {isLoading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <QrCode size={24} className="group-hover:scale-110 transition-transform" /> Bayar Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PAYMENT STATE (QRIS) */}
        {appState === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-red-100 shadow-2xl shadow-red-900/5 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
              
              <h2 className="text-3xl font-black mb-3 text-red-950">Selesaikan Pembayaran</h2>
              <p className="text-red-700 text-base mb-10 font-bold">Buka M-Banking atau E-Wallet Anda lalu scan kode QR di bawah ini.</p>
              
              <div className="bg-white p-6 rounded-[2rem] inline-block mb-10 border-2 border-red-100 shadow-lg shadow-red-100">
                <div className="w-56 h-56 border-4 border-red-50 rounded-2xl flex items-center justify-center bg-white">
                  {isLoading ? (
                    <Loader2 size={48} className="text-red-300 animate-spin" />
                  ) : (
                    <QrCode size={200} className="text-red-950" strokeWidth={1.2} />
                  )}
                </div>
              </div>
              
              <div className="mb-10">
                <p className="text-sm text-red-700 font-bold mb-2 uppercase tracking-widest">Total Tagihan</p>
                <p className="text-5xl font-black text-red-600">{formatRupiah(service.sharedPrice)}</p>
              </div>

              <div className="flex items-center justify-center gap-3 text-sm font-black text-red-700 bg-red-50 py-4 px-8 rounded-full mb-10 w-max mx-auto border border-red-100">
                <AlertCircle size={18} className="text-red-600" />
                Batas Waktu: <span className="text-red-600 text-lg ml-1">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-5 text-base font-black border-2 border-red-100 text-red-950 hover:bg-red-50 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Memverifikasi..." : "[Simulasi] Konfirmasi Pembayaran"}
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
            className="max-w-xl mx-auto"
          >
            <div className="bg-white p-12 rounded-[2.5rem] border-2 border-red-100 shadow-2xl shadow-red-900/5 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-28 h-28 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(220,38,38,0.4)]"
              >
                <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
              </motion.div>
              
              <h2 className="text-4xl font-black mb-4 text-red-950 tracking-tight">Pembayaran Sukses!</h2>
              <p className="text-red-800 text-lg mb-12 font-bold leading-relaxed">
                Anda telah resmi bergabung ke grup patungan <br/>
                <span className="inline-block mt-2 px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-xl">{service.name}</span>
              </p>

              <div className="bg-white p-8 rounded-[2rem] text-left border-2 border-red-100 mb-10">
                <div className="flex justify-between text-base mb-5">
                  <span className="font-black text-red-950">Status Antrean Grup</span>
                  <span className="text-red-600 font-black text-xl">{service.filledSlots + 1} <span className="text-red-400 text-sm">/ {service.totalSlots} Orang</span></span>
                </div>
                
                <div className="w-full bg-red-50 rounded-full h-6 overflow-hidden mb-8 border border-red-100 p-1">
                  <motion.div 
                    initial={{ width: `${(service.filledSlots / service.totalSlots) * 100}%` }}
                    animate={{ width: `${((service.filledSlots + 1) / service.totalSlots) * 100}%` }}
                    transition={{ delay: 0.5, duration: 2, ease: "circOut" }}
                    className="h-full bg-red-600 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                  </motion.div>
                </div>
                
                <div className="flex items-start gap-4 bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <div className="w-3 h-3 bg-red-600 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
                  <p className="text-base text-red-900 leading-relaxed font-bold">
                    Menunggu <strong className="text-red-600 text-lg">{service.totalSlots - (service.filledSlots + 1)} orang lagi</strong> bergabung. Jika kuota penuh, email & password akan langsung dikirim otomatis ke WhatsApp <span className="text-red-600 underline decoration-red-300 underline-offset-4">{whatsapp}</span>.
                  </p>
                </div>
              </div>

              <Link 
                href="/"
                className="block w-full py-5 px-6 bg-red-950 text-white hover:bg-red-900 rounded-2xl font-black text-xl transition-all active:scale-[0.98] text-center shadow-lg"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
