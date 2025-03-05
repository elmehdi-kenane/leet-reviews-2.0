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

  const feedback = await prismaClient.feedback.findFirst({
    where: {
      authorId: userId,
      id: feedbackId ? feedbackId : "",
    },
  });
  if (!feedback) return NextResponse.json({ message: "feedback not found" });
  await prismaClient.feedback.delete({
    where: {
      id: feedback.id,
    },
  });

  return NextResponse.json({ message: "feedback deleted" });
}
