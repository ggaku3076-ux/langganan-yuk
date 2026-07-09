import LacakClient from "./LacakClient";

export const metadata = {
  title: "Lacak Pembelian - LanggananYuk",
  description: "Lacak status transaksi pembayaran patungan akun premium Netflix, Spotify, Canva Pro, Claude Pro, dll.",
};

export default function LacakPage() {
  return <LacakClient />;
}
