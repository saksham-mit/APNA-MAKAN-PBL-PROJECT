import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages, users, properties, notifications } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";

// Get conversations/messages
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const propertyId = url.searchParams.get("propertyId");
    const otherUserId = url.searchParams.get("otherUserId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // If propertyId and otherUserId provided, get specific conversation
    if (propertyId && otherUserId) {
      const conversation = await db
        .select({
          id: messages.id,
          senderId: messages.senderId,
          receiverId: messages.receiverId,
          message: messages.message,
          isRead: messages.isRead,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(
          and(
            eq(messages.propertyId, parseInt(propertyId)),
            or(
              and(eq(messages.senderId, parseInt(userId)), eq(messages.receiverId, parseInt(otherUserId))),
              and(eq(messages.senderId, parseInt(otherUserId)), eq(messages.receiverId, parseInt(userId)))
            )
          )
        )
        .orderBy(messages.createdAt);

      // Mark messages as read
      await db
        .update(messages)
        .set({ isRead: true })
        .where(
          and(
            eq(messages.propertyId, parseInt(propertyId)),
            eq(messages.receiverId, parseInt(userId)),
            eq(messages.senderId, parseInt(otherUserId))
          )
        );

      return NextResponse.json({ messages: conversation });
    }

    // Get all conversations (grouped by property and other user)
    const allMessages = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        propertyId: messages.propertyId,
        message: messages.message,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        propertyTitle: properties.title,
        propertyImage: properties.imageUrls,
      })
      .from(messages)
      .innerJoin(properties, eq(messages.propertyId, properties.id))
      .where(or(eq(messages.senderId, parseInt(userId)), eq(messages.receiverId, parseInt(userId))))
      .orderBy(desc(messages.createdAt));

    // Group by conversation (property + other user)
    const conversationMap = new Map();
    
    for (const msg of allMessages) {
      const otherUser = msg.senderId === parseInt(userId) ? msg.receiverId : msg.senderId;
      const key = `${msg.propertyId}-${otherUser}`;
      
      if (!conversationMap.has(key)) {
        // Get other user's details
        const otherUserDetails = await db
          .select({ name: users.name, phone: users.phone })
          .from(users)
          .where(eq(users.id, otherUser))
          .limit(1);

        conversationMap.set(key, {
          propertyId: msg.propertyId,
          propertyTitle: msg.propertyTitle,
          propertyImage: msg.propertyImage,
          otherUserId: otherUser,
          otherUserName: otherUserDetails[0]?.name || "User",
          otherUserPhone: otherUserDetails[0]?.phone || "",
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (msg.receiverId === parseInt(userId) && !msg.isRead) {
        const conv = conversationMap.get(key);
        conv.unreadCount++;
      }
    }

    return NextResponse.json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Send a message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderId, receiverId, propertyId, message } = body;

    if (!senderId || !receiverId || !propertyId || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Insert message
    const result = await db
      .insert(messages)
      .values({
        senderId,
        receiverId,
        propertyId,
        message,
      })
      .returning();

    // Get sender name for notification
    const sender = await db.select({ name: users.name }).from(users).where(eq(users.id, senderId)).limit(1);
    const property = await db.select({ title: properties.title }).from(properties).where(eq(properties.id, propertyId)).limit(1);

    // Create notification for receiver
    await db.insert(notifications).values({
      userId: receiverId,
      type: "message",
      title: `New message from ${sender[0]?.name || "Someone"}`,
      content: `Regarding: ${property[0]?.title || "Property"}`,
      relatedId: propertyId,
    });

    return NextResponse.json({ message: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
