import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg">
                🏠
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  Apna<span className="text-cyan-400">Makan</span>
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Gwalior&apos;s trusted real estate platform. Buy and sell properties with real photos and direct seller contact.
            </p>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                📱
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                ✉️
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors flex items-center gap-2">→ Home</Link></li>
              <li><Link href="/properties" className="hover:text-cyan-400 transition-colors flex items-center gap-2">→ All Properties</Link></li>
              <li><Link href="/register" className="hover:text-cyan-400 transition-colors flex items-center gap-2">→ Sell Property</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-2">→ About Us</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors flex items-center gap-2">→ Contact</Link></li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Locations</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/properties?location=DD%20Nagar" className="hover:text-cyan-400 transition-colors">DD Nagar</Link></li>
              <li><Link href="/properties?location=City%20Centre" className="hover:text-cyan-400 transition-colors">City Centre</Link></li>
              <li><Link href="/properties?location=Lashkar" className="hover:text-cyan-400 transition-colors">Lashkar</Link></li>
              <li><Link href="/properties?location=Thatipur" className="hover:text-cyan-400 transition-colors">Thatipur</Link></li>
              <li><Link href="/properties?location=Morar" className="hover:text-cyan-400 transition-colors">Morar</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span>City Centre, Gwalior<br />Madhya Pradesh 474011</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✉️</span>
                <span>info@apnamakan.in</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Apna Makan. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Made with <span className="text-red-500">❤️</span> for B.Tech PBL Project
          </p>
        </div>
      </div>
    </footer>
  );
}
