import { NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";

export type Account = {
  id: string;
  username: string;
  accountType: string;
  accessToken: string;
  provider: string;
  avatar?: string;
  providerAccountId: string;
};

// Define the response type
// type AccountsResponse = {
//   authAccounts: Account[];
//   connectedAccounts: Account[];
// };

export async function GET() {
  const result = await validateRequest();

  if (!result) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = result.user?.id;

    const authAccounts = await prismaClient.account.findMany({
      where: { userId, accountType: "AUTH" },
    });

    const connectedAccounts = await prismaClient.account.findMany({
      where: { userId, accountType: "CONNECTED" },
    });

    return NextResponse.json({ authAccounts, connectedAccounts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
