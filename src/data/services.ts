export const services = [
  {
    id: "netflix",
    name: "Netflix Premium",
    category: "Entertainment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    originalPrice: 186000,
    sharedPrice: 46500,
    totalSlots: 4,
    filledSlots: 2,
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
  }
];

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};
