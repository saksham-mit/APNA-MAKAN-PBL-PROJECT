"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GWALIOR_LOCATIONS, PROPERTY_TYPES } from "@/lib/locations";

interface SearchBarProps {
  variant?: "hero" | "default";
}

export default function SearchBar({ variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    router.push(`/properties?${params.toString()}`);
  };

  if (variant === "hero") {
    return (
      <div className="space-y-4">
        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm text-blue-200 mb-2 text-left font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Select Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white text-base focus:outline-none focus:border-white/50 cursor-pointer transition-all hover:bg-white/15"
          >
            <option value="" className="text-gray-800">All Locations in Gwalior</option>
            {GWALIOR_LOCATIONS.map((loc) => (
              <option key={loc} value={loc} className="text-gray-800">{loc}</option>
            ))}
          </select>
        </div>

        {/* Type & Budget Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Property Type */}
          <div>
            <label className="flex items-center gap-2 text-sm text-blue-200 mb-2 text-left font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white text-sm focus:outline-none focus:border-white/50 cursor-pointer transition-all hover:bg-white/15"
            >
              <option value="" className="text-gray-800">All Types</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t} className="text-gray-800">{t}</option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-sm text-blue-200 mb-2 text-left font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white text-sm focus:outline-none focus:border-white/50 cursor-pointer transition-all hover:bg-white/15"
            >
              <option value="" className="text-gray-800">Any Budget</option>
              <option value="0-2000000" className="text-gray-800">Under ₹20 Lakhs</option>
              <option value="2000000-3500000" className="text-gray-800">₹20 - 35 Lakhs</option>
              <option value="3500000-5000000" className="text-gray-800">₹35 - 50 Lakhs</option>
              <option value="5000000-7500000" className="text-gray-800">₹50 - 75 Lakhs</option>
              <option value="7500000-10000000" className="text-gray-800">₹75 Lakhs - 1 Cr</option>
              <option value="10000000-25000000" className="text-gray-800">₹1 - 2.5 Cr</option>
              <option value="25000000-" className="text-gray-800">Above ₹2.5 Cr</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full py-4 rounded-xl font-bold text-lg cursor-pointer flex items-center justify-center gap-3 bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-lg hover:shadow-accent/30 transform hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Properties
        </button>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full py-3 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-indigo-600 text-white hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
