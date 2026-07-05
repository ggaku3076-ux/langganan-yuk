import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full flex-1">
      <h1 className="text-3xl md:text-4xl font-bold text-red-950 mb-3 text-center tracking-tight">Hubungi Kami</h1>
      <p className="text-red-800 font-semibold text-center mb-12 text-sm md:text-base">Ada pertanyaan atau kendala? Tim Support kami siap membantu Anda 24/7.</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-red-100 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Phone size={22} />
          </div>
          <h3 className="font-bold text-lg mb-1 text-red-950">WhatsApp CS</h3>
          <p className="text-red-800 font-semibold text-sm">+62 812-3456-789</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-red-100 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Mail size={22} />
          </div>
          <h3 className="font-bold text-lg mb-1 text-red-950">Email</h3>
          <p className="text-red-800 font-semibold text-sm">support@langgananyuk.com</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-red-100 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <MapPin size={22} />
          </div>
          <h3 className="font-bold text-lg mb-1 text-red-950">Kantor</h3>
          <p className="text-red-800 font-semibold text-sm">Jakarta Selatan, Indonesia</p>
        </div>
      </div>
    </div>
  );
}
