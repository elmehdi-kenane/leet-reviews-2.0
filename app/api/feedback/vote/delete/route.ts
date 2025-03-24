import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";

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
  const votes = await prismaClient.vote.findMany({
    where: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
      isUp: isUp,
    },
  });
  if (votes.length === 0) {
    return NextResponse.json({ message: "vote not found" }, { status: 400 });
  }

  await prismaClient.vote.delete({
    where: {
      id: votes[0].id,
    },
  });
  return NextResponse.json({ message: "vote deleted" });
}
