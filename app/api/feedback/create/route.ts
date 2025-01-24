import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { FeedbackCreateInput } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authorAvatar = result.user?.avatar ?? "";
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  const authorName = user?.name ?? "";

  const userAccounts = await prismaClient.account.findMany({
    where: {
      userId: userId,
    },
  });
  let authorIntraProfile = "";
  const authorDiscordProfile = "";
  for (let index = 0; index < userAccounts.length; index++) {
    if (
      userAccounts[index].account_type === "AUTH" &&
      userAccounts[index].provider === "fortyTwo"
    )
      authorIntraProfile = `https://profile.intra.42.fr/users/${userAccounts[index].username}`;
  }

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
              }
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
  console.log("newFeedback", newFeedback);
  return NextResponse.json({ newFeedback: newFeedback });
}
