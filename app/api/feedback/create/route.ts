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
  //   console.log("request", request);
  const formData = await request.formData();
  //   console.log("formData:", formData);
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
    feedbackComment: "",
    createdAt: createAt,
    userId: userId,
  };

  for (const [key, value] of formData.entries()) {
    if (value instanceof File || key === "companyLogo") {
      if (value === "undefined") {
        console.log("value undefined");
        data[key] = "/default.jpeg";
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

  await prismaClient.feedback.create({
    data: data,
  });
  return NextResponse.json({ message: "feedback saved" });
}
