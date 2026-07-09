"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ArrowLeft, AlertCircle, QrCode, CheckCircle2, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/data/services";

export default function LacakClient() {
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // Load Midtrans Snap JS dynamically
  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    const isProduction = !!clientKey && !clientKey.startsWith("SB-");
    const scriptUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/transactions/track?id=${invoiceId.trim().toUpperCase()}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Gagal melacak invoice.");
      }
    } catch (err: any) {
      console.error("Tracking error:", err);
      setError("Terjadi kesalahan koneksi saat melacak invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    if (!result || !result.token) return;

    const snap = (window as any).snap;
    if (snap) {
      snap.pay(result.token, {
        onSuccess: function (res: any) {
          // Re-fetch to update status
          handleSearch({ preventDefault: () => {} } as any);
        },
        onPending: function (res: any) {
          handleSearch({ preventDefault: () => {} } as any);
        },
        onError: function (res: any) {
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: function () {
          console.log("Customer closed popup");
        }
      });
    } else if (result.redirectUrl) {
      window.open(result.redirectUrl, "_blank");
    }
  };

  // Email masking helper
  const maskEmail = (email: string) => {
    if (!email) return "";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) {
      return `${name.charAt(0)}*@${domain}`;
    }
    return `${name.charAt(0)}${"*".repeat(name.length - 2)}${name.charAt(name.length - 1)}@${domain}`;
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 bg-red-50/10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-red-700 font-bold mb-6 hover:text-red-650 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
        </Link>

        {/* SEARCH FORM */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl shadow-red-900/5 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-red-950 tracking-tight mb-2">Lacak Pembelian Anda</h2>
          <p className="text-xs sm:text-sm text-red-800/70 font-semibold mb-6">
            Masukkan Kode Invoice (contoh: TRX-XXXXXX) untuk mengecek status pembayaran, grup patungan, dan kredensial akun Anda.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              placeholder="TRX-XXXXXX"
              className="flex-1 px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white transition-all text-red-950 placeholder-red-300 font-bold text-sm sm:text-base uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-5 py-3 rounded-xl border border-red-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  <span>Cari</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* RESULTS */}
        {result && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-xl shadow-red-900/5 space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-16 flex items-center justify-center p-2 bg-white border border-red-50 rounded-xl shadow-sm">
                  <img src={result.transaction.logoUrl} alt={result.transaction.serviceName} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-red-950 leading-snug">{result.transaction.serviceName}</h3>
                  <p className="text-[10px] sm:text-xs text-red-600 font-bold">{result.transaction.optionLabel}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Invoice ID</p>
                <p className="text-sm sm:text-base font-black text-red-950">{result.transaction.id}</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-red-100">
              <div>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Status Pembayaran</p>
                {result.transaction.status === "SUCCESS" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-xs sm:text-sm rounded-full">
                    <CheckCircle2 size={14} /> Lunas (SUCCESS)
                  </span>
                ) : result.transaction.status === "PENDING" ? (
                  <div className="space-y-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 font-extrabold text-xs sm:text-sm rounded-full animate-pulse">
                        <AlertCircle size={14} /> Menunggu Pembayaran
                      </span>
                    </div>
                    <button
                      onClick={handlePay}
                      className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/10 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <QrCode size={14} />
                      Bayar Sekarang
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 font-extrabold text-xs sm:text-sm rounded-full">
                    <AlertCircle size={14} /> Kedaluwarsa (EXPIRED)
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Nama Pembeli</p>
                <p className="text-sm sm:text-base font-bold text-red-950">{result.transaction.buyerName}</p>
                <p className="text-[10px] text-red-600 font-semibold">{maskEmail(result.transaction.buyerEmail)}</p>
              </div>
            </div>

            {/* Group details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-red-950">Progres Grup Patungan</h4>
                  <p className="text-[10px] text-red-800/60 font-semibold">{result.group.name}</p>
                </div>
                <span className="text-red-700 font-black text-sm sm:text-base bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  {result.group.filled} / {result.group.total} <span className="text-red-400 text-[10px] sm:text-xs">Orang</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-red-50 rounded-full h-3 border border-red-100 p-0.5 overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(result.group.filled / result.group.total) * 100}%` }}
                />
              </div>

              {/* Slot details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {result.group.slots.map((slot: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${
                      slot.occupied
                        ? slot.status === "PENDING"
                          ? "bg-amber-50 border-amber-200 text-amber-800"
                          : slot.isSelf
                            ? "bg-red-50 border-red-600 text-red-950 font-bold ring-1 ring-red-600/10"
                            : "bg-white border-red-100 text-red-900"
                        : "bg-white border-dashed border-red-200 text-red-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        slot.occupied
                          ? slot.status === "PENDING"
                            ? "bg-amber-500 text-white"
                            : "bg-red-600 text-white"
                          : "bg-red-50 text-red-300"
                      }`}
                    >
                      <User size={10} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] text-red-400 font-bold uppercase">Slot {idx + 1}</p>
                      <p className="text-[10px] sm:text-xs truncate font-bold">
                        {slot.occupied ? (slot.isSelf ? `${slot.name} (Anda)` : slot.name) : "Kosong"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions Banner */}
              <div className="pt-4">
                {result.group.isFull ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold">Grup Patungan Penuh!</p>
                      <p className="text-[10px] sm:text-xs text-emerald-700/80 leading-relaxed font-semibold mt-0.5">
                        Kredensial akun premium telah dikirimkan ke email terdaftar Anda **({maskEmail(result.transaction.buyerEmail)})**. Silakan periksa kotak masuk email Anda (termasuk folder spam).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-900 rounded-2xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-bold">Menunggu Slot Penuh</p>
                      <p className="text-[10px] sm:text-xs text-red-800/80 leading-relaxed font-semibold mt-0.5">
                        Sistem sedang menunggu **{result.group.total - result.group.filled} orang lagi** untuk melunasi pembayaran sebelum akun dikirim. Detail login akan dikirim secara otomatis ke email Anda begitu slot terisi penuh.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
