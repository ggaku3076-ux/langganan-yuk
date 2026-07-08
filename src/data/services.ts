export interface ServiceOption {
  id: string;
  label: string;
  price: number;
  slots: number;
  note?: string;
  isDefault?: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  originalPrice: number;
  sharedPrice: number;
  totalSlots: number;
  filledSlots: number;
  description?: string;
  options?: ServiceOption[];
}

export const services: Service[] = [
  {
    id: "netflix",
    name: "Netflix Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    originalPrice: 186000,
    sharedPrice: 50000,
    totalSlots: 4,
    filledSlots: 3,
    description: "Kualitas streaming tertinggi Ultra HD (4K) dan HDR, dukungan Audio Spasial Netflix (Dolby Atmos), serta menonton hingga di 4 perangkat secara bersamaan tanpa iklan.",
    options: [
      { id: "2-user", label: "2 User", price: 96500, slots: 2 },
      { id: "4-user", label: "4 User", price: 50000, slots: 4, isDefault: true },
      { id: "5-user", label: "5 User", price: 40000, slots: 5 }
    ]
  },
  {
    id: "youtube",
    name: "YouTube Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    originalPrice: 99000,
    sharedPrice: 20000,
    totalSlots: 5,
    filledSlots: 2,
    description: "Nikmati jutaan video dan musik tanpa gangguan iklan, bisa diputar di latar belakang (background play), serta simpan video untuk ditonton offline.",
    options: [
      { id: "family-slot", label: "1 Bulan", price: 20000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "claude",
    name: "Claude Pro",
    category: "AI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Claude_AI_logo.svg", 
    originalPrice: 360000,
    sharedPrice: 100000,
    totalSlots: 4,
    filledSlots: 3,
    description: "Menawarkan batas penggunaan 5x lebih banyak dibandingkan versi gratis. Paket ini memberikan akses prioritas ke model Claude 3.5 Sonnet terbaru.",
    options: [
      { id: "2-user", label: "2 User", price: 200000, slots: 2, note: "10 - 20 Prompt" },
      { id: "3-user", label: "3 User", price: 130000, slots: 3, note: "5 - 15 Prompt" },
      { id: "4-user", label: "4 User", price: 100000, slots: 4, note: "1 - 10 Prompt", isDefault: true }
    ]
  },
  {
    id: "gpt5",
    name: "ChatGPT Plus",
    category: "AI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    originalPrice: 360000,
    sharedPrice: 100000,
    totalSlots: 4,
    filledSlots: 1,
    description: "Akses GPT-5 Reasoning model terbaru, Web browsing, code interpreter & data analysis, Image Generate DALL-E & Video Generate Sora AI.",
    options: [
      { id: "2-user", label: "2 User", price: 200000, slots: 2 },
      { id: "3-user", label: "3 User", price: 130000, slots: 3 },
      { id: "4-user", label: "4 User", price: 100000, slots: 4, isDefault: true }
    ]
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    originalPrice: 120000,
    sharedPrice: 50000,
    totalSlots: 3,
    filledSlots: 2,
    description: "Akses musik bebas iklan, bebas lewati lagu tanpa batas, kualitas audio tertinggi, serta simpan lagu offline secara gratis.",
    options: [
      { id: "3-user", label: "3 User", price: 18000, slots: 3, isDefault: true }
    ]
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "Design",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_logo.svg",
    originalPrice: 124000,
    sharedPrice: 15000,
    totalSlots: 5,
    filledSlots: 4,
    description: "Akses jutaan template premium, foto stock, font kustom, serta tool hapus latar belakang otomatis untuk kebutuhan desain grafis instan.",
    options: [
      { id: "team-slot", label: "1 Bulan", price: 15000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "disney",
    name: "Disney+ Hotstar",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    originalPrice: 119000,
    sharedPrice: 35000,
    totalSlots: 3,
    filledSlots: 1,
    description: "Streaming film-film box office Hollywood, Marvel, Disney, Pixar, Star Wars, serta konten eksklusif lokal berkualitas tertinggi Full HD.",
    options: [
      { id: "shared-slot", label: "Premium Slot", price: 35000, slots: 3, isDefault: true }
    ]
  },
  {
    id: "prime",
    name: "Prime Video",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
    originalPrice: 59000,
    sharedPrice: 20000,
    totalSlots: 3,
    filledSlots: 1,
    description: "Streaming Amazon Originals populer seperti The Boys, Lord of the Rings, Reacher, serta ribuan film hollywood dengan subtitle Indonesia.",
    options: [
      { id: "shared-slot", label: "1 Bulan", price: 20000, slots: 3, isDefault: true }
    ]
  },
  {
    id: "m365",
    name: "Microsoft 365",
    category: "Productivity",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_logotype_%282019%E2%80%93present%29.svg",
    originalPrice: 129000,
    sharedPrice: 35000,
    totalSlots: 5,
    filledSlots: 2,
    description: "Akses premium aplikasi Word, Excel, PowerPoint, Outlook, serta penyimpanan cloud OneDrive sebesar 1 TB (1000 GB) per pengguna.",
    options: [
      { id: "family-member", label: "1 Bulan", price: 35000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "midjourney",
    name: "Midjourney AI",
    category: "Design",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Midjourney_Emblem.svg",
    originalPrice: 480000,
    sharedPrice: 120000,
    totalSlots: 4,
    filledSlots: 1,
    description: "Model generator gambar berbasis AI terpopuler dengan detail tinggi. Paket ini memberikan akses cepat pembuatan gambar kualitas super.",
    options: [
      { id: "shared-fast", label: "Basic Shared", price: 120000, slots: 4, isDefault: true }
    ]
  },
  {
    id: "duolingo",
    name: "Duolingo Super",
    category: "Education",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Duolingo_Logo.svg",
    originalPrice: 149000,
    sharedPrice: 30000,
    totalSlots: 5,
    filledSlots: 3,
    description: "Belajar bahasa asing tanpa batas nyawa (Unlimited Hearts), bebas iklan, review kesalahan, serta kuis perkembangan bulanan gratis.",
    options: [
      { id: "family-slot", label: "1 Bulan", price: 30000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "notion",
    name: "Notion Plus",
    category: "Productivity",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg",
    originalPrice: 160000,
    sharedPrice: 40000,
    totalSlots: 5,
    filledSlots: 1,
    description: "Workspace kolaborasi serbaguna tanpa batas file upload, riwayat revisi dokumen 30 hari, serta Notion AI pembantu penulisan draft.",
    options: [
      { id: "member-slot", label: "1 Bulan", price: 40000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "grammarly",
    name: "Grammarly Premium",
    category: "Productivity",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Grammarly_logo.svg",
    originalPrice: 450000,
    sharedPrice: 90000,
    totalSlots: 5,
    filledSlots: 2,
    description: "Koreksi struktur tulisan bahasa Inggris tingkat lanjut, pengubah nada kalimat, deteksi plagiarisme, serta rekomendasi kosakata.",
    options: [
      { id: "shared-slot", label: "1 Bulan", price: 90000, slots: 5, isDefault: true }
    ]
  },
  {
    id: "hbogo",
    name: "HBO GO Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/HBO_Go_logo.svg",
    originalPrice: 79000,
    sharedPrice: 25000,
    totalSlots: 3,
    filledSlots: 1,
    description: "Streaming film blockbusters terbaik, serial original HBO peraih penghargaan (Game of Thrones, House of the Dragon), serta Warner Bros.",
    options: [
      { id: "shared-slot", label: "1 Bulan", price: 25000, slots: 3, isDefault: true }
    ]
  },
  {
    id: "appletv",
    name: "Apple TV+ Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
    originalPrice: 99000,
    sharedPrice: 30000,
    totalSlots: 3,
    filledSlots: 1,
    description: "Streaming konten eksklusif Apple Originals pemenang penghargaan (Ted Lasso, Severance, Morning Show) kualitas 4K HDR Atmos.",
    options: [
      { id: "shared-slot", label: "1 Bulan", price: 30000, slots: 3, isDefault: true }
    ]
  }
];

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};
