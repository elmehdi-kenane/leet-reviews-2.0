import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
import { reaction } from "@/lib/types";
import { createNotification } from "@/lib/utils";

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
  const text = requestUrl.searchParams.get("text");
  if (!feedback || !text || text === "")
    return NextResponse.json(
      { error: "feedback not found or empty comment-text" },
      { status: 400 },
    );
  if (feedbackId) {
    await createNotification(reaction.comment, undefined, userId, feedbackId);
    const newComment = await prismaClient.comment.create({
      data: {
        authorId: userId,
        feedbackId: feedbackId ? feedbackId : "",
        text: text ? text : "",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    return NextResponse.json({ newComment: newComment });
  } else console.log("invalid feedbackId for pusher-trigger");
  return NextResponse.json({ status: 400 });
}
