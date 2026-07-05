import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property: result[0] });
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    const url = new URL(req.url);
    const sellerId = url.searchParams.get("sellerId");

    if (isNaN(propertyId) || !sellerId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await db
      .delete(properties)
      .where(and(eq(properties.id, propertyId), eq(properties.sellerId, parseInt(sellerId))));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
