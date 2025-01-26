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
  const saves = await prismaClient.save.findMany({
    where: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
    },
  });
  if (saves.length > 0)
    return NextResponse.json({ message: "save already exist" });

  await prismaClient.save.create({
    data: {
      authorId: userId,
      feedbackId: feedbackId ? feedbackId : "",
    },
  });

  return NextResponse.json({ message: "save added" });
}
