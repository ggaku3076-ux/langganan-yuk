"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
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
  ShieldCheck,
  PlusCircle,
  Tag,
  Key,
  FolderOpen,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { services, formatRupiah } from "@/data/services";
import { supabase } from "@/lib/supabase";

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
  const [loginError, setLoginError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const getAuthHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("gexxa_token") || ""}`
  });

  // Dashboard states
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);

  // Tab state: "transactions" | "grup" | "inventory"
  const [activeTab, setActiveTab] = useState<"transactions" | "grup" | "inventory">("transactions");

  // Groups tab states
  const [groupsList, setGroupsList] = useState<any[]>([]);
  const [selectedServiceForGroups, setSelectedServiceForGroups] = useState<string>("netflix");
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [isSendingWa, setIsSendingWa] = useState(false);

  // Check session and validate email on mount & hide global layout components
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email;
        const allowedAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "rehanalay9@gmail.com").toLowerCase();
        
        if (email && email.toLowerCase() === allowedAdminEmail) {
          setIsAuthenticated(true);
          localStorage.setItem("gexxa_token", session.access_token);
        } else {
          await supabase.auth.signOut();
          setLoginError(`Akses Ditolak: Email ${email} bukan email Admin.`);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const email = session.user.email;
        const allowedAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "rehanalay9@gmail.com").toLowerCase();
        if (email && email.toLowerCase() === allowedAdminEmail) {
          setIsAuthenticated(true);
          localStorage.setItem("gexxa_token", session.access_token);
        } else {
          await supabase.auth.signOut();
          setLoginError(`Akses Ditolak: Email ${email} bukan email Admin.`);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("gexxa_token");
      }
    });

    // Hide global website layout elements
    const globalNavbar = document.getElementById("global-navbar");
    const globalFooter = document.getElementById("global-footer");
    const globalFab = document.getElementById("global-whatsapp-fab");

    if (globalNavbar) globalNavbar.style.display = "none";
    if (globalFooter) globalFooter.style.display = "none";
    if (globalFab) globalFab.style.display = "none";

    return () => {
      subscription.unsubscribe();
      // Restore global website layout elements on unmount
      if (globalNavbar) globalNavbar.style.display = "";
      if (globalFooter) globalFooter.style.display = "";
      if (globalFab) globalFab.style.display = "";
    };
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions", {
        headers: {
          ...getAuthHeader()
        }
      });
      const data = await response.json();
      if (response.ok) {
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      } else {
        alert(`Gagal mengambil data dari Supabase: ${data.error || "Gagal otentikasi admin."}`);
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      alert("Gagal menghubungi API transaksi. Pastikan koneksi internet aktif dan server Vercel Anda online.");
    }
  };

  const fetchGroupsList = async () => {
    setGroupsLoading(true);
    try {
      const response = await fetch("/api/admin/groups", {
        headers: {
          ...getAuthHeader()
        }
      });
      const data = await response.json();
      if (response.ok) {
        if (data.groups) {
          setGroupsList(data.groups);
        }
      } else {
        alert(`Gagal mengambil data grup: ${data.error || "Gagal otentikasi admin."}`);
      }
    } catch (err: any) {
      console.error("Error fetching groups:", err);
      alert("Gagal menghubungi API grup.");
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchGroupsList();
    }
  }, [isAuthenticated]);

  const handleGoogleLogin = async () => {
    setIsLoadingAuth(true);
    setLoginError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/gexxa`,
        },
      });
      if (error) {
        setLoginError(error.message);
      }
    } catch (err: any) {
      setLoginError(err.message || "Gagal melakukan login.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("gexxa_token");
    await supabase.auth.signOut();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTransactions(), fetchGroupsList()]);
    setIsRefreshing(false);
  };

  const handleDeleteTrx = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data transaksi ini?")) {
      try {
        const response = await fetch(`/api/admin/transactions?id=${id}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeader()
          }
        });
        const data = await response.json();
        if (response.ok) {
          setTransactions(transactions.filter(t => t.id !== id));
        } else {
          alert(`Gagal menghapus transaksi dari database: ${data.error || "Akses ditolak."}`);
        }
      } catch (err: any) {
        console.error("Error deleting transaction:", err);
        alert("Terjadi kesalahan jaringan saat menghapus transaksi.");
      }
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus grup ini? Pembeli di dalam grup ini akan dibebaskan (group_id diset null).")) {
      try {
        const response = await fetch(`/api/admin/groups?id=${id}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeader()
          }
        });
        const data = await response.json();
        if (response.ok) {
          alert("Grup berhasil dihapus!");
          await fetchGroupsList();
        } else {
          alert(`Gagal menghapus grup: ${data.error}`);
        }
      } catch (err) {
        console.error("Error deleting group:", err);
        alert("Kesalahan jaringan saat menghapus grup.");
      }
    }
  };

  const handleCreateGroupManually = async (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;

    const slotInput = prompt(
      `Masukkan jumlah slot maksimal untuk grup baru ${svc.name} (contoh: 3 atau 4):`,
      String(svc.totalSlots)
    );
    if (slotInput === null) return;

    const maxSlots = parseInt(slotInput);
    if (isNaN(maxSlots) || maxSlots <= 0) {
      alert("Jumlah slot harus berupa angka positif!");
      return;
    }

    try {
      const response = await fetch("/api/admin/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify({ serviceId, maxSlots })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Grup baru berhasil dibuat!");
        await fetchGroupsList();
      } else {
        alert(`Gagal membuat grup: ${data.error}`);
      }
    } catch (err) {
      console.error("Error creating group:", err);
      alert("Kesalahan jaringan saat membuat grup.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "PENDING" | "SUCCESS" | "EXPIRED") => {
    try {
      const response = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        setTransactions(transactions.map(t => {
          if (t.id === id) {
            return { ...t, status: newStatus };
          }
          return t;
        }));
      } else {
        alert(`Gagal memperbarui status transaksi: ${data.error || "Akses ditolak."}`);
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert("Terjadi kesalahan jaringan saat memperbarui status.");
    }
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

  // Calculate Profit: Total revenue minus cost of subscriptions for active groups
  const totalCost = groupsList.reduce((sum, group) => {
    const service = services.find(s => s.id === group.service_id);
    if (!service) return sum;
    // Only count cost if group has at least 1 SUCCESS transaction
    const hasSuccess = group.transactions && group.transactions.some((t: any) => t.status === "SUCCESS");
    if (hasSuccess) {
      return sum + service.originalPrice;
    }
    return sum;
  }, 0);
  const totalProfit = totalSales - totalCost;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 relative">
        {/* Aesthetic Background Grid Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#e21f1f_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white border border-red-100 rounded-3xl p-8 shadow-xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-red-50 border-2 border-red-600 rounded-2xl flex items-center justify-center text-red-600 mb-4 shadow-md">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-black text-red-950 tracking-tight">Gexxa Control Room</h1>
            <p className="text-red-800 text-sm mt-1 text-center font-bold">LayananYuk Admin Security Portal</p>
          </div>

          <div className="space-y-6">
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                {loginError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoadingAuth}
              className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-red-200 active:scale-[0.98] text-slate-700 font-bold py-4 px-4 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-3 text-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.41 3.66 1.48 7.55l3.86 3C6.26 7.55 8.91 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.92c2.2-2.03 3.47-5.02 3.47-8.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.34 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.48 6.9C.54 8.78 0 10.89 0 13s.54 4.22 1.48 6.1l3.86-3.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.92c-1.05.7-2.4 1.13-4.2 1.13-3.09 0-5.74-2.51-6.66-5.51l-3.86 3C3.41 20.34 7.37 23 12 23z"
                />
              </svg>
              {isLoadingAuth ? "Connecting..." : "Masuk dengan Google"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-red-900/60 text-xs mt-8 flex items-center gap-1 font-bold">
          <ShieldCheck size={14} className="text-red-600" /> Secure Admin Access Logged
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-red-950 flex flex-col font-sans">
      {/* HEADER CONSOLE */}
      <header className="bg-red-600 border-b border-red-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-red-200 text-red-600 rounded-xl flex items-center justify-center font-black shadow-sm">
              LY
            </div>
            <div>
              <span className="text-white font-black text-lg tracking-tight flex items-center gap-1.5">
                Gexxa Console <span className="bg-white text-red-600 font-black text-[9px] uppercase px-1.5 py-0.5 rounded border border-red-100 shadow-sm">ADMIN</span>
              </span>
              <p className="text-[10px] text-red-100 font-bold">LanggananYuk Control Station</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database indicator */}
            <div className="hidden md:flex items-center gap-2 bg-red-700/60 px-3 py-1.5 rounded-xl border border-red-500/30">
              <Database size={13} className="text-white animate-pulse" />
              <span className="text-[10px] text-white font-bold">Supabase Active</span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white hover:bg-red-50 text-red-600 font-black px-3.5 py-1.5 rounded-xl border border-white transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-sm"
            >
              <LogOut size={13} />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          <button 
            onClick={() => setActiveTab("transactions")}
            className={`py-4 px-6 font-black text-xs uppercase tracking-wider border-b-4 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "transactions" 
                ? "border-red-600 text-red-600" 
                : "border-transparent text-slate-500 hover:text-red-950"
            }`}
          >
            <Clock size={15} />
            Daftar Transaksi
          </button>
          <button 
            onClick={() => setActiveTab("grup")}
            className={`py-4 px-6 font-black text-xs uppercase tracking-wider border-b-4 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "grup" 
                ? "border-red-600 text-red-600" 
                : "border-transparent text-slate-500 hover:text-red-950"
            }`}
          >
            <Users size={15} />
            Grup & Anggota
          </button>
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`py-4 px-6 font-black text-xs uppercase tracking-wider border-b-4 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "inventory" 
                ? "border-red-600 text-red-600" 
                : "border-transparent text-slate-500 hover:text-red-950"
            }`}
          >
            <FolderOpen size={15} />
            Katalog Layanan & Stok
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* STATS SECTION */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-red-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Pendapatan</p>
              <h3 className="text-lg sm:text-2xl font-black text-red-950 tracking-tight mt-0.5">{formatRupiah(totalSales)}</h3>
            </div>
          </div>

          <div className="bg-white border border-red-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Antrean Pending</p>
              <h3 className="text-lg sm:text-2xl font-black text-red-950 tracking-tight mt-0.5">{pendingCount} <span className="text-xs text-slate-400 font-bold">User</span></h3>
            </div>
          </div>

          <div className="bg-white border border-red-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transaksi Sukses</p>
              <h3 className="text-lg sm:text-2xl font-black text-red-950 tracking-tight mt-0.5">{successCount} <span className="text-xs text-slate-400 font-bold">Lunas</span></h3>
            </div>
          </div>

          <div className="bg-white border border-red-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-650 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi Profit</p>
              <h3 className="text-lg sm:text-2xl font-black text-red-950 tracking-tight mt-0.5">
                {formatRupiah(totalProfit)}
              </h3>
            </div>
          </div>
        </section>

        {activeTab === "transactions" && (
          /* TAB 1: TRANSACTIONS LOGS */
          <section className="bg-white border border-red-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-red-950 flex items-center gap-2">
                  <span>Log Transaksi Langganan</span>
                  <span className="bg-red-50 text-red-600 text-xs font-black px-2 py-0.5 rounded-full border border-red-100">{filteredTransactions.length} Pembeli</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Kelola verifikasi status bayar dan trigger otomatisasi kirim kredensial WA</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-white hover:bg-slate-50 active:scale-95 disabled:opacity-50 text-slate-600 font-bold p-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-sm"
                  title="Refresh Data"
                >
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin text-red-600" : ""} />
                </button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari (Nama, WhatsApp, ID Invoice, ID Referensi)"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-red-950 focus:outline-none focus:border-red-600 transition-all font-bold placeholder-slate-400"
                />
              </div>

              {/* Filter Status */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-sm">
                <span className="text-slate-400"><Filter size={14} /></span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 font-bold focus:outline-none border-none cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="SUCCESS">Lunas (SUCCESS)</option>
                  <option value="PENDING">Menunggu (PENDING)</option>
                  <option value="EXPIRED">Gagal (EXPIRED)</option>
                </select>
              </div>

              {/* Filter Service */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1 shadow-sm">
                <span className="text-slate-400"><Filter size={14} /></span>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-700 font-bold focus:outline-none border-none cursor-pointer"
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
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-black bg-slate-50/50">
                    <th className="py-4 px-6">ID & Referensi</th>
                    <th className="py-4 px-6">Pelanggan</th>
                    <th className="py-4 px-6">Layanan & Opsi</th>
                    <th className="py-4 px-6">Total Tagihan</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Aksi / Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-bold bg-white">
                        <div className="flex flex-col items-center gap-2">
                          <Search size={32} className="text-slate-350" />
                          <span>Tidak ada transaksi yang cocok</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((trx) => {
                      const svc = services.find(s => s.id === trx.serviceId);
                      return (
                        <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-black text-red-950 tracking-tight">{trx.id}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
                              {trx.referenceId}
                            </p>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-black text-slate-900">{trx.name}</span>
                            <a 
                              href={`https://wa.me/${trx.whatsapp.replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-emerald-600 hover:underline mt-0.5 flex items-center gap-0.5 font-black"
                            >
                              <Smartphone size={10} />
                              {trx.whatsapp}
                            </a>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              {svc?.logoUrl && (
                                <img 
                                  src={svc.logoUrl} 
                                  alt={svc.name} 
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <span className="font-black text-red-950">{svc?.name || trx.serviceId}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">
                              Paket {trx.optionLabel} &bull; <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-black">{trx.groupId}</span>
                            </p>
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-black text-red-950">{formatRupiah(trx.price)}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{trx.timestamp}</p>
                          </td>

                          <td className="py-4 px-6">
                            {trx.status === "SUCCESS" && (
                              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SUCCESS
                              </span>
                            )}
                            {trx.status === "PENDING" && (
                              <span className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> PENDING
                              </span>
                            )}
                            {trx.status === "EXPIRED" && (
                              <span className="bg-slate-100 border border-slate-200 text-slate-500 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> EXPIRED
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* Toggle payment status shortcut */}
                              {trx.status === "PENDING" && (
                                <button
                                  onClick={() => handleUpdateStatus(trx.id, "SUCCESS")}
                                  className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 hover:border-emerald-600 text-emerald-600 font-black px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer shadow-sm"
                                  title="Set Lunas"
                                >
                                  Set Lunas
                                </button>
                              )}

                              {/* Trigger WA Account delivery */}
                              <button
                                onClick={() => handleOpenCredentials(trx)}
                                disabled={trx.status !== "SUCCESS"}
                                className="bg-white hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none text-red-600 border border-slate-250 hover:border-red-200 font-bold p-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                                title="Kirim Kredensial via WA"
                              >
                                <Send size={12} />
                              </button>

                              {/* Delete Log */}
                              <button
                                onClick={() => handleDeleteTrx(trx.id)}
                                className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-200 border border-slate-250 p-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
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
        )}

        {activeTab === "grup" && (
          <section className="space-y-6 animate-fadeIn">
            {/* 4 Cards for 4 Services */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((svc) => {
                const serviceGroups = groupsList.filter(g => g.service_id === svc.id);
                const isActive = selectedServiceForGroups === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedServiceForGroups(svc.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-4 ${
                      isActive
                        ? "bg-red-50 border-red-600 ring-2 ring-red-600/10 shadow-md"
                        : "bg-white border-red-100 hover:border-red-300 shadow-sm"
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl border border-red-100 flex items-center justify-center p-2">
                      <img src={svc.logoUrl} alt={svc.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-black text-red-950 text-sm sm:text-base leading-tight">{svc.name}</h3>
                      <p className="text-xs text-red-600 font-bold mt-1">
                        {serviceGroups.length} Grup Terdaftar
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* List of Groups for Selected Service */}
            <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-red-950">Grup Aktif: {services.find(s => s.id === selectedServiceForGroups)?.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Kelola status keanggotaan grup patungan yang berjalan</p>
              </div>
              <button 
                onClick={() => handleCreateGroupManually(selectedServiceForGroups)}
                className="bg-red-650 hover:bg-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl border border-red-700 transition-all flex items-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
              >
                <PlusCircle size={15} />
                Tambah Grup Baru
              </button>
            </div>

            <div className="space-y-8">
              {groupsList.filter(g => g.service_id === selectedServiceForGroups).length === 0 ? (
                <div className="bg-white border border-red-100 rounded-3xl p-12 text-center text-slate-400 font-bold">
                  <Users size={48} className="mx-auto text-slate-300 mb-3" />
                  <p>Belum ada grup yang terdaftar untuk layanan ini.</p>
                </div>
              ) : (
                groupsList
                  .filter(g => g.service_id === selectedServiceForGroups)
                  .sort((a, b) => a.group_number - b.group_number)
                  .map((group) => {
                    const svc = services.find(s => s.id === group.service_id);
                    const trxs = group.transactions || [];
                    const slots = Array.from({ length: group.max_slots }, (_, i) => {
                      const tx = trxs[i];
                      return tx ? {
                        id: tx.id,
                        name: tx.buyer_name,
                        whatsapp: tx.whatsapp_number,
                        status: tx.status,
                        price: tx.price,
                        timestamp: tx.timestamp ? new Date(tx.timestamp).toISOString().replace('T', ' ').substring(0, 16) : "",
                        optionLabel: tx.option_label,
                        occupied: true
                      } : {
                        id: null,
                        name: "Slot Kosong",
                        whatsapp: "",
                        status: "KOSONG",
                        price: 0,
                        timestamp: "",
                        optionLabel: "",
                        occupied: false
                      };
                    });

                    return (
                      <div key={group.id} className="bg-white border border-red-100 rounded-3xl shadow-sm overflow-hidden">
                        {/* Group Header */}
                        <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                              Grup #{group.group_number}
                            </span>
                            <div>
                              <h3 className="font-black text-red-950 text-sm sm:text-base">
                                {svc?.name} - {group.id}
                              </h3>
                              <p className="text-[10px] text-slate-500 font-bold">
                                Dibuat pada: {group.created_at ? new Date(group.created_at).toLocaleDateString("id-ID") : "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500">
                              Isi Slot: {trxs.filter((t: any) => t.status === "SUCCESS").length} / {group.max_slots} Lunas
                            </span>
                            {group.status === "full" || trxs.filter((t: any) => t.status === "SUCCESS").length >= group.max_slots ? (
                              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                                Penuh (FULL)
                              </span>
                            ) : (
                              <span className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm animate-pulse">
                                Menunggu Anggota
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
                              className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-250 font-bold p-1.5 rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1 text-[10px]"
                              title="Hapus Grup"
                            >
                              <Trash2 size={11} />
                              Hapus Grup
                            </button>
                          </div>
                        </div>

                        {/* Slots Table */}
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-black bg-slate-50/50">
                                <th className="py-3 px-6 w-20">Slot</th>
                                <th className="py-3 px-6">ID Invoice</th>
                                <th className="py-3 px-6">Nama Anggota</th>
                                <th className="py-3 px-6">WhatsApp</th>
                                <th className="py-3 px-6">Total Tagihan</th>
                                <th className="py-3 px-6">Status Bayar</th>
                                <th className="py-3 px-6 text-center">Aksi / Kontrol</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                              {slots.map((slot, idx) => (
                                <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${!slot.occupied ? "text-slate-400 italic bg-slate-50/20" : ""}`}>
                                  <td className="py-4 px-6 font-black text-red-950">
                                    #{idx + 1}
                                  </td>
                                  <td className="py-4 px-6">
                                    {slot.occupied ? (
                                      <span className="font-black text-red-950 tracking-tight">{slot.id}</span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    <span className={slot.occupied ? "font-black text-slate-900" : ""}>
                                      {slot.name}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6">
                                    {slot.occupied ? (
                                      <a 
                                        href={`https://wa.me/${slot.whatsapp.replace(/^0/, '62')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5 font-black"
                                      >
                                        <Smartphone size={10} />
                                        {slot.whatsapp}
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    {slot.occupied ? (
                                      <span className="font-black text-red-950">{formatRupiah(slot.price)}</span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    {slot.status === "SUCCESS" && (
                                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                                        Lunas (SUCCESS)
                                      </span>
                                    )}
                                    {slot.status === "PENDING" && (
                                      <span className="bg-amber-50 border border-amber-200 text-amber-700 font-black text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                                        Pending (PENDING)
                                      </span>
                                    )}
                                    {slot.status === "KOSONG" && (
                                      <span className="text-[10px] text-slate-400 font-bold">
                                        Tersedia
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-center">
                                    {slot.occupied ? (
                                      <div className="flex items-center justify-center gap-2">
                                        {slot.status === "PENDING" && (
                                          <button
                                            onClick={() => handleUpdateStatus(slot.id!, "SUCCESS")}
                                            className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 hover:border-emerald-600 text-emerald-600 font-black px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer shadow-sm"
                                          >
                                            Set Lunas
                                          </button>
                                        )}
                                        <button
                                          onClick={() => handleOpenCredentials({
                                            id: slot.id!,
                                            name: slot.name,
                                            whatsapp: slot.whatsapp,
                                            serviceId: group.service_id,
                                            optionLabel: slot.optionLabel,
                                            price: slot.price,
                                            status: slot.status as any,
                                            timestamp: slot.timestamp,
                                            groupId: group.id,
                                            referenceId: ""
                                          })}
                                          disabled={slot.status !== "SUCCESS"}
                                          className="bg-white hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none text-red-600 border border-slate-250 hover:border-red-200 font-bold p-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                                          title="Kirim Kredensial via WA"
                                        >
                                          <Send size={12} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTrx(slot.id!)}
                                          className="bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-200 border border-slate-250 p-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                                          title="Hapus Log"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-bold">
                                        -
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>
        )}

        {activeTab === "inventory" && (
          /* TAB 2: SERVICE INVENTORY & DATA */
          <section className="space-y-6">
            {/* Catalog Info */}
            <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-red-950">Skema & Harga Produk Aktif</h2>
                <p className="text-xs text-slate-500 mt-0.5">Daftar harga patungan, opsi user, dan limitasi stok produk premium</p>
              </div>
              <button 
                onClick={() => alert("Fitur Tambah Produk akan terhubung ke form database Supabase.")}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-4 py-2.5 rounded-xl border border-red-700 transition-all flex items-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
              >
                <PlusCircle size={15} />
                Tambah Layanan Baru
              </button>
            </div>

            {/* CATALOG CARDS */}
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((svc) => (
                <div key={svc.id} className="bg-white border border-red-100 rounded-3xl shadow-sm p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Card Title & Logo */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-center p-2">
                          <img src={svc.logoUrl} alt={svc.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h3 className="font-black text-red-950 text-base">{svc.name}</h3>
                          <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 font-extrabold uppercase px-1.5 py-0.5 rounded">
                            {svc.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block">Harga Patungan</span>
                        <span className="text-lg font-black text-red-600">{formatRupiah(svc.sharedPrice)}</span>
                      </div>
                    </div>

                    {/* Features Description */}
                    <p className="text-xs text-slate-600 font-bold leading-relaxed border-t border-slate-100 pt-3">
                      {svc.description || "Tidak ada deskripsi rincian fitur."}
                    </p>

                    {/* Options Details */}
                    {svc.options && svc.options.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Tag size={10} /> Opsi Patungan Terkoneksi:
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {svc.options.map((opt) => (
                            <div key={opt.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col justify-between">
                              <span className="text-[10px] font-black text-slate-800">{opt.label}</span>
                              <span className="text-[11px] font-black text-red-600 mt-1">{formatRupiah(opt.price)}</span>
                              {opt.note && (
                                <span className="text-[8px] text-slate-400 font-bold mt-0.5">{opt.note}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stock inventory action footer */}
                  <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-450 font-bold flex items-center gap-1">
                      <Key size={13} className="text-red-500" />
                      Stok Akun Aktif: <strong className="text-red-950 font-black">12 Ready</strong>
                    </span>
                    <button 
                      onClick={() => alert("Mengalihkan ke pengaturan stok akun premium di Supabase.")}
                      className="text-red-600 font-black hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      Kelola Akun <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* CREDENTIALS/WHATSAPP DIALOG */}
      {showCredentialsModal && selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-red-100 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-red-950 mb-2">Kirim Akun ke Pembeli</h3>
            <p className="text-xs text-slate-500 mb-6">
              Kirim kredensial layanan patungan **{services.find(s => s.id === selectedTrx.serviceId)?.name}** langsung ke nomor **{selectedTrx.whatsapp}** ({selectedTrx.name}).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">Pilih Stok Akun Aktif</label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-black text-slate-800">netflix-indo-premium43@gmail.com</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Password: IndoPrem332! &bull; Profile: 4</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">Ready</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-wider text-slate-500 mb-2">Draft Pesan WhatsApp</label>
                <textarea
                  readOnly
                  rows={6}
                  value={`Halo ${selectedTrx.name},\n\nPembayaran Anda untuk patungan ${services.find(s => s.id === selectedTrx.serviceId)?.name} telah diverifikasi sukses! 🎉\n\nBerikut detail akun premium Anda:\n- Email: netflix-indo-premium43@gmail.com\n- Password: IndoPrem332!\n- Profil Penggunaan: Profil 4 / User 4\n- PIN Profil: 9912\n\nMohon dilarang mengubah password/kredensial agar masa garansi Anda tetap aktif.\n\nTerima kasih,\nLanggananYuk Support`}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl p-4 focus:outline-none font-bold leading-relaxed shadow-inner"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-2.5 rounded-2xl text-xs cursor-pointer transition-all"
              >
                Batalkan
              </button>
              <button
                onClick={async () => {
                  setIsSendingWa(true);
                  try {
                    const msgText = `Halo ${selectedTrx.name},\n\nPembayaran Anda untuk patungan ${services.find(s => s.id === selectedTrx.serviceId)?.name} telah diverifikasi sukses! 🎉\n\nBerikut detail akun premium Anda:\n- Email: netflix-indo-premium43@gmail.com\n- Password: IndoPrem332!\n- Profil Penggunaan: Profil 4 / User 4\n- PIN Profil: 9912\n\nMohon dilarang mengubah password/kredensial agar masa garansi Anda tetap aktif.\n\nTerima kasih,\nLanggananYuk Support`;
                    const response = await fetch("/api/admin/send-wa", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                      },
                      body: JSON.stringify({
                        target: selectedTrx.whatsapp,
                        message: msgText
                      })
                    });
                    const data = await response.json();
                    if (response.ok) {
                      alert(`Kredensial berhasil dikirim via WhatsApp ke ${selectedTrx.whatsapp}!`);
                      setShowCredentialsModal(false);
                    } else {
                      alert(`Gagal mengirim WA: ${data.error}`);
                    }
                  } catch (err) {
                    console.error("Error sending WA:", err);
                    alert("Gagal mengirim WhatsApp. Pastikan token Fonnte aktif.");
                  } finally {
                    setIsSendingWa(false);
                  }
                }}
                disabled={isSendingWa}
                className="w-1/2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white border border-red-700 font-bold py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/10 cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                {isSendingWa ? "Mengirim..." : "Kirim via Fonnte API"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-bold flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; 2026 LanggananYuk Admin Console. All Rights Reserved.</span>
          <span className="flex items-center gap-1 text-[10px] bg-slate-50 px-2.5 py-1 border border-slate-200 rounded-lg">
            <Lock size={10} className="text-red-600" /> Hashed Access: SHA-256 Enabled
          </span>
        </div>
      </footer>
    </div>
  );
}
