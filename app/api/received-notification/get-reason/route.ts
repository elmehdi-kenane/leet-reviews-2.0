import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { getUserNotificationReason } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const notification = await prisma.notification.findFirst({
    orderBy: { createdAt: "desc" },
    where: { authorId: userId, feedbackId: data.feedbackId },
  });
  if (!notification)
    return NextResponse.json(
      { error: "notification not found" },
      { status: 400 },
    );
  const reason = await getUserNotificationReason(userId, data.feedbackId);
  return NextResponse.json({ reason: reason }, { status: 200 });
}
