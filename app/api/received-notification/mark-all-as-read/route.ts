import { NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";

export async function POST() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prismaClient.notificationReceiver.updateMany({
      where: { userId: userId },
      data: { isRead: true },
    });
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({ status: 400 });
  }

  return NextResponse.json({ status: 200 });
}
