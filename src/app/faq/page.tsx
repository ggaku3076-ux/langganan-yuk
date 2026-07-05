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
      <h1 className="text-4xl font-black text-red-950 mb-10 text-center">Frequently Asked Questions (FAQ)</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border-2 border-red-100">
            <h3 className="text-xl font-black text-red-600 mb-3">{faq.q}</h3>
            <p className="text-red-900 font-bold leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
