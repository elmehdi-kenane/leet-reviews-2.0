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
  const isUpParam = requestUrl.searchParams.get("isUp");
  const isUp = isUpParam === "true" ? true : false;
  console.log("feedbackId", feedbackId);
  console.log("isUp", isUp);
  console.log("userId", userId);
  const votes = await prismaClient.vote.findMany({
    where: {
      userId: userId,
      feedbackId: feedbackId ? feedbackId : "",
      isUp: isUp,
    },
  });
  if (votes.length !== 0)
    return NextResponse.json({ message: "vote already exist" });

  await prismaClient.vote.create({
    data: {
      userId: userId,
      feedbackId: feedbackId ? feedbackId : "",
      isUp: isUp,
    },
  });

  return NextResponse.json({ message: "add vote" });
}
