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
  const votes = await prismaClient.vote.findMany({
    where: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
      isUp: isUp,
    },
  });
  if (votes.length > 0) {
    console.log("votes", votes);
    console.log("votes[0].id", votes[0].id);

    await prismaClient.vote.delete({
      where: {
        id: votes[0].id,
      },
    });
  }

  return NextResponse.json({ message: "delete vote" });
}
