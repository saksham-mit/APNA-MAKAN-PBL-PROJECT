import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishlists, properties, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Get user's wishlist
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await db
      .select({
        id: wishlists.id,
        propertyId: properties.id,
        title: properties.title,
        location: properties.location,
        price: properties.price,
        area: properties.area,
        bedrooms: properties.bedrooms,
        propertyType: properties.propertyType,
        imageUrls: properties.imageUrls,
        sellerName: users.name,
        sellerPhone: users.phone,
        addedAt: wishlists.createdAt,
      })
      .from(wishlists)
      .innerJoin(properties, eq(wishlists.propertyId, properties.id))
      .innerJoin(users, eq(properties.sellerId, users.id))
      .where(eq(wishlists.userId, parseInt(userId)));

    return NextResponse.json({ wishlist: result });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Add to wishlist
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, propertyId } = body;

    if (!userId || !propertyId) {
      return NextResponse.json({ error: "User ID and Property ID required" }, { status: 400 });
    }

    // Check if already in wishlist
    const existing = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.propertyId, propertyId)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already in wishlist" }, { status: 200 });
    }

    await db.insert(wishlists).values({ userId, propertyId });

    return NextResponse.json({ message: "Added to wishlist" }, { status: 201 });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const propertyId = url.searchParams.get("propertyId");

    if (!userId || !propertyId) {
      return NextResponse.json({ error: "User ID and Property ID required" }, { status: 400 });
    }

    await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, parseInt(userId)), eq(wishlists.propertyId, parseInt(propertyId))));

    return NextResponse.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
