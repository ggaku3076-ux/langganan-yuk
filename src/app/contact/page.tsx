import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full flex-1">
      <h1 className="text-4xl font-black text-red-950 mb-4 text-center">Hubungi Kami</h1>
      <p className="text-red-800 font-bold text-center mb-12">Ada pertanyaan atau kendala? Tim Support kami siap membantu Anda 24/7.</p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border-2 border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone size={28} />
          </div>
          <h3 className="font-black text-xl mb-2 text-red-950">WhatsApp CS</h3>
          <p className="text-red-800 font-bold">+62 812-3456-789</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border-2 border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={28} />
          </div>
          <h3 className="font-black text-xl mb-2 text-red-950">Email</h3>
          <p className="text-red-800 font-bold">support@langgananyuk.com</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={28} />
          </div>
          <h3 className="font-black text-xl mb-2 text-red-950">Kantor</h3>
          <p className="text-red-800 font-bold">Jakarta Selatan, Indonesia</p>
        </div>
      </div>
    </div>
  );
}
