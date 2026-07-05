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
    <div className="flex-1 py-12 px-6 bg-red-50/10">
      <AnimatePresence mode="wait">
        
        {/* CHECKOUT STATE */}
        {appState === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl mx-auto"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-red-700 font-bold mb-6 hover:text-red-600 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
            </Link>
            
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-red-100 shadow-xl shadow-red-900/5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-8 pb-8 border-b border-red-100">
                <div className="h-20 w-28 flex items-center justify-center p-3 bg-white border border-red-100 rounded-2xl shadow-sm">
                   <img 
                    src={service.logoUrl} 
                    alt={service.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-950 tracking-tight mb-1">{service.name}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-red-600 font-bold text-xl">{formatRupiah(service.sharedPrice)}</p>
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 font-semibold text-xs rounded-full">Per Bulan</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-red-950 mb-2">
                    Nama Panggilan
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Budi Santoso"
                    className="w-full px-5 py-3.5 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-semibold text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-red-950 mb-2">
                    Nomor WhatsApp Aktif
                  </label>
                  <input 
                    type="tel" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-5 py-3.5 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-semibold text-base"
                  />
                  <p className="text-xs text-red-700 mt-2 flex items-center gap-1.5 font-semibold bg-red-50 p-2.5 rounded-lg">
                    <AlertCircle size={14} className="text-red-600 flex-shrink-0" /> Akun premium akan dikirim ke nomor ini via WA.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white border border-red-100 rounded-xl mt-4 cursor-pointer hover:border-red-200 transition-colors" onClick={() => setAgreed(!agreed)}>
                  <div className="relative flex items-start pt-0.5">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${agreed ? 'bg-red-600 border-red-600' : 'border-red-300 bg-white'}`}>
                      <CheckCircle2 size={12} className={`text-white transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                    </div>
                  </div>
                  <div className="text-sm text-red-900 leading-relaxed font-semibold">
                    Saya menyetujui Syarat & Ketentuan. <strong className="text-red-600 block mt-0.5">Dilarang mengubah profil atau password orang lain di dalam akun.</strong>
                  </div>
                </div>

                <button 
                  disabled={!name || !whatsapp || !agreed || isLoading}
                  onClick={handleCheckout}
                  className="relative w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-50 disabled:text-red-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2 overflow-hidden group shadow-md"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <QrCode size={20} className="group-hover:scale-105 transition-transform" /> Bayar Sekarang
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              
              <h2 className="text-2xl font-bold mb-2 text-red-950">Selesaikan Pembayaran</h2>
              <p className="text-red-700 text-sm mb-8 font-semibold">Buka M-Banking atau E-Wallet Anda lalu scan kode QR di bawah ini.</p>
              
              <div className="bg-white p-4 rounded-2xl inline-block mb-8 border border-red-100 shadow-sm">
                <div className="w-48 h-48 border border-red-50 rounded-xl flex items-center justify-center bg-white">
                  {isLoading ? (
                    <Loader2 size={36} className="text-red-300 animate-spin" />
                  ) : (
                    <QrCode size={180} className="text-red-950" strokeWidth={1.2} />
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-xs text-red-700 font-bold mb-1 uppercase tracking-wider">Total Tagihan</p>
                <p className="text-3xl font-bold text-red-600">{formatRupiah(service.sharedPrice)}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-700 bg-red-50 py-3 px-6 rounded-full mb-8 w-max mx-auto border border-red-100">
                <AlertCircle size={16} className="text-red-600" />
                Batas Waktu: <span className="text-red-600 text-sm ml-1 font-bold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 text-sm font-bold border border-red-100 text-red-950 hover:bg-red-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-xl text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-md"
              >
                <CheckCircle2 size={36} className="text-white" strokeWidth={2.5} />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-3 text-red-950 tracking-tight">Pembayaran Sukses!</h2>
              <p className="text-red-800 text-base mb-8 font-semibold leading-relaxed">
                Anda telah resmi bergabung ke grup patungan <br/>
                <span className="inline-block mt-1.5 px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">{service.name}</span>
              </p>

              <div className="bg-white p-6 rounded-2xl text-left border border-red-100 mb-8">
                <div className="flex justify-between text-sm mb-4">
                  <span className="font-bold text-red-950">Status Antrean Grup</span>
                  <span className="text-red-600 font-bold text-base">{service.filledSlots + 1} <span className="text-red-400 text-xs">/ {service.totalSlots} Orang</span></span>
                </div>
                
                <div className="w-full bg-red-50 rounded-full h-4 overflow-hidden mb-6 border border-red-100 p-0.5">
                  <motion.div 
                    initial={{ width: `${(service.filledSlots / service.totalSlots) * 100}%` }}
                    animate={{ width: `${((service.filledSlots + 1) / service.totalSlots) * 100}%` }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                    className="h-full bg-red-600 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                  </motion.div>
                </div>
                
                <div className="flex items-start gap-3 bg-red-50/50 p-4 rounded-xl border border-red-50">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
                  <p className="text-sm text-red-900 leading-relaxed font-semibold">
                    Menunggu <strong className="text-red-600">{service.totalSlots - (service.filledSlots + 1)} orang lagi</strong> bergabung. Jika kuota penuh, email & password akan dikirim otomatis ke WhatsApp <span className="text-red-600 underline decoration-red-300 underline-offset-4">{whatsapp}</span>.
                  </p>
                </div>
              </div>

              <Link 
                href="/"
                className="block w-full py-4 px-6 bg-red-950 text-white hover:bg-red-900 rounded-xl font-bold text-base transition-all active:scale-[0.98] text-center"
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
