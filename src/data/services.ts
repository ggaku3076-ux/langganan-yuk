export interface ServiceOption {
  id: string;
  label: string;
  price: number;
  slots: number;
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
    originalPrice: 350000,
    sharedPrice: 70000,
    totalSlots: 5,
    filledSlots: 4,
    description: "Akses prioritas ke Claude 3.5 Sonnet & Claude 3 Opus, batas penggunaan 5x lebih tinggi, dan fitur Projects/Artifacts untuk menulis kode & menganalisis data."
  },
  {
    id: "gpt5",
    name: "ChatGPT Plus",
    category: "AI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    originalPrice: 350000,
    sharedPrice: 87500,
    totalSlots: 4,
    filledSlots: 1,
    description: "Akses ke GPT-4o, GPT-4, serta alat bantu DALL-E untuk membuat gambar, analisis data, browsing web, voice mode tingkat lanjut, dan custom GPTs."
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
