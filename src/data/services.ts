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
    description: "Kualitas streaming tertinggi Ultra HD (4K) dan HDR, dukungan Audio Spasial Netflix (Dolby Atmos), serta kemampuan untuk menonton hingga di 4 perangkat secara bersamaan dan mengunduh konten ke 6 perangkat tanpa ada gangguan iklan.",
    options: [
      { id: "2-user", label: "2 User", price: 96500, slots: 2 },
      { id: "4-user", label: "4 User", price: 50000, slots: 4, isDefault: true },
      { id: "5-user", label: "5 User", price: 40000, slots: 5 }
    ]
  },
  {
    id: "claude",
    name: "Claude Pro",
    category: "AI",
    logoUrl: "/claude-logo.svg", 
    originalPrice: 360000,
    sharedPrice: 100000,
    totalSlots: 4,
    filledSlots: 3,
    description: "Menawarkan batas penggunaan 5x lebih banyak dibandingkan versi gratis. Paket ini memberikan akses prioritas ke model terbaru, memungkinkan unggahan file atau dokumen hingga 200.000 token (setara ratusan halaman).",
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
    description: "Akses GPT-5.2 Thinking reasoning model terbaru, Web browsing, code interpreter & data analysis, Image Generate DALL-E & Video Generate Sora AI, Custom GPTs, plugins & memory (Up to 100 messages/3 jam).",
    options: [
      { id: "2-user", label: "2 User", price: 200000, slots: 2 },
      { id: "3-user", label: "3 User", price: 130000, slots: 3 },
      { id: "4-user", label: "4 User", price: 100000, slots: 4, isDefault: true },
      { id: "6-user", label: "6 User", price: 70000, slots: 6 }
    ]
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
    originalPrice: 54900,
    sharedPrice: 13725,
    totalSlots: 6,
    filledSlots: 5,
    description: "Streaming musik bebas iklan dengan kualitas suara 320kbps, download lagu untuk didengarkan offline, dan fitur Group Session untuk mendengarkan bersama teman."
  }
];

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};
