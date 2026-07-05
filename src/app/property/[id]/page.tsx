"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  address: string;
  price: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  furnished: string;
  amenities: string;
  builderName: string;
  imageUrls: string;
  createdAt: string;
  sellerId: number;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Crore`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakhs`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("apnaMakanUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        checkWishlist(u.id);
      } catch { /* ignore */ }
    }

    async function load() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (data.property) setProperty(data.property);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [id]);

  const checkWishlist = async (userId: number) => {
    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await res.json();
      const ids = (data.wishlist || []).map((w: { id: number }) => w.id);
      setIsWishlisted(ids.includes(parseInt(id)));
    } catch { /* ignore */ }
  };

  const toggleWishlist = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (isWishlisted) {
      await fetch(`/api/wishlist?userId=${user.id}&propertyId=${id}`, { method: "DELETE" });
      setIsWishlisted(false);
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, propertyId: parseInt(id) }),
      });
      setIsWishlisted(true);
    }
  };

  const sendMessage = async () => {
    if (!user || !property || !message.trim()) return;
    if (user.id === property.sellerId) {
      alert("You cannot message yourself!");
      return;
    }
    
    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: property.sellerId,
          propertyId: property.id,
          message: message.trim(),
        }),
      });
      setMessageSent(true);
      setMessage("");
    } catch { /* ignore */ }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-96 bg-gray-200 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl font-bold mb-3">Property Not Found</h2>
        <Link href="/properties" className="btn-primary px-6 py-3 rounded-xl font-medium inline-block">
          Browse Properties
        </Link>
      </div>
    );
  }

  let images: string[] = [];
  try { images = JSON.parse(property.imageUrls); } catch { images = []; }

  const amenitiesList = property.amenities
    ? property.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-light mb-4">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-primary">Properties</Link>
        <span>/</span>
        <span className="text-text font-medium truncate max-w-[200px]">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-2xl overflow-hidden border border-border mb-6 shadow-sm">
            <div className="relative h-72 sm:h-[400px]">
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="img-placeholder w-full h-full flex flex-col items-center justify-center">
                  <span className="text-6xl mb-3">🏠</span>
                  <span>No Images</span>
                </div>
              )}
              
              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg text-xl ${
                  isWishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"
                }`}
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>

              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                  {property.propertyType}
                </span>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text mb-1">{property.title}</h1>
                <p className="text-text-light flex items-center gap-1">
                  <span>📍</span> {property.address}, {property.location}, Gwalior
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">{formatPrice(property.price)}</p>
                <p className="text-xs text-text-light">
                  ₹{Math.round(parseFloat(property.price) / property.area).toLocaleString("en-IN")} / sq.ft
                </p>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: "📐", label: "Area", value: `${property.area} sq.ft` },
                { icon: "🛏️", label: "Bedrooms", value: property.bedrooms },
                { icon: "🚿", label: "Bathrooms", value: property.bathrooms },
                { icon: "🚗", label: "Parking", value: property.parking },
              ].map((item) => (
                <div key={item.label} className="bg-primary-light rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="font-bold text-text">{item.value}</p>
                  <p className="text-xs text-text-light">{item.label}</p>
                </div>
              ))}
            </div>

            {/* More Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-light">Furnished</span>
                <span className="font-medium text-text">{property.furnished}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-text-light">Type</span>
                <span className="font-medium text-text">{property.propertyType}</span>
              </div>
              {property.builderName && (
                <div className="flex justify-between py-2 border-b border-border col-span-2">
                  <span className="text-text-light">Builder</span>
                  <span className="font-medium text-text">{property.builderName}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-border col-span-2">
                <span className="text-text-light">Listed on</span>
                <span className="font-medium text-text">
                  {new Date(property.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-text mb-3 text-lg">Description</h3>
              <p className="text-text-light leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div>
                <h3 className="font-bold text-text mb-3 text-lg">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((a, i) => (
                    <span key={i} className="bg-success-light text-success text-sm px-3 py-1.5 rounded-full font-medium">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-20">
            {/* Seller Info */}
            <h3 className="font-bold text-text mb-4 text-lg">Contact Seller</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {property.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-text text-lg">{property.sellerName}</p>
                <p className="text-sm text-text-light">Property Owner</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3 mb-6">
              <a
                href={`tel:${property.sellerPhone}`}
                className="flex items-center justify-center gap-3 w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                <span className="text-xl">📞</span>
                {property.sellerPhone}
              </a>
              <a
                href={`mailto:${property.sellerEmail}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-text rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <span>✉️</span>
                {property.sellerEmail}
              </a>
            </div>

            {/* Message Section */}
            <div id="message" className="pt-4 border-t border-border">
              <h4 className="font-bold text-text mb-3">💬 Send Message</h4>
              
              {!user ? (
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-text-light text-sm mb-3">Login to send messages</p>
                  <Link href="/login" className="btn-primary px-4 py-2 rounded-lg text-sm inline-block">
                    Login
                  </Link>
                </div>
              ) : user.id === property.sellerId ? (
                <div className="bg-gray-50 p-4 rounded-xl text-center text-text-light text-sm">
                  This is your property listing
                </div>
              ) : messageSent ? (
                <div className="bg-success-light p-4 rounded-xl text-center text-success animate-fade-in">
                  <span className="text-2xl block mb-2">✅</span>
                  <p className="font-semibold">Message Sent!</p>
                  <p className="text-sm mt-1">The seller will be notified</p>
                  <Link href="/messages" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                    View Messages →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, I'm interested in this property..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary resize-none text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !message.trim()}
                    className="btn-primary w-full py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`w-full py-3 rounded-xl font-semibold mt-4 cursor-pointer transition-all flex items-center justify-center gap-2 ${
                isWishlisted
                  ? "bg-red-50 text-red-500 border-2 border-red-200"
                  : "bg-gray-100 text-text hover:bg-gray-200"
              }`}
            >
              {isWishlisted ? "❤️ Saved to Wishlist" : "🤍 Save to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
