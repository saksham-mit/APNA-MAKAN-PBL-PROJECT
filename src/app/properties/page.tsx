"use client";

import { useState, useEffect, useCallback } from "react";
import PropertyCard from "@/components/PropertyCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GWALIOR_LOCATIONS, PROPERTY_TYPES } from "@/lib/locations";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  imageUrls: string;
  sellerName?: string;
  sellerPhone?: string;
  address?: string;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [budget, setBudget] = useState(() => {
    const min = searchParams.get("minPrice") || "";
    const max = searchParams.get("maxPrice") || "";
    if (min || max) return `${min}-${max}`;
    return "";
  });
  const [address, setAddress] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.set("location", location);
      if (type) params.set("type", type);
      if (budget) {
        const [min, max] = budget.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }
      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.properties || []);
      setFilteredProperties(data.properties || []);
    } catch {
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  }, [location, type, budget]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filter by address locally
  useEffect(() => {
    if (!address.trim()) {
      setFilteredProperties(properties);
    } else {
      const filtered = properties.filter(
        (p) =>
          p.address?.toLowerCase().includes(address.toLowerCase()) ||
          p.title.toLowerCase().includes(address.toLowerCase()) ||
          p.location.toLowerCase().includes(address.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
  }, [address, properties]);

  const handleClear = () => {
    setLocation("");
    setType("");
    setBudget("");
    setAddress("");
  };

  const hasFilters = location || type || budget || address;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {location ? `Properties in ${location}` : "All Properties"}, Gwalior
          </h1>
          <p className="text-blue-200">
            Find your perfect property from our verified listings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Filters */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl border border-gray-100 mb-8 -mt-16 relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-text text-lg">Search & Filter Properties</h2>
              <p className="text-sm text-text-light">Find exactly what you&apos;re looking for</p>
            </div>
          </div>

          {/* Search by Address/Keyword */}
          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-xs text-text-light font-semibold mb-2">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search by Address or Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Type address, landmark, society name..."
                className="w-full px-4 py-3.5 pl-12 rounded-xl border-2 border-gray-100 text-text font-medium focus:outline-none focus:border-primary bg-gray-50 hover:border-gray-200 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-text-light font-semibold mb-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-text font-medium focus:outline-none focus:border-primary bg-gray-50 hover:border-gray-200 cursor-pointer transition-all"
              >
                <option value="">All Locations</option>
                {GWALIOR_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-text-light font-semibold mb-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Property Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-text font-medium focus:outline-none focus:border-primary bg-gray-50 hover:border-gray-200 cursor-pointer transition-all"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-text-light font-semibold mb-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-text font-medium focus:outline-none focus:border-primary bg-gray-50 hover:border-gray-200 cursor-pointer transition-all"
              >
                <option value="">Any Budget</option>
                <option value="0-2000000">Under ₹20 Lakhs</option>
                <option value="2000000-3500000">₹20 - 35 Lakhs</option>
                <option value="3500000-5000000">₹35 - 50 Lakhs</option>
                <option value="5000000-7500000">₹50 - 75 Lakhs</option>
                <option value="7500000-10000000">₹75L - 1 Cr</option>
                <option value="10000000-25000000">₹1 - 2.5 Cr</option>
                <option value="25000000-">Above ₹2.5 Cr</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              {hasFilters && (
                <button
                  onClick={handleClear}
                  className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-medium hover:bg-red-50 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap pt-4 border-t border-gray-100">
              <span className="text-sm text-text-light font-medium">Active Filters:</span>
              {address && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  &quot;{address}&quot;
                  <button onClick={() => setAddress("")} className="ml-1 hover:text-purple-900 cursor-pointer">×</button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {location}
                  <button onClick={() => setLocation("")} className="ml-1 hover:text-blue-200 cursor-pointer">×</button>
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-1 bg-indigo-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {type}
                  <button onClick={() => setType("")} className="ml-1 hover:text-indigo-200 cursor-pointer">×</button>
                </span>
              )}
              {budget && (
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Budget Set
                  <button onClick={() => setBudget("")} className="ml-1 hover:text-green-200 cursor-pointer">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-light">
                Showing <span className="font-bold text-text">{filteredProperties.length}</span> properties
                {location && <span> in <span className="text-primary font-medium">{location}</span></span>}
                {address && <span> matching &quot;<span className="text-purple-600 font-medium">{address}</span>&quot;</span>}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-2">
              {hasFilters ? "No Properties Match Your Search" : "No Properties Listed Yet"}
            </h3>
            <p className="text-text-light mb-6 max-w-md mx-auto">
              {hasFilters
                ? "Try adjusting your filters or search terms"
                : "Be the first to list your property!"}
            </p>
            {hasFilters ? (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 text-white cursor-pointer"
              >
                Clear All Filters
              </button>
            ) : (
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-accent to-orange-500 text-white"
              >
                List Your Property
              </a>
            )}
          </div>
        )}

        {/* Quick Locations */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Browse by Location
          </h3>
          <div className="flex flex-wrap gap-2">
            {GWALIOR_LOCATIONS.slice(0, 15).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc === location ? "" : loc)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                  location === loc
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-text border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-light">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
