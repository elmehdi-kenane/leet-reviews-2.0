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
    authorId: userId,
  };

  for (const [key, value] of formData.entries()) {
    if (value instanceof File || key === "companyLogo") {
      if (value === "undefined") {
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

  const intraProfileUrl = `https://profile.intra.42.fr/users/${
    newFeedback.author.accounts.find(
      (account) =>
        account.provider === "fortyTwo" && account.account_type === "AUTH",
    )?.username
  }`;

  const discordProfileUrl = `${
    newFeedback.author.accounts.find(
      (account) =>
        account.provider === "discord" && account.account_type === "CONNECTED",
    )?.username
  }`;

  const updatedNewFeedback = {
    ...newFeedback,
    author: {
      ...newFeedback.author,
      intraProfileUrl: intraProfileUrl,
      discordProfileUrl: discordProfileUrl,
    },
  };
  return NextResponse.json({ newFeedback: updatedNewFeedback });
}
