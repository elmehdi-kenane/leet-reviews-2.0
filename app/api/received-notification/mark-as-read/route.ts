import { NextRequest, NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestUrl = new URL(
    request.nextUrl,
    `http://${request.headers.get("host")}`,
  );
  const notificationId = requestUrl.searchParams.get("notificationId");

  try {
    await prismaClient.notificationReceiver.update({
      where: { id: notificationId ? notificationId : "" },
      data: { isRead: true },
    });
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({ status: 400 });
  }

  return NextResponse.json({ status: 200 });
}
