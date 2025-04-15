import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
import { deleteNotifications } from "@/lib/utils";
import { reaction } from "@/lib/types";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestUrl = new URL(
    request.nextUrl,
    `http://${request.headers.get("host")}`,
  );
  const feedbackId = requestUrl.searchParams.get("feedbackId");
  const feedback =
    feedbackId === null || feedbackId === undefined
      ? null
      : await prismaClient.feedback.findFirst({
          where: { id: feedbackId },
        });
  const isUpParam = requestUrl.searchParams.get("isUp");
  if (!feedback || (isUpParam !== "true" && isUpParam !== "false"))
    return NextResponse.json(
      { message: "feedback not found or invalid isUp param" },
      { status: 400 },
    );
  const isUp = isUpParam === "true" ? true : false;
  const vote = await prismaClient.vote.findFirst({
    where: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
      isUp: isUp,
    },
  });
  if (!vote) {
    return NextResponse.json({ message: "vote not found" }, { status: 400 });
  }
  const voteFeedbackId = vote.feedbackId;
  const notification = await prismaClient.notification.findFirst({
    where: {
      authorId: userId,
      type: reaction.vote,
      feedbackId: voteFeedbackId,
    },
  });
  if (notification)
    await deleteNotifications(voteFeedbackId, notification, userId);
  await prismaClient.vote.delete({
    where: {
      id: vote.id,
    },
  });
  return NextResponse.json({ message: "vote deleted" });
}
