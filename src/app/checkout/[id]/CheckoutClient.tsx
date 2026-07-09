"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, QrCode, ArrowLeft, Loader2, User, UserPlus, RefreshCw } from "lucide-react";
import { formatRupiah } from "@/data/services";
import Link from "next/link";

// Helper function to generate groups statically
const generateMockGroups = (slots: number, serviceName: string) => [
  { 
    id: `grup-a`, 
    name: `Grup ${serviceName} #${slots === 2 ? "204" : slots === 5 ? "504" : "104"}`, 
    filled: slots - 1, 
    total: slots, 
    status: "hampir-penuh", 
    slots: Array.from({ length: slots }, (_, i) => ({
      name: i < slots - 1 ? `Anggota ${i + 1}` : "Kosong",
      occupied: i < slots - 1
    })) 
  },
  { 
    id: `grup-b`, 
    name: `Grup ${serviceName} #${slots === 2 ? "205" : slots === 5 ? "505" : "105"}`, 
    filled: 1, 
    total: slots, 
    status: "tersedia", 
    slots: Array.from({ length: slots }, (_, i) => ({
      name: i === 0 ? "Anggota 1" : "Kosong",
      occupied: i === 0
    })) 
  }
];

export default function CheckoutClient({ service }: { service: any }) {
  const [appState, setAppState] = useState("checkout"); // checkout, payment, waiting
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk opsi paket patungan (misal: 2 User, 4 User, 5 User)
  const [selectedOption, setSelectedOption] = useState<any>(() => 
    service.options ? service.options.find((o: any) => o.isDefault) || service.options[0] : null
  );

  const currentPrice = selectedOption ? selectedOption.price : service.sharedPrice;
  const currentSlots = selectedOption ? selectedOption.slots : service.totalSlots;

  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [createdTransaction, setCreatedTransaction] = useState<any>(null);
  const [midtransRedirectUrl, setMidtransRedirectUrl] = useState<string | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  const maskName = (rawName: string) => {
    if (!rawName) return "Kosong";
    const firstChar = rawName.charAt(0).toLowerCase();
    let masked = firstChar;
    for (let i = 1; i < rawName.length; i++) {
      if (rawName[i] === " ") {
        masked += " ";
      } else {
        masked += "x";
      }
    }
    return masked;
  };

  const fetchGroups = async () => {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      const response = await fetch(`/api/groups?serviceId=${service.id}&slots=${currentSlots}`);
      const data = await response.json();
      if (response.ok) {
        if (data.groups) {
          const formattedGroups = data.groups.map((g: any) => {
            const trxs = g.transactions || [];
            const isFull = trxs.filter((t: any) => t.status === "SUCCESS").length >= g.max_slots;
            const slots = Array.from({ length: g.max_slots }, (_, i) => {
              const tx = trxs[i];
              if (tx) {
                return {
                  name: isFull ? maskName(tx.buyer_name) : tx.buyer_name,
                  occupied: true,
                  status: tx.status
                };
              }
              return {
                name: "Kosong",
                occupied: false,
                status: null
              };
            });

            return {
              id: g.id,
              name: `Grup ${service.name} #${g.group_number}`,
              filled: trxs.filter((t: any) => t.status === "SUCCESS").length,
              pending: trxs.filter((t: any) => t.status === "PENDING").length,
              total: g.max_slots,
              status: trxs.filter((t: any) => t.status === "SUCCESS").length >= g.max_slots 
                ? "penuh" 
                : trxs.filter((t: any) => t.status === "SUCCESS").length >= g.max_slots - 1 
                ? "hampir-penuh" 
                : "tersedia",
              slots
            };
          });
          setGroups(formattedGroups);
          
          const firstAvailableGroup = formattedGroups.find((g: any) => g.filled < g.total);
          setSelectedGroup(firstAvailableGroup || formattedGroups[0] || null);
        } else {
          setGroupsError("Format data grup dari server tidak valid.");
        }
      } else {
        setGroupsError(data.error || "Gagal menghubungi database.");
      }
    } catch (err: any) {
      console.error("Error fetching groups:", err);
      setGroupsError("Terjadi kesalahan jaringan saat mengambil data grup.");
    } finally {
      setGroupsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [selectedOption]);

  useEffect(() => {
    let timer: any;
    if (appState === "payment" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [appState, timeLeft]);

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    // Jika clientKey kosong atau berawalan SB-, gunakan sandbox. Hanya gunakan production jika key diisi dan tidak diawali SB-.
    const isProduction = !!clientKey && !clientKey.startsWith("SB-");
    const scriptUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    console.log("Loading Midtrans Snap from:", scriptUrl, "Client Key:", clientKey ? "Present" : "Missing");

    const existingScript = document.getElementById("midtrans-snap");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.id = "midtrans-snap";
      if (clientKey) {
        script.setAttribute("data-client-key", clientKey);
      }
      document.body.appendChild(script);
    }
  }, []);

  const handleCheckout = async () => {
    if (!selectedGroup) return;
    if (!name.trim() || !whatsapp.trim() || !email.trim()) {
      alert("Harap isi semua kolom formulir (Nama, WhatsApp, dan Email)!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          serviceId: service.id,
          optionLabel: selectedOption ? selectedOption.label : "Shared",
          price: currentPrice,
          groupId: selectedGroup.id
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCreatedTransaction(data.transaction);
          setMidtransRedirectUrl(data.redirectUrl || null);
          setSnapToken(data.token || null);
          setTimeLeft(15 * 60);
          setAppState("payment");
          
          if (data.token) {
            const snap = (window as any).snap;
            if (snap) {
              snap.pay(data.token, {
                onSuccess: function(result: any) {
                  setAppState("waiting");
                },
                onPending: function(result: any) {
                  setAppState("payment");
                },
                onError: function(result: any) {
                  alert("Pembayaran gagal. Silakan coba lagi.");
                },
                onClose: function() {
                  console.log("Customer closed the popup without finishing the payment");
                }
              });
            } else if (data.redirectUrl) {
              window.open(data.redirectUrl, "_blank");
            }
          }
        }
      } else {
        const errData = await response.json();
        alert(errData.error || "Gagal membuat transaksi");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Terjadi kesalahan saat memproses checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!createdTransaction) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer raihan9898"
        },
        body: JSON.stringify({
          id: createdTransaction.id,
          status: "SUCCESS"
        })
      });

      if (response.ok) {
        setAppState("waiting");
      } else {
        alert("Simulasi pembayaran gagal.");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 py-8 md:py-12 px-4 sm:px-6 bg-red-50/10">
      
      {/* CHECKOUT STATE */}
      {appState === "checkout" && (
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-red-700 font-bold mb-6 hover:text-red-600 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
          </Link>
          
          <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-red-100 shadow-xl shadow-red-900/5">
            
            {/* Header Layanan */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 mb-6 pb-6 border-b border-red-100">
              <div className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2.5 sm:p-3 bg-white border border-red-100 rounded-2xl shadow-sm">
                 <img 
                  src={service.logoUrl} 
                  alt={service.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-red-950 tracking-tight mb-1">{service.name}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-red-600 font-bold text-lg sm:text-xl">{formatRupiah(currentPrice)}</p>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 font-semibold text-[10px] sm:text-xs rounded-full">Per Bulan</span>
                </div>
              </div>
            </div>

            {/* Deskripsi Layanan / Fitur */}
            {service.description && (
              <div className="mb-6 p-4 bg-red-50/40 rounded-2xl border border-red-50/80 text-xs sm:text-sm text-red-900 leading-relaxed font-medium">
                <strong className="text-red-950 block mb-1">Fitur Utama:</strong>
                {service.description}
              </div>
            )}

            {/* OPSI PAKET PATUNGAN */}
            {service.options && (
              <div className="mb-6 pb-6 border-b border-red-100">
                <h3 className="text-sm sm:text-base font-bold text-red-950 mb-3">Pilih Opsi Patungan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {service.options.map((opt: any) => {
                    const isSelected = selectedOption?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center ${
                          isSelected
                            ? "bg-red-50 border-red-600 ring-2 ring-red-600/10"
                            : "bg-white border-red-100 hover:border-red-300"
                        }`}
                      >
                        <div className="w-full">
                          <p className="text-xs sm:text-sm font-bold text-red-950">{opt.label}</p>
                          <p className="text-[10px] sm:text-xs text-red-600 font-bold mt-0.5">{formatRupiah(opt.price)}</p>
                        </div>
                        {opt.note && (
                          <span className="mt-2 text-[8px] sm:text-[10px] text-red-700/80 font-bold bg-red-100/40 px-1.5 py-0.5 rounded border border-red-100/30">
                            {opt.note}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PILIHAN GRUP */}
            <div className="mb-8 pb-8 border-b border-red-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm sm:text-base font-bold text-red-950">
                  Pilih Grup Patungan Aktif
                </h3>
              </div>
              
              {groupsError ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-semibold space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-red-800">
                    <AlertCircle size={14} className="text-red-650" />
                    Koneksi database gagal: {groupsError}
                  </p>
                  <p className="text-[10px] text-red-650/80 leading-relaxed font-bold">
                    Pastikan Anda telah mengisi variables URL & Anon Key di Vercel, lalu picu Redeploy.
                  </p>
                  <button 
                    type="button"
                    onClick={fetchGroups}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border-2 border-red-750 transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <RefreshCw size={10} /> Coba Lagi
                  </button>
                </div>
              ) : groupsLoading && groups.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-4 bg-red-50/20 border border-red-100/50 rounded-2xl animate-pulse space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="w-24 h-4 bg-red-100 rounded"></div>
                        <div className="w-12 h-4 bg-red-100 rounded-full"></div>
                      </div>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="w-6 h-6 rounded-full bg-red-100"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : groups.length === 0 ? (
                <p className="text-xs text-slate-500 font-bold text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
                  Tidak ada grup patungan aktif.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {groups.map((group) => {
                    const isFull = group.filled >= group.total;
                    const isChosen = selectedGroup?.id === group.id;
                    
                    return (
                      <div
                        key={group.id}
                        onClick={() => !isFull && setSelectedGroup(group)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          isFull 
                            ? "bg-red-50/20 border-red-100 opacity-60 cursor-not-allowed" 
                            : isChosen
                              ? "bg-red-50 border-red-600 ring-2 ring-red-600/10 cursor-pointer"
                              : "bg-white border-red-100 hover:border-red-300 cursor-pointer"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-xs sm:text-sm font-bold text-red-950">{group.name}</span>
                          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                            isFull 
                              ? "bg-red-100 text-red-800" 
                              : group.status === "hampir-penuh"
                                ? "bg-red-600 text-white animate-pulse"
                                : "bg-red-100 text-red-700"
                          }`}>
                            {isFull ? "Full" : `${group.filled}/${group.total}`}
                          </span>
                        </div>

                        {/* Visualisasi Slot */}
                        <div className="flex gap-1.5">
                          {group.slots.map((slot: any, i: number) => (
                            <div 
                              key={i} 
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border text-[8px] sm:text-[10px] font-bold ${
                                slot.occupied 
                                  ? slot.status === "PENDING"
                                    ? "bg-amber-500 border-amber-500 text-white"
                                    : "bg-red-600 border-red-600 text-white"
                                  : "border-dashed border-red-300 text-red-300 bg-white"
                              }`}
                              title={slot.name}
                            >
                              {slot.occupied ? <User size={8} /> : <UserPlus size={8} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

              {/* Detail Slot */}
              {selectedGroup && (
                <div className="bg-red-50/50 p-4 sm:p-5 rounded-2xl border border-red-100">
                  <p className="text-[10px] sm:text-xs font-bold text-red-800 uppercase tracking-wider mb-3">Detail Anggota {selectedGroup.name}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {selectedGroup.slots.map((slot: any, i: number) => {
                      const isOccupied = slot.occupied;
                      const showPreviewName = !isOccupied && name;
                      
                      return (
                        <div key={i} className="flex items-center gap-2 bg-white px-2.5 py-2 rounded-xl border border-red-100 min-w-0">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isOccupied 
                              ? slot.status === "PENDING"
                                ? "bg-amber-500 text-white animate-pulse"
                                : "bg-red-600 text-white"
                              : showPreviewName 
                                ? "bg-red-600 text-white" 
                                : "bg-red-50 text-red-300"
                          }`}>
                            <User size={12} />
                          </div>
                           <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-[9px] sm:text-[10px] text-red-400 font-semibold">Slot {i+1}</p>
                              {isOccupied && slot.status === "PENDING" && (
                                <span className="bg-amber-50 text-amber-600 text-[8px] px-1 rounded font-black border border-amber-100 animate-pulse">PENDING</span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-red-950 truncate">
                              {isOccupied ? slot.name : showPreviewName ? `${name} (Anda)` : "Kosong"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Form Checkout */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-red-950 mb-2">
                  Nama Panggilan Anda
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-semibold text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-red-950 mb-2">
                  Nomor WhatsApp Aktif
                </label>
                <input 
                  type="tel" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-semibold text-sm sm:text-base"
                />
                <div className="text-[10px] sm:text-xs text-red-700 mt-2 flex items-start gap-1.5 font-semibold bg-red-50 p-2.5 rounded-lg">
                  <AlertCircle size={12} className="text-red-600 flex-shrink-0 mt-0.5" /> 
                  <span>Notifikasi sukses pembayaran akan dikirim via WA.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-red-950 mb-2">
                  Email Aktif Anda
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-semibold text-sm sm:text-base"
                />
                <div className="text-[10px] sm:text-xs text-red-700 mt-2 flex items-start gap-1.5 font-semibold bg-red-50 p-2.5 rounded-lg">
                  <AlertCircle size={12} className="text-red-600 flex-shrink-0 mt-0.5" /> 
                  <span>Kredensial akun premium akan dikirim ke email ini saat grup penuh.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white border border-red-100 rounded-xl mt-4 cursor-pointer hover:border-red-200 transition-colors" onClick={() => setAgreed(!agreed)}>
                <div className="relative flex items-start pt-0.5">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${agreed ? 'bg-red-600 border-red-600' : 'border-red-300 bg-white'}`}>
                    <CheckCircle2 size={12} className={`text-white transition-opacity ${agreed ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-red-900 leading-relaxed font-semibold">
                  Saya menyetujui Syarat & Ketentuan. <strong className="text-red-600 block mt-0.5">Dilarang mengubah profil atau password orang lain di dalam akun.</strong>
                </div>
              </div>

              <button 
                disabled={!name || !whatsapp || !agreed || isLoading}
                onClick={handleCheckout}
                className="relative w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 disabled:bg-red-50 disabled:text-red-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base sm:text-lg transition-all active:scale-[0.98] mt-6 flex justify-center items-center gap-2 overflow-hidden group shadow-md"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <QrCode size={18} className="group-hover:scale-105 transition-transform" /> Bayar Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT STATE (QRIS) */}
      {appState === "payment" && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-red-100 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            
            <h2 className="text-xl sm:text-2xl font-bold mb-1.5 text-red-950">Selesaikan Pembayaran</h2>
            <div className="space-y-4 mb-6">
              <button 
                onClick={() => {
                  const snap = (window as any).snap;
                  if (snap && snapToken) {
                    snap.pay(snapToken, {
                      onSuccess: function(result: any) {
                        setAppState("waiting");
                      },
                      onPending: function(result: any) {
                        setAppState("payment");
                      },
                      onError: function(result: any) {
                        alert("Pembayaran gagal. Silakan coba lagi.");
                      },
                      onClose: function() {
                        console.log("Customer closed the popup without finishing the payment");
                      }
                    });
                  } else if (midtransRedirectUrl) {
                    window.open(midtransRedirectUrl, "_blank");
                  }
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-650/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <QrCode size={18} />
                Bayar Sekarang
              </button>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed px-4">
                Selesaikan pembayaran secara instan menggunakan QRIS, Gopay, OVO, Dana, ShopeePay, atau Virtual Account Bank.
              </p>
            </div>
            
            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] sm:text-xs text-red-700 font-bold mb-1 uppercase tracking-wider">Total Tagihan</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-650">{formatRupiah(currentPrice)}</p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-bold text-red-700 bg-red-50 py-2.5 px-4 rounded-full mb-2 mx-auto border border-red-100 w-auto max-w-full">
              <AlertCircle size={14} className="text-red-650 flex-shrink-0" />
              <span>Batas Waktu: <span className="text-red-600 font-bold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></span>
            </div>
          </div>
        </div>
      )}

      {/* WAITING ROOM STATE */}
      {appState === "waiting" && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-red-100 shadow-xl text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-md"
            >
              <CheckCircle2 size={28} className="text-white" strokeWidth={2.5} />
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-red-950 tracking-tight">Pembayaran Sukses!</h2>
            <p className="text-red-800 text-sm sm:text-base mb-6 sm:mb-8 font-semibold leading-relaxed">
              Anda telah resmi bergabung ke grup patungan <br/>
              <span className="inline-block mt-1.5 px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs sm:text-sm">{selectedGroup ? selectedGroup.name : service.name}</span>
            </p>

            <div className="bg-white p-5 sm:p-6 rounded-2xl text-left border border-red-100 mb-6 sm:mb-8">
              <div className="flex justify-between text-xs sm:text-sm mb-3">
                <span className="font-bold text-red-950">Status Antrean Grup</span>
                <span className="text-red-600 font-bold text-sm sm:text-base">{selectedGroup ? selectedGroup.filled + 1 : service.filledSlots + 1} <span className="text-red-400 text-[10px] sm:text-xs"> / {selectedGroup ? selectedGroup.total : service.totalSlots} Orang</span></span>
              </div>
              
              <div className="w-full bg-red-50 rounded-full h-3.5 overflow-hidden mb-5 sm:mb-6 border border-red-100 p-0.5">
                <motion.div 
                  initial={{ width: `${(selectedGroup ? selectedGroup.filled : service.filledSlots) / (selectedGroup ? selectedGroup.total : service.totalSlots) * 100}%` }}
                  animate={{ width: `${((selectedGroup ? selectedGroup.filled : service.filledSlots) + 1) / (selectedGroup ? selectedGroup.total : service.totalSlots) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                  className="h-full bg-red-600 rounded-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_1s_infinite_linear]" />
                </motion.div>
              </div>
              
              <div className="flex items-start gap-3 bg-red-50/50 p-4 rounded-xl border border-red-50">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-1.5 animate-pulse flex-shrink-0"></div>
                <p className="text-xs text-red-900 leading-relaxed font-semibold">
                  Menunggu <strong className="text-red-600">{(selectedGroup ? selectedGroup.total : service.totalSlots) - ((selectedGroup ? selectedGroup.filled : service.filledSlots) + 1)} orang lagi</strong> bergabung. Kredensial akun dikirim otomatis ke WA <span className="text-red-600 underline decoration-red-300 underline-offset-4">{whatsapp}</span>.
                </p>
              </div>
            </div>

            <Link 
              href="/"
              className="block w-full py-3.5 px-6 bg-red-950 text-white hover:bg-red-900 rounded-xl font-bold text-sm sm:text-base transition-all active:scale-[0.98] text-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
