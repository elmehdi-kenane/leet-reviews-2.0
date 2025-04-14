import { NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";

export async function POST() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const receivedNotifications =
    await prismaClient.notificationReceiver.findMany({
      where: { userId: userId },
    });
  await prismaClient.user.update({
    where: { id: userId },
    data: { notificationsCounter: receivedNotifications.length },
  });
  return NextResponse.json({ status: 200 });
}
