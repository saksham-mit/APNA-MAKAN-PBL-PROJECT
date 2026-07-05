import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Get user notifications
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, parseInt(userId)))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    const unreadCount = result.filter((n) => !n.isRead).length;

    return NextResponse.json({ notifications: result, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Mark notification as read
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, notificationId, markAll } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (markAll) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    } else if (notificationId) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
