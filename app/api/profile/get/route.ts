import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const requestUrl = new URL(
    request.nextUrl,
    `http://${request.headers.get("host")}`,
  );
  const userIdParam = requestUrl.searchParams.get("userId");
  if (userIdParam === null)
    return NextResponse.json({ error: "invalid userId" }, { status: 401 });
  const isOwn = userId === userIdParam;

  let profileData = {};

  const user = await prismaClient.user.findUnique({
    include: {
      accounts: {
        select: {
          provider: true,
          username: true,
        },
      },
    },
    where: {
      id: userIdParam ? userIdParam : "",
    },
  });

  profileData = {
    isOwn: isOwn,
    user: user,
  };

  const feedbacks = await prismaClient.feedback.findMany({
    where: {
      authorId: userIdParam,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  profileData = {
    ...profileData,
    feedbacks: feedbacks,
  };

  const comments = await prismaClient.comment.findMany({
    where: {
      authorId: userIdParam,
    },
    orderBy: { createdAt: "desc" },
    include: {
      feedback: {
        select: {
          id: true,
          companyLogo: true,
          companyName: true,
          experienceRate: true,
          feedbackType: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  profileData = {
    ...profileData,
    comments: comments,
  };

  const saves = await prismaClient.save.findMany({
    where: {
      authorId: userIdParam,
    },
    orderBy: { createdAt: "desc" },
    include: {
      feedback: {
        select: {
          id: true,
          companyLogo: true,
          companyName: true,
          experienceRate: true,
          feedbackType: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  profileData = {
    ...profileData,
    saves: saves,
  };

  const votes = await prismaClient.vote.findMany({
    where: {
      authorId: userIdParam,
    },
    include: {
      feedback: {
        select: {
          id: true,
          companyLogo: true,
          companyName: true,
          jobStatus: true,
          experienceRate: true,
          feedbackType: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  profileData = {
    ...profileData,
    votes: votes,
  };
  console.log(profileData, "profileData");

  return NextResponse.json({ data: profileData });
}
