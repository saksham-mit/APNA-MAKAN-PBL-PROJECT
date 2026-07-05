import Link from "next/link";
import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { POPULAR_LOCATIONS } from "@/lib/locations";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProperties: Array<{
    id: number;
    title: string;
    location: string;
    price: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    imageUrls: string;
    sellerName: string;
  }> = [];

  let totalCount = 0;

  try {
    featuredProperties = await db
      .select({
        id: properties.id,
        title: properties.title,
        location: properties.location,
        price: properties.price,
        area: properties.area,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        propertyType: properties.propertyType,
        imageUrls: properties.imageUrls,
        sellerName: users.name,
      })
      .from(properties)
      .innerJoin(users, eq(properties.sellerId, users.id))
      .where(eq(properties.isActive, true))
      .orderBy(desc(properties.createdAt))
      .limit(6);
    
    totalCount = featuredProperties.length;
  } catch {
    // DB not ready
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/20 text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Gwalior&apos;s Trusted Real Estate Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Discover Your
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Perfect Home
                </span>
                <span className="block text-3xl md:text-4xl mt-2 text-blue-200 font-normal">in Gwalior</span>
              </h1>
              
              <p className="text-lg text-blue-200/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with property owners. Browse real photos, transparent prices, and 30+ prime locations across Gwalior.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 mb-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-3xl font-bold text-white">{totalCount || 100}+</div>
                  <div className="text-xs text-blue-300 mt-1">Properties</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-3xl font-bold text-white">30+</div>
                  <div className="text-xs text-blue-300 mt-1">Locations</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                  <div className="text-3xl font-bold text-white">Free</div>
                  <div className="text-xs text-blue-300 mt-1">To Use</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/properties"
                  className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-indigo-600 text-white hover:shadow-xl hover:shadow-primary/25 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Properties
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-xl hover:shadow-accent/25 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  List Your Property
                </Link>
              </div>
            </div>

            {/* Right - Search Card */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl opacity-20 blur-xl"></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Find Properties</h2>
                    <p className="text-sm text-blue-200">Search by location, type & budget</p>
                  </div>
                </div>
                <SearchBar variant="hero" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F5F7FA"/>
          </svg>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Explore Gwalior
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Popular Locations</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Discover properties in the most sought-after neighborhoods of Gwalior
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {POPULAR_LOCATIONS.map((loc, i) => (
              <Link
                key={loc.name}
                href={`/properties?location=${encodeURIComponent(loc.name)}`}
                className="group bg-white rounded-2xl p-5 md:p-6 border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-light to-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {loc.icon}
                </div>
                <h3 className="font-bold text-text group-hover:text-primary transition-colors text-lg">{loc.name}</h3>
                <p className="text-sm text-text-light mt-1">{loc.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Properties
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href="/properties" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all text-lg"
            >
              View All 30+ Locations
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full text-accent text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Latest Listings
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text">Featured Properties</h2>
            </div>
            <Link
              href="/properties"
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 text-white hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">No Properties Listed Yet</h3>
              <p className="text-text-light mb-8 max-w-md mx-auto">
                Be the first seller to list your property and reach thousands of potential buyers!
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-lg hover:shadow-accent/25 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                List Your Property
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">How It Works</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Whether you&apos;re buying or selling, our platform makes it simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-primary/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">For Buyers</h3>
                  <p className="text-text-light text-sm">Find your dream home</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Search & Filter", desc: "Browse by location, type, and budget" },
                  { step: "2", title: "View Details", desc: "See real photos and full property info" },
                  { step: "3", title: "Contact Seller", desc: "Message or call property owners directly" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center font-bold text-primary flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{item.title}</h4>
                      <p className="text-sm text-text-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="mt-8 w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-primary to-indigo-600 text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all">
                Get Started as Buyer
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* For Sellers */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-orange-500/5 hover:shadow-xl hover:shadow-accent/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text">For Sellers</h3>
                  <p className="text-text-light text-sm">Sell your property fast</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Create Account", desc: "Register as a seller for free" },
                  { step: "2", title: "Upload & List", desc: "Add photos, set price and location" },
                  { step: "3", title: "Get Enquiries", desc: "Receive calls and messages from buyers" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center font-bold text-accent flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{item.title}</h4>
                      <p className="text-sm text-text-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="mt-8 w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-accent to-orange-500 text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-accent/25 transition-all">
                Start Selling Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your Journey Today
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Perfect Property?</span>
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust Apna Makan for their real estate needs in Gwalior
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-xl hover:shadow-accent/25 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/properties"
              className="px-10 py-4 rounded-xl font-bold text-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
