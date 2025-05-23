import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prismaClient } from "@/lib/auth";
import { pusher } from "./pusher";
import { pusherEventTypes } from "./pusher";
import { notificationType } from "@prisma/client";
import { reaction } from "./types";

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
      relatedNotification.type === reaction.vote &&
      relatedNotification.voteIsUp === true
    )
      reason = "you liked";
    else if (
      relatedNotification.type === reaction.vote &&
      relatedNotification.voteIsUp === false
    )
      reason = "you disliked";
    else if (relatedNotification.type === reaction.comment)
      reason = "you commented on it";
    else if (relatedNotification.type === reaction.save)
      reason = "you saved it";
    else if (relatedNotification.type === reaction.creation)
      reason = "you created";
  }
  return reason;
}

export async function createNotification(
  type: notificationType,
  isUp: boolean | undefined,
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
    select: {
      createdAt: true,
      id: true,
      author: true,
    },
  });
  if (feedbackNotifications) {
    feedbackNotifications.forEach(async (feedbackNotification) => {
      if (authorId !== feedbackNotification.authorId) {
        // except the author of the new notification
        await prismaClient.notificationReceiver.create({
          data: {
            userId: feedbackNotification.authorId,
            notificationId: notification.id,
          },
        });
      }
    });
  }
  //   console.log(`trigger a new ${type} event`);
  await pusher.trigger(feedbackId, pusherEventTypes.newReaction, {
    authorId: authorId,
    authorAvatar: notification.author.avatar,
    authorName: notification.author.name,
    createdAt: notification.createdAt,
    feedbackId: feedbackId,
    voteIsUp: isUp,
    type: type,
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
  // before delete the received notifications related to the given feedback check if there's other notifications
  // if the user like and comment a feedback then he remove the comment and the like still so he's still subscribe to the given feedback
  await prismaClient.notificationReceiver.deleteMany({
    where: {
      notification: { feedbackId: feedbackId },
      userId: userId,
    },
  });
}
