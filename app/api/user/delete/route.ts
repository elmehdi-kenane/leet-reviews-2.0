import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";

export async function POST() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prismaClient.user.findFirst({
    where: { id: userId },
  });
  if (user) {
    await prismaClient.user.delete({
      where: { id: user.id },
    });
    return NextResponse.json({ message: "account deleted" });
  }
  return NextResponse.json({ message: "account not found" });
}
