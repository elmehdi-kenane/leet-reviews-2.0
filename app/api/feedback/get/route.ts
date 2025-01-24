import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prismaClient } from "@/lib/auth";

export async function GET() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const feedbacks = await prismaClient.feedback.findMany({
    include: {
      votes: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          accounts: {
            select: {
              provider: true,
              username: true,
              account_type: true,
            },
          },
        },
      },
    },
  });

  const updatedFeedbacks = feedbacks.map((feedback) => {
    const intraProfileUrl = `https://profile.intra.42.fr/users/${
      feedback.author.accounts.find(
        (account) =>
          account.provider === "fortyTwo" && account.account_type === "AUTH"
      )?.username
    }`;
    
    return {
      ...feedback,
      authorAvatar: feedback.author.avatar,
      authorName: feedback.author.name,
      authorUsername: feedback.author.username,
      authorIntraProfile: intraProfileUrl || null,
    };
  });

  console.log("updatedFeedbacks", updatedFeedbacks);
    
  return NextResponse.json({ feedbacks: updatedFeedbacks });
}
