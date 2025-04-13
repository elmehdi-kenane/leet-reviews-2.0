import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prismaClient } from "@/lib/auth";
import { pusher } from "./pusher";
import { pusherEventTypes } from "./pusher";
import { notificationType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserNotificationReason(
  userId: string,
  feedbackId: string,
) {
  let reason = "default";

  const relatedNotification = await prismaClient.notification.findFirst({
    where: {
      authorId: userId,
      feedbackId,
    },
  });

  if (relatedNotification) {
    if (
      relatedNotification.type === "vote" &&
      relatedNotification.voteIsUp === true
    ) {
      reason = "you liked";
    } else if (
      relatedNotification.type === "vote" &&
      relatedNotification.voteIsUp === false
    ) {
      reason = "you disliked";
    } else if (relatedNotification.type === "comment") {
      reason = "you commented on it";
    } else if (relatedNotification.type === "save") {
      reason = "you saved it";
    }
  }
  return reason;
}

export async function createNotification(
  type: notificationType,
  isUp: boolean,
  authorId: string,
  feedbackId: string,
) {
  // notifications related to a feedback are a subscribers to it
  // get all notifications related to the feedback and create a receiver-notification for them
  const feedbackNotifications = await prismaClient.notification.findMany({
    where: { feedbackId: feedbackId },
  });
  const notification = await prismaClient.notification.create({
    data: {
      type: type,
      voteIsUp: isUp,
      authorId: authorId,
      feedbackId: feedbackId,
    },
  });
  if (feedbackNotifications) {
    feedbackNotifications.forEach(async (feedbackNotification) => {
      if (authorId !== feedbackNotification.authorId)
        // except the author of the new
        await prismaClient.notificationReceiver.create({
          data: {
            userId: feedbackNotification.authorId,
            notificationId: notification.id,
          },
        });
    });
  } else console.log("this notification is the first one");

  console.log("trigger a new vote event");
  await pusher.trigger(feedbackId, pusherEventTypes.newVote, {
    authorId: authorId,
    feedbackId: feedbackId,
    voteIsUp: isUp,
  });
}

type notification = {
  id: string;
};

/**
 * Deletes all related notifications (both sent and received) for the given feedback. */

export async function deleteNotifications(
  feedbackId: string,
  notification: notification,
  userId: string,
) {
  if (feedbackId) {
    await pusher.trigger(feedbackId, pusherEventTypes.deleteNotification, {
      notificationId: notification.id,
    });
  }
  await prismaClient.notification.delete({ where: { id: notification.id } });
  await prismaClient.notificationReceiver.deleteMany({
    where: {
      notification: { feedbackId: feedbackId },
      userId: userId,
    },
  });
}
