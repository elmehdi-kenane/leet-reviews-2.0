import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  console.log("data create received notification", data);

  const notification = await prisma.notification.findFirst({
    where: { authorId: data.authorId, feedbackId: data.feedbackId },
  });
  if (!notification)
    return NextResponse.json(
      { error: "notification not found" },
      { status: 400 },
    );
  const receivedNotification = await prisma.notificationReceiver.create({
    data: { isRead: false, userId: userId, notificationId: notification.id },
  });
  return NextResponse.json(
    { newReceivedNotification: receivedNotification },
    { status: 200 },
  );
}
