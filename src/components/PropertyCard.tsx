import Link from "next/link";

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
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property }: { property: Property }) {
  let images: string[] = [];
  try {
    images = JSON.parse(property.imageUrls);
  } catch {
    images = [];
  }

  const hasImage = images.length > 0 && images[0];

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {hasImage ? (
            <>
              <img
                src={images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm text-gray-400">No Image</span>
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/95 backdrop-blur-sm text-primary shadow-lg">
              {property.propertyType}
            </span>
          </div>
          
          {/* Photo Count */}
          {images.length > 0 && (
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {images.length}
              </span>
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <span className="px-4 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-primary to-indigo-600 text-white shadow-xl">
              {formatPrice(property.price)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-text text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-text-light text-sm mb-4">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}, Gwalior
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-text-light">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.area} sq.ft
            </span>
            {property.bedrooms > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-text-light">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} BHK
              </span>
            )}
          </div>

          {/* Seller & CTA */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {property.sellerName && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-light to-blue-100 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                  {property.sellerName.charAt(0)}
                </div>
                <span className="text-sm text-text-light">by <span className="text-text font-medium">{property.sellerName}</span></span>
              </div>
            )}
            <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              View
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
