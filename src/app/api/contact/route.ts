import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, propertyId } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        phone,
        message,
        propertyId: propertyId ? parseInt(propertyId) : null,
      })
      .returning();

    return NextResponse.json({ message: "Message sent successfully", data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
