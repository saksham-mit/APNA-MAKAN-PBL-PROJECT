import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq, desc, and, ilike, gte, lte, SQL } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const location = url.searchParams.get("location");
    const propertyType = url.searchParams.get("type");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const sellerId = url.searchParams.get("sellerId");

    const conditions: SQL[] = [eq(properties.isActive, true)];

    if (location) {
      conditions.push(ilike(properties.location, `%${location}%`));
    }
    if (propertyType) {
      conditions.push(eq(properties.propertyType, propertyType));
    }
    if (minPrice) {
      conditions.push(gte(properties.price, minPrice));
    }
    if (maxPrice) {
      conditions.push(lte(properties.price, maxPrice));
    }
    if (sellerId) {
      conditions.push(eq(properties.sellerId, parseInt(sellerId)));
    }

    const result = await db
      .select({
        id: properties.id,
        title: properties.title,
        description: properties.description,
        propertyType: properties.propertyType,
        location: properties.location,
        address: properties.address,
        price: properties.price,
        area: properties.area,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        parking: properties.parking,
        furnished: properties.furnished,
        amenities: properties.amenities,
        builderName: properties.builderName,
        imageUrls: properties.imageUrls,
        createdAt: properties.createdAt,
        sellerId: properties.sellerId,
        sellerName: users.name,
        sellerPhone: users.phone,
        sellerEmail: users.email,
      })
      .from(properties)
      .innerJoin(users, eq(properties.sellerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt));

    return NextResponse.json({ properties: result });
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sellerId,
      title,
      description,
      propertyType,
      location,
      address,
      price,
      area,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      amenities,
      builderName,
      imageUrls,
    } = body;

    if (!sellerId || !title || !description || !propertyType || !location || !address || !price || !area) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const result = await db
      .insert(properties)
      .values({
        sellerId,
        title,
        description,
        propertyType,
        location,
        address,
        price: price.toString(),
        area: parseInt(area),
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        parking: parseInt(parking) || 0,
        furnished: furnished || "Unfurnished",
        amenities: amenities || "",
        builderName: builderName || "",
        imageUrls: JSON.stringify(imageUrls || []),
      })
      .returning();

    return NextResponse.json({ property: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
