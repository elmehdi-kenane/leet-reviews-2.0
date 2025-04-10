import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prismaClient } from "@/lib/auth";

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
