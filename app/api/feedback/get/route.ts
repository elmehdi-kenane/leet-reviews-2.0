import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prismaClient } from "@/lib/auth";

export async function GET() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const feedbacks = await prismaClient.feedback.findMany();
  return NextResponse.json({ feedbacks: feedbacks });
}
