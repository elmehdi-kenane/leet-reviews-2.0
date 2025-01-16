import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { FeedbackCreateInput } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  //   console.log("request", request);
  const formData = await request.formData();
  //   console.log("formData:", formData);
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    userId: userId,
  };

  for (const [key, value] of formData.entries()) {
    const keyFormData = key;
    const valueFormData = value;
    if (keyFormData === key) {
      if (valueFormData instanceof File || keyFormData === "companyLogo") {
        if (valueFormData === "undefined") {
          console.log("valueFormData undefined");
          data[key] = "/default.jpeg";
        } else {
          await cloudinary.v2.uploader.upload("hat.jpg", {
            use_filename: true,
          });

          data[key] = "uploaded-file-url";
        }
      } else {
        const numericValue = parseFloat(valueFormData);
        if (Number.isNaN(numericValue)) data[key] = valueFormData;
        else data[key] = parseFloat(valueFormData);
      }
    }
  }

  await prismaClient.feedback.create({
    data: data,
  });
  return NextResponse.json({ message: "feedback saved" });
}
