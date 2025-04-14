import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
// import { getUserNotificationReason } from "@/lib/utils";

export async function GET() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const receivedNotifications =
    await prismaClient.notificationReceiver.findMany({
      orderBy: {
        notification: {
          createdAt: "desc",
        },
      },
      where: { userId: userId },
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
  const notifications = await Promise.all(
    receivedNotifications.map(async (notification) => {
      //   const reason = await getUserNotificationReason(
      //     userId,
      //     notification.notification.feedback.id,
      //   );

      return {
        // reason: reason,
        ...notification,
      };
    }),
  );
  const subscribedPusherChannels = await prismaClient.notification.findMany({
    where: { authorId: userId },
  });
  const subscribedPusherChannelNames = subscribedPusherChannels.map(
    (channel) => {
      return channel.feedbackId;
    },
  );
  return NextResponse.json({
    userInfos: user,
    notifications: notifications,
    subscribedPusherChannelNames: subscribedPusherChannelNames,
  });
}
