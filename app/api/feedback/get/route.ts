import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { prismaClient } from "@/lib/auth";

export async function GET() {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const feedbacks = await prismaClient.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      saves: true,
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
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
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
          accountDisplayedWithFeedbacks: true,
          accounts: {
            select: {
              provider: true,
              username: true,
              accountType: true,
            },
          },
        },
      },
    },
  });

  const sanitizedFeedbacks = feedbacks.map((feedback) => {
    if (feedback.feedbackType === "Anonymous") {
      return { ...feedback, author: null, authorId: null };
    }
    return feedback;
  });

  const updatedFeedbacks = sanitizedFeedbacks.map((feedback) => {
    if (feedback.author === null) return feedback;
    const linkedAccountProvider = feedback.author.accountDisplayedWithFeedbacks;
    const linkedAccountUsername = feedback.author.accounts.find(
      (account) => account.provider === linkedAccountProvider,
    )?.username;
    let linkedAccountProfileUrl = "";
    if (linkedAccountProvider === "fortyTwo")
      linkedAccountProfileUrl = `https://profile.intra.42.fr/users/${linkedAccountUsername}`;
    else if (linkedAccountProvider === "discord") linkedAccountProfileUrl = ``;
    else if (linkedAccountProvider === "github")
      linkedAccountProfileUrl = `https://github.com/${linkedAccountUsername}`;

    return {
      ...feedback,
      author: {
        ...feedback.author,
        linkedAccountProfileUrl: linkedAccountProfileUrl,
      },
    };
  });

  return NextResponse.json({ feedbacks: updatedFeedbacks });
}
