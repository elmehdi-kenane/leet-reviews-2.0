import { NextResponse } from "next/server";
import { prismaClient, validateRequest } from "@/lib/auth";

export type Account = {
  id: string;
  username: string;
  account_type: string;
  access_token: string;
  provider: string;
  avatar?: string;
  provider_account_id: string;
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
      where: { userId, account_type: "AUTH" },
    });

    const connectedAccounts = await prismaClient.account.findMany({
      where: { userId, account_type: "CONNECTED" },
    });

    return NextResponse.json({ authAccounts, connectedAccounts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
