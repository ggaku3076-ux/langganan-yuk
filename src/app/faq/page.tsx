export default function FaqPage() {
  const faqs = [
    {
      q: "Bagaimana sistem patungannya bekerja?",
      a: "Anda cukup membayar sesuai harga patungan. Sistem akan mengumpulkan Anda dengan pembeli lain. Jika kuota (misal: 4 orang) terpenuhi, akun akan otomatis dikirim via WhatsApp."
    },
    {
      q: "Berapa lama saya harus menunggu?",
      a: "Rata-rata 10-30 menit. Jika dalam 24 jam kuota grup tidak terpenuhi, kami akan melakukan proses Refund otomatis 100% ke metode pembayaran Anda."
    },
    {
      q: "Apakah aman dari pergantian password?",
      a: "Ya! Jika ada member yang nakal mengubah password, Anda bisa langsung lapor ke CS via WhatsApp. Member tersebut akan kami banned permanen, dan kami akan mereset password secepatnya."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 w-full flex-1">
      <h1 className="text-3xl md:text-4xl font-bold text-red-950 mb-10 text-center tracking-tight">Frequently Asked Questions (FAQ)</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
            <h3 className="text-lg font-bold text-red-600 mb-2">{faq.q}</h3>
            <p className="text-red-900 font-semibold leading-relaxed text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
