"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GWALIOR_LOCATIONS, PROPERTY_TYPES } from "@/lib/locations";

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
  propertyType: string;
  area: number;
  bedrooms: number;
  imageUrls: string;
  createdAt: string;
}

interface Conversation {
  propertyId: number;
  propertyTitle: string;
  otherUserId: number;
  otherUserName: string;
  otherUserPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "enquiries" | "add">("properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("DD Nagar");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("Flat");
  const [bedrooms, setBedrooms] = useState("2");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProperties = useCallback(async (sellerId: number) => {
    try {
      const res = await fetch(`/api/properties?sellerId=${sellerId}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch { /* ignore */ }
  }, []);

  const fetchConversations = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setConversations(data.conversations || []);
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
      if (u.role !== "seller") {
        router.push("/buyer");
        return;
      }
      setUser(u);
      Promise.all([
        fetchProperties(u.id),
        fetchConversations(u.id),
      ]).then(() => setLoading(false));
    } catch {
      router.push("/login");
    }
  }, [router, fetchProperties, fetchConversations]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFormError("");

    if (images.length + files.length > 5) {
      setFormError("Maximum 5 photos");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        setFormError("Each photo must be under 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setImages([]);
    setTitle("");
    setLocation("DD Nagar");
    setPrice("");
    setArea("");
    setPropertyType("Flat");
    setBedrooms("2");
    setDescription("");
    setFormError("");
  };

  const handlePublish = async () => {
    setFormError("");
    if (images.length === 0) { setFormError("Upload at least 1 photo"); return; }
    if (!title.trim()) { setFormError("Enter property title"); return; }
    if (!price || parseInt(price) < 10000) { setFormError("Enter valid price"); return; }
    if (!area || parseInt(area) < 50) { setFormError("Enter property area"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user!.id,
          title, description: description || `${propertyType} for sale in ${location}, Gwalior.`,
          propertyType, location, address: `${location}, Gwalior, MP`,
          price, area, bedrooms, bathrooms: Math.ceil(parseInt(bedrooms) / 2).toString(),
          parking: "1", furnished: "Unfurnished", amenities: "", builderName: "", imageUrls: images,
        }),
      });
      if (res.ok) {
        setSuccessMsg(`Property listed! Buyers searching "${location}" will see it.`);
        resetForm();
        setActiveTab("properties");
        fetchProperties(user!.id);
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to publish");
      }
    } catch { setFormError("Something went wrong"); }
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/properties/${id}?sellerId=${user!.id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchProperties(user!.id);
  };

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">🏠</div></div>;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-accent via-orange-500 to-red-500 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
              <p className="text-orange-200 text-sm">Welcome, {user.name}</p>
            </div>
          </div>
          <Link href="/messages" className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-colors flex items-center gap-2">
            💬 Messages
            {totalUnread > 0 && <span className="bg-white text-accent text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread}</span>}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-border">
            <div className="text-2xl font-bold text-primary">{properties.length}</div>
            <div className="text-xs text-text-light">Listings</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-border">
            <div className="text-2xl font-bold text-green-500">{conversations.length}</div>
            <div className="text-xs text-text-light">Enquiries</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-lg border border-border">
            <div className="text-2xl font-bold text-accent">{totalUnread}</div>
            <div className="text-xs text-text-light">Unread</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: "properties", label: "🏘️ My Properties", count: properties.length },
            { id: "enquiries", label: "💬 Enquiries", count: totalUnread },
            { id: "add", label: "➕ Add Property" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                activeTab === tab.id ? "bg-white shadow-lg text-primary" : "bg-white/80 text-text-light hover:bg-white"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  tab.id === "enquiries" && tab.count > 0 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <div className="text-6xl mb-4 animate-float">📭</div>
                <h3 className="text-xl font-bold text-text mb-2">No Properties</h3>
                <p className="text-text-light mb-6">List your first property</p>
                <button onClick={() => setActiveTab("add")} className="btn-accent px-8 py-4 rounded-xl font-bold cursor-pointer">
                  ➕ Add Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((p) => {
                  let imgs: string[] = [];
                  try { imgs = JSON.parse(p.imageUrls); } catch { /* */ }
                  return (
                    <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
                      <div className="flex">
                        <div className="w-36 h-32 flex-shrink-0 relative">
                          {imgs[0] ? <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl">🏠</div>}
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">LIVE</div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-text truncate flex-1">{p.title}</h3>
                            <span className="text-primary font-bold whitespace-nowrap">{formatPrice(p.price)}</span>
                          </div>
                          <p className="text-sm text-text-light mt-1">📍 {p.location} • {p.propertyType}</p>
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                            <Link href={`/property/${p.id}`} className="text-sm text-primary font-medium hover:underline">View →</Link>
                            <span className="text-border">|</span>
                            {deleteConfirm === p.id ? (
                              <>
                                <button onClick={() => handleDelete(p.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold cursor-pointer">Delete</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-text-light cursor-pointer">Cancel</button>
                              </>
                            ) : (
                              <button onClick={() => setDeleteConfirm(p.id)} className="text-xs text-red-500 cursor-pointer hover:underline">Delete</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === "enquiries" && (
          <div className="animate-fade-in">
            {conversations.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-text mb-2">No Enquiries Yet</h3>
                <p className="text-text-light">Buyers will message you when interested</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <Link
                    key={`${conv.propertyId}-${conv.otherUserId}`}
                    href="/messages"
                    className={`block bg-white rounded-2xl p-4 border border-border hover:shadow-lg transition-all ${conv.unreadCount > 0 ? "border-l-4 border-l-primary" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                        {conv.otherUserName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-text">{conv.otherUserName}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{conv.unreadCount} new</span>
                          )}
                        </div>
                        <p className="text-xs text-primary">Re: {conv.propertyTitle}</p>
                        <p className="text-sm text-text-light truncate mt-1">{conv.lastMessage}</p>
                      </div>
                      <div className="text-2xl">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Property Tab */}
        {activeTab === "add" && (
          <div className="animate-fade-in bg-white rounded-2xl p-6 shadow-lg border-2 border-accent/20">
            <h2 className="text-2xl font-bold text-text mb-6">📸 Add New Property</h2>

            {/* Photos */}
            <div className="mb-6">
              <label className="text-lg font-bold text-accent mb-3 block">Step 1: Upload Photos</label>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-28 h-24 object-cover rounded-xl border-2 border-accent" />
                      <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 5 && (
                <label className="block p-8 border-2 border-dashed border-accent rounded-2xl text-center cursor-pointer hover:bg-accent-light transition-colors bg-orange-50">
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  <div className="text-4xl mb-2">📷</div>
                  <p className="font-bold text-accent">Click to Upload ({images.length}/5)</p>
                </label>
              )}
            </div>

            {/* Location & Price */}
            <div className="mb-6">
              <label className="text-lg font-bold text-primary mb-3 block">Step 2: Location & Price</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">📍 Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary bg-white">
                    {GWALIOR_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">💰 Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 3500000" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary" />
                  {price && <p className="text-primary font-bold mt-1">= {formatPrice(price)}</p>}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mb-6">
              <label className="text-lg font-bold text-green-600 mb-3 block">Step 3: Property Details</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 3 BHK Flat" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">Type</label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary bg-white">
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">Area (sq.ft)</label>
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1200" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-text mb-1 block">Bedrooms</label>
                  <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary bg-white">
                    {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n === 0 ? "N/A" : `${n} BHK`}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-semibold text-text mb-1 block">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Property details..." className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary resize-none" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
              <p className="text-sm text-blue-800"><strong>📞 Your Contact:</strong> {user.phone} • {user.email}</p>
            </div>

            {formError && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">⚠️ {formError}</div>}

            <button onClick={handlePublish} disabled={submitting} className="w-full btn-success py-4 rounded-2xl font-bold text-xl cursor-pointer disabled:opacity-50">
              {submitting ? "⏳ Publishing..." : "🚀 PUBLISH PROPERTY"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
