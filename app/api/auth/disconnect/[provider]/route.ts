import { NextResponse, NextRequest } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: { provider: "fortyTwo" | "github" | "discord" | "none" } },
) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { provider } = params;

  const account = await prismaClient.account.findFirst({
    where: { userId: userId, provider: provider },
  });
  if (account) {
    await prismaClient.account.delete({
      where: { id: account.id },
    });
    // const updatedAccounts = await prismaClient.account.findMany({
    //   where: { userId: userId },
    // });
    return NextResponse.json({ message: "account removed successfully" });
  }
  return NextResponse.json({ message: "account not found" });
}
