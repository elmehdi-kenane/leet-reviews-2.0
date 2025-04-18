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
      : await prismaClient.feedback.findFirst({ where: { id: feedbackId } });
  if (!feedback)
    return NextResponse.json(
      { message: "feedback not found" },
      { status: 400 },
    );
  const save = await prismaClient.save.findFirst({
    where: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
    },
  });
  if (!save) return NextResponse.json({ message: "save not found" });

  const saveFeedbackId = save.feedbackId;
  const notification = await prismaClient.notification.findFirst({
    where: {
      authorId: userId,
      type: reaction.save,
      feedbackId: saveFeedbackId,
    },
  });
  if (notification)
    await deleteNotifications(saveFeedbackId, notification, userId);
  await prismaClient.save.delete({
    where: {
      id: save.id,
    },
  });

  return NextResponse.json({ message: "save deleted" });
}
