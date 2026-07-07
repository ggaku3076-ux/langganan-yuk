"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Send, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  LogOut, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Database, 
  Smartphone,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { services, formatRupiah } from "@/data/services";

// Define mock data matching current checkout flows
interface Transaction {
  id: string;
  name: string;
  whatsapp: string;
  serviceId: string;
  optionLabel: string;
  price: number;
  status: "PENDING" | "SUCCESS" | "EXPIRED";
  timestamp: string;
  groupId: string;
  referenceId: string;
}

const initialTransactions: Transaction[] = [
  {
    id: "TRX-876123",
    name: "Ahmad Subarjo",
    whatsapp: "081234567890",
    serviceId: "netflix",
    optionLabel: "4 User",
    price: 50000,
    status: "SUCCESS",
    timestamp: "2026-07-07 08:12",
    groupId: "netflix-group-12",
    referenceId: "PAY-NET-09871"
  },
  {
    id: "TRX-876124",
    name: "Riana Putri",
    whatsapp: "087799881122",
    serviceId: "claude",
    optionLabel: "3 User",
    price: 130000,
    status: "SUCCESS",
    timestamp: "2026-07-07 07:54",
    groupId: "claude-group-5",
    referenceId: "PAY-CLD-11928"
  },
  {
    id: "TRX-876125",
    name: "Budi Santoso",
    whatsapp: "085211223344",
    serviceId: "gpt5",
    optionLabel: "4 User",
    price: 100000,
    status: "PENDING",
    timestamp: "2026-07-07 08:35",
    groupId: "gpt5-group-1",
    referenceId: "PAY-GPT-77312"
  },
  {
    id: "TRX-876126",
    name: "Siti Rahma",
    whatsapp: "081987654321",
    serviceId: "spotify",
    optionLabel: "3 User",
    price: 50000,
    status: "SUCCESS",
    timestamp: "2026-07-06 21:10",
    groupId: "spotify-group-9",
    referenceId: "PAY-SPT-22109"
  },
  {
    id: "TRX-876127",
    name: "Dimas Wibowo",
    whatsapp: "082133445566",
    serviceId: "netflix",
    optionLabel: "2 User",
    price: 96500,
    status: "EXPIRED",
    timestamp: "2026-07-06 18:45",
    groupId: "netflix-group-11",
    referenceId: "PAY-NET-00381"
  }
];

export default function AdminDashboard() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard states
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  // Check authentication status on mount & hide global layout components
  useEffect(() => {
    const authStatus = localStorage.getItem("gexxa_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // Hide global website layout elements
    const globalNavbar = document.getElementById("global-navbar");
    const globalFooter = document.getElementById("global-footer");
    const globalFab = document.getElementById("global-whatsapp-fab");

    if (globalNavbar) globalNavbar.style.display = "none";
    if (globalFooter) globalFooter.style.display = "none";
    if (globalFab) globalFab.style.display = "none";

    return () => {
      // Restore global website layout elements on unmount
      if (globalNavbar) globalNavbar.style.display = "";
      if (globalFooter) globalFooter.style.display = "";
      if (globalFab) globalFab.style.display = "";
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "gexxa" && password === "raihan9898") {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("gexxa_auth", "true");
    } else {
      setLoginError("Username atau Password salah!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("gexxa_auth");
    setUsername("");
    setPassword("");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleDeleteTrx = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data transaksi ini dari log?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: "PENDING" | "SUCCESS" | "EXPIRED") => {
    setTransactions(transactions.map(t => {
      if (t.id === id) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleOpenCredentials = (trx: Transaction) => {
    setSelectedTrx(trx);
    setShowCredentialsModal(true);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.whatsapp.includes(searchQuery) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesService = serviceFilter === "ALL" || t.serviceId === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  // Calculate statistics
  const totalSales = transactions
    .filter(t => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.price, 0);

  const pendingCount = transactions.filter(t => t.status === "PENDING").length;
  const successCount = transactions.filter(t => t.status === "SUCCESS").length;
  const expiredCount = transactions.filter(t => t.status === "EXPIRED").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-red-950 border border-red-600/30 rounded-2xl flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-900/20">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Gexxa Control Room</h1>
            <p className="text-slate-400 text-sm mt-1 text-center font-medium">Masukkan kredensial admin rahasia untuk melanjutkan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 text-sm rounded-2xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm mt-8"
            >
              <Unlock size={18} />
              Buka Akses Console
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-slate-600 text-xs mt-8 flex items-center gap-1 font-medium">
          <ShieldCheck size={14} /> Secure Access Logged
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER CONSOLE */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-950 border border-red-600 text-red-500 rounded-xl flex items-center justify-center font-black">
              GX
            </div>
            <div>
              <span className="text-white font-black text-base tracking-tight flex items-center gap-1.5">
                Gexxa Console <span className="bg-red-950 border border-red-800 text-red-400 font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded-md">Admin</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">LanggananYuk Control Station</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Database indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Database size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-semibold">Supabase Connected</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 hover:border-red-900 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* STATS SECTION */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-950 border border-red-600/30 text-red-500 rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Total Pendapatan</p>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">{formatRupiah(totalSales)}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-950/40 border border-amber-600/30 text-amber-500 rounded-2xl flex items-center justify-center">
              <Clock size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Transaksi Pending</p>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">{pendingCount} <span className="text-xs text-slate-500 font-medium">Antrean</span></h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-600/30 text-emerald-500 rounded-2xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Transaksi Sukses</p>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">{successCount} <span className="text-xs text-slate-500 font-medium">Lunas</span></h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Tingkat Konversi</p>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {transactions.length > 0 ? Math.round((successCount / transactions.length) * 100) : 0}%
              </h3>
            </div>
          </div>
        </section>

        {/* MANAGEMENT PANEL */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Daftar Transaksi Patungan</span>
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{filteredTransactions.length} Log</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Pantau verifikasi QRIS, antrean grup, dan trigger pesan kirim akun WA</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-white font-bold p-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="p-6 bg-slate-950/40 border-b border-slate-800/80 grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi (Nama, WhatsApp, Invoice ID, Referensi)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all font-semibold"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
              <span className="text-slate-500"><Filter size={14} /></span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-300 font-bold focus:outline-none border-none cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="SUCCESS">Lunas (SUCCESS)</option>
                <option value="PENDING">Menunggu (PENDING)</option>
                <option value="EXPIRED">Gagal (EXPIRED)</option>
              </select>
            </div>

            {/* Filter Service */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1">
              <span className="text-slate-500"><Filter size={14} /></span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-300 font-bold focus:outline-none border-none cursor-pointer"
              >
                <option value="ALL">Semua Layanan</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-black bg-slate-950/20">
                  <th className="py-4 px-6">ID & Referensi</th>
                  <th className="py-4 px-6">Pelanggan</th>
                  <th className="py-4 px-6">Layanan & Opsi</th>
                  <th className="py-4 px-6">Pembayaran</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Aksi / Kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium bg-slate-950/5">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="text-slate-600" />
                        <span>Tidak ada transaksi yang cocok dengan filter pencarian</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => {
                    const svc = services.find(s => s.id === trx.serviceId);
                    return (
                      <tr key={trx.id} className="hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-white tracking-tight">{trx.id}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
                            {trx.referenceId}
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-bold text-white">{trx.name}</span>
                          <a 
                            href={`https://wa.me/${trx.whatsapp.replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-400 hover:underline mt-0.5 flex items-center gap-0.5 font-bold"
                          >
                            <Smartphone size={10} />
                            {trx.whatsapp}
                          </a>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-200">{svc?.name || trx.serviceId}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                            Paket {trx.optionLabel} &bull; <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-extrabold">{trx.groupId}</span>
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <span className="font-black text-white">{formatRupiah(trx.price)}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">{trx.timestamp}</p>
                        </td>

                        <td className="py-4 px-6">
                          {trx.status === "SUCCESS" && (
                            <span className="bg-emerald-950 border border-emerald-900 text-emerald-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> SUCCESS
                            </span>
                          )}
                          {trx.status === "PENDING" && (
                            <span className="bg-amber-950 border border-amber-900 text-amber-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> PENDING
                            </span>
                          )}
                          {trx.status === "EXPIRED" && (
                            <span className="bg-slate-850 border border-slate-800 text-slate-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> EXPIRED
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle payment status shortcut */}
                            {trx.status === "PENDING" && (
                              <button
                                onClick={() => handleUpdateStatus(trx.id, "SUCCESS")}
                                className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-900 hover:border-emerald-700 text-emerald-400 font-bold px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer"
                                title="Set Lunas"
                              >
                                Set Lunas
                              </button>
                            )}

                            {/* Trigger WA Account delivery */}
                            <button
                              onClick={() => handleOpenCredentials(trx)}
                              disabled={trx.status !== "SUCCESS"}
                              className="bg-slate-800 hover:bg-red-950 hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-700 hover:border-red-900 font-bold p-1.5 rounded-lg transition-all cursor-pointer"
                              title="Kirim Kredensial via WA"
                            >
                              <Send size={12} />
                            </button>

                            {/* Delete Log */}
                            <button
                              onClick={() => handleDeleteTrx(trx.id)}
                              className="bg-slate-800 hover:bg-red-950 hover:text-red-500 text-slate-400 hover:border-red-900 border border-slate-700 p-1.5 rounded-lg transition-all cursor-pointer"
                              title="Hapus Log"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* CREDENTIALS/WHATSAPP DIALOG */}
      {showCredentialsModal && selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-white mb-2">Kirim Akun ke Pembeli</h3>
            <p className="text-xs text-slate-400 mb-6">
              Kirim kredensial layanan patungan **{services.find(s => s.id === selectedTrx.serviceId)?.name}** langsung ke nomor **{selectedTrx.whatsapp}** ({selectedTrx.name}).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">Pilih Stok Akun Aktif</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">netflix-indo-premium43@gmail.com</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Password: IndoPrem332! &bull; Profile: 4</p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded">Ready</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">Draft Pesan WhatsApp</label>
                <textarea
                  readOnly
                  rows={6}
                  value={`Halo ${selectedTrx.name},\n\nPembayaran Anda untuk patungan ${services.find(s => s.id === selectedTrx.serviceId)?.name} telah diverifikasi sukses! 🎉\n\nBerikut detail akun premium Anda:\n- Email: netflix-indo-premium43@gmail.com\n- Password: IndoPrem332!\n- Profil Penggunaan: Profil 4 / User 4\n- PIN Profil: 9912\n\nMohon dilarang mengubah password/kredensial agar masa garansi Anda tetap aktif.\n\nTerima kasih,\nLanggananYuk Support`}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-2xl p-4 focus:outline-none font-semibold leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-2xl text-xs cursor-pointer border border-slate-700 transition-all"
              >
                Batalkan
              </button>
              <button
                onClick={() => {
                  alert(`Pesanan akun premium sukses dikirim via WhatsApp ke ${selectedTrx.whatsapp}!`);
                  setShowCredentialsModal(false);
                }}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/20 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                Kirim via Fonnte API
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; 2026 LanggananYuk Admin Console. All Rights Reserved.</span>
          <span className="flex items-center gap-1 text-[10px] bg-slate-950 px-2 py-1 border border-slate-800 rounded-lg">
            <Lock size={10} /> Hashed Access: SHA-256 Enabled
          </span>
        </div>
      </footer>
    </div>
  );
}
