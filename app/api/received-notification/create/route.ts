import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";
// import { getUserNotificationReason } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  console.log("the current userId", userId);

  console.log("data create received notification", data);

  if (userId === data.authorId) {
    console.log("create to the same one");
    return;
  }

  const notification = await prisma.notification.findFirst({
    orderBy: { createdAt: "desc" },
    where: { authorId: data.authorId, feedbackId: data.feedbackId },
  });
  if (!notification)
    return NextResponse.json(
      { error: "notification not found" },
      { status: 400 },
    );
  // update the notification with "vote" type instead of creating a new one
  const existingReceivedNotification =
    await prismaClient.notificationReceiver.findFirst({
      where: {
        userId: userId,
        notification: {
          type: "vote",
          feedbackId: notification.feedbackId,
          authorId: data.authorId,
        },
      },
    });
  let newReceivedNotification;
  console.log("existingReceivedNotification", existingReceivedNotification);

  if (existingReceivedNotification)
    newReceivedNotification = await prisma.notificationReceiver.update({
      where: { id: existingReceivedNotification.id },
      data: {
        isRead: false,
      },
      select: {
        notification: {
          select: {
            feedback: true,
            createdAt: true,
            voteIsUp: true,
            id: true,
            type: true,
            author: { select: { username: true, avatar: true, id: true } },
          },
        },
        id: true,
        isRead: true,
      },
    });
  else
    newReceivedNotification = await prisma.notificationReceiver.create({
      data: { isRead: false, userId: userId, notificationId: notification.id },
      select: {
        notification: {
          select: {
            feedback: true,
            createdAt: true,
            type: true,
            id: true,
            voteIsUp: true,
            author: { select: { username: true, avatar: true, id: true } },
          },
        },
        id: true,
        isRead: true,
      },
    });
  //   const reason = await getUserNotificationReason(
  //     userId,
  //     newReceivedNotification.notification.feedback.id,
  //   );
  const newReceivedNotificationWithReason = {
    // reason: reason,
    ...newReceivedNotification,
  };
  return NextResponse.json(
    { newReceivedNotification: newReceivedNotificationWithReason },
    { status: 200 },
  );
}
