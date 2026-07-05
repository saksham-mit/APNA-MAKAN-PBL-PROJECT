"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GWALIOR_LOCATIONS } from "@/lib/locations";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  area: number;
  bedrooms: number;
  propertyType: string;
  imageUrls: string;
  sellerPhone: string;
  sellerName: string;
  sellerId?: number;
}

interface WishlistItem extends Property {
  addedAt: string;
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "wishlist">("search");
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [searchLocation, setSearchLocation] = useState("");

  const fetchWishlist = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await res.json();
      setWishlist(data.wishlist || []);
      setWishlistIds(new Set((data.wishlist || []).map((w: WishlistItem) => w.id)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("apnaMakanUser");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      const u = JSON.parse(stored);
      if (u.role !== "buyer") {
        router.push("/seller");
        return;
      }
      setUser(u);
      fetchProperties();
      fetchWishlist(u.id);
    } catch {
      router.push("/login");
    }
  }, [router, fetchWishlist]);

  const fetchProperties = async (location?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set("location", location);
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch {
      setProperties([]);
    }
    setLoading(false);
  };

  const handleSearch = (loc: string) => {
    setSearchLocation(loc);
    fetchProperties(loc);
  };

  const toggleWishlist = async (propertyId: number) => {
    if (!user) return;
    
    if (wishlistIds.has(propertyId)) {
      // Remove from wishlist
      await fetch(`/api/wishlist?userId=${user.id}&propertyId=${propertyId}`, {
        method: "DELETE",
      });
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
      setWishlist((prev) => prev.filter((w) => w.id !== propertyId));
    } else {
      // Add to wishlist
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, propertyId }),
      });
      setWishlistIds((prev) => new Set(prev).add(propertyId));
      fetchWishlist(user.id);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">🏠</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
                👋
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
                <p className="text-blue-200 text-sm">Find your dream home in Gwalior</p>
              </div>
            </div>
            <Link
              href="/messages"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              💬 Messages
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 -mt-8 relative z-10">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${
              activeTab === "search"
                ? "bg-white shadow-lg text-primary"
                : "bg-white/80 text-text-light hover:bg-white"
            }`}
          >
            🔍 Search Properties
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "wishlist"
                ? "bg-white shadow-lg text-red-500"
                : "bg-white/80 text-text-light hover:bg-white"
            }`}
          >
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="animate-fade-in">
            {/* Search Box */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-border mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={searchLocation}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-4 py-4 rounded-xl border-2 border-border text-text font-medium focus:border-primary bg-gray-50 text-lg"
                >
                  <option value="">📍 All Locations in Gwalior</option>
                  {GWALIOR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <button
                  onClick={() => fetchProperties(searchLocation)}
                  className="btn-primary px-8 py-4 rounded-xl font-bold text-lg cursor-pointer whitespace-nowrap"
                >
                  🔍 Search
                </button>
              </div>

              {/* Quick Locations */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["DD Nagar", "City Centre", "Lashkar", "Thatipur", "Morar"].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSearch(loc)}
                    className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
                      searchLocation === loc
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-text hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">
                {searchLocation ? `Properties in ${searchLocation}` : "All Properties"}
                <span className="text-text-light font-normal ml-2">({properties.length})</span>
              </h2>
              {searchLocation && (
                <button onClick={() => handleSearch("")} className="text-primary font-medium cursor-pointer hover:underline">
                  Clear
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((p) => {
                  let imgs: string[] = [];
                  try { imgs = JSON.parse(p.imageUrls); } catch { /* */ }
                  const isWishlisted = wishlistIds.has(p.id);
                  
                  return (
                    <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover">
                      {/* Image */}
                      <div className="relative h-48">
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">🏠</div>
                        )}
                        
                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg ${
                            isWishlisted
                              ? "bg-red-500 text-white"
                              : "bg-white/90 text-gray-400 hover:text-red-500"
                          }`}
                        >
                          {isWishlisted ? "❤️" : "🤍"}
                        </button>
                        
                        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          {p.propertyType}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white text-primary font-bold px-3 py-1.5 rounded-lg shadow-lg">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-text text-lg truncate">{p.title}</h3>
                        <p className="text-text-light text-sm mt-1">
                          📍 {p.location} • {p.area} sq.ft {p.bedrooms > 0 && `• ${p.bedrooms} BHK`}
                        </p>
                        
                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex gap-2 mb-3">
                            <a
                              href={`tel:${p.sellerPhone}`}
                              className="flex-1 btn-success py-2.5 rounded-xl text-center font-bold text-sm"
                            >
                              📞 Call
                            </a>
                            <Link
                              href={`/property/${p.id}`}
                              className="flex-1 btn-primary py-2.5 rounded-xl text-center font-bold text-sm"
                            >
                              View
                            </Link>
                          </div>
                          <Link
                            href={`/property/${p.id}#message`}
                            className="block w-full py-2 rounded-xl text-center text-sm font-medium bg-gray-100 text-text hover:bg-gray-200 transition-colors"
                          >
                            💬 Send Message
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-text mb-2">
                  {searchLocation ? `No Properties in ${searchLocation}` : "No Properties Yet"}
                </h3>
                <p className="text-text-light">Check back soon for new listings</p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text">
                ❤️ My Wishlist
                <span className="text-text-light font-normal ml-2">({wishlist.length} properties)</span>
              </h2>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-xl font-bold text-text mb-2">Your Wishlist is Empty</h3>
                <p className="text-text-light mb-6">Save properties you like by clicking the heart icon</p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold cursor-pointer"
                >
                  🔍 Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((p) => {
                  let imgs: string[] = [];
                  try { imgs = JSON.parse(p.imageUrls); } catch { /* */ }
                  
                  return (
                    <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover">
                      <div className="relative h-48">
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">🏠</div>
                        )}
                        
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                        >
                          ❤️
                        </button>
                        
                        <div className="absolute bottom-3 left-3 bg-white text-primary font-bold px-3 py-1.5 rounded-lg shadow-lg">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-text text-lg truncate">{p.title}</h3>
                        <p className="text-text-light text-sm mt-1">
                          📍 {p.location} • {p.area} sq.ft
                        </p>
                        <p className="text-xs text-text-light mt-2">
                          Added {new Date(p.addedAt).toLocaleDateString()}
                        </p>
                        
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <a
                            href={`tel:${p.sellerPhone}`}
                            className="flex-1 btn-success py-2.5 rounded-xl text-center font-bold text-sm"
                          >
                            📞 Call
                          </a>
                          <Link
                            href={`/property/${p.id}`}
                            className="flex-1 btn-primary py-2.5 rounded-xl text-center font-bold text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
