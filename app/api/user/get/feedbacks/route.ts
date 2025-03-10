import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userFeedbacks = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { feedbacks: { select: { companyName: true } } },
  });
  if (!userFeedbacks) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(userFeedbacks);
}
