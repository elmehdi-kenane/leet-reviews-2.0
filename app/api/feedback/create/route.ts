import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { FeedbackCreateInput } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userFeedbacks = await prismaClient.user.findMany({
    where: { id: userId },
  });

  const MAX_FEEDBACKS = Number(process.env.MAX_FEEDBACKS ?? 10);
  // You have reached the maximum number of feedback submissions.
  if (userFeedbacks.length === MAX_FEEDBACKS)
    return NextResponse.json(
      { error: process.env.MAX_FEEDBACKS_ERROR },
      { status: 400 },
    );

  const createAt = new Date();
  const data: FeedbackCreateInput = {
    feedbackType: "",
    trustScore: 0,
    companyName: "",
    companyLogo: "",
    companyLinkedIn: "",
    companyLocation: "",
    jobStatus: "",
    workingType: "",
    contractType: "",
    jobProgressType: "",
    experienceRate: 0,
    authorComment: "",
    createdAt: createAt,
    updatedAt: createAt,
    authorId: userId,
  };

  for (const [key, value] of formData.entries()) {
    if (value instanceof File || key === "companyLogo") {
      if (value === "undefined" || value === "") {
        data[key] = "/DefaultCompanyLogo.svg";
      } else {
        const companyLogoFile = value as File;
        const fileBuffer = Buffer.from(await companyLogoFile.arrayBuffer());
        const uploadResult: CloudinaryUploadResult =
          await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "company-logos" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result as CloudinaryUploadResult);
                }
              },
            );
            uploadStream.end(fileBuffer);
          });
        data[key] = uploadResult.secure_url;
      }
    } else {
      const numericValue = parseFloat(value);
      if (Number.isNaN(numericValue)) data[key] = value;
      else data[key] = parseFloat(value);
    }
  }

  const newFeedback = await prismaClient.feedback.create({
    data: data,
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
          accountDisplayedWithFeedbacks: true,
          avatar: true,
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

  const linkedAccountProvider =
    newFeedback.author.accountDisplayedWithFeedbacks;
  const linkedAccountUsername = newFeedback.author.accounts.find(
    (account) => account.provider === linkedAccountProvider,
  )?.username;
  let linkedAccountProfileUrl = "";
  if (linkedAccountProvider === "fortyTwo")
    linkedAccountProfileUrl = `https://profile.intra.42.fr/users/${linkedAccountUsername}`;
  else if (linkedAccountProvider === "discord") linkedAccountProfileUrl = ``;
  else if (linkedAccountProvider === "github")
    linkedAccountProfileUrl = `https://github.com/${linkedAccountUsername}`;

  const updatedNewFeedback = {
    ...newFeedback,
    author: {
      ...newFeedback.author,
      linkedAccountProfileUrl: linkedAccountProfileUrl,
    },
  };
  return NextResponse.json({ newFeedback: updatedNewFeedback });
}
