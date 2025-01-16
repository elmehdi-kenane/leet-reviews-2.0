import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("data request", data.feedback);
  const companyLogoFile = data.feedback.companyLogo as File;
  console.log("data.feedback.companyLogo file", companyLogoFile);
  await prismaClient.feedback.create({
    data: {
      feedbackType: data.feedback.feedbackType.name,
      trustScore: data.feedback.trustScore,
      companyName: data.feedback.companyName,
      companyLogo:
        Object.keys(data.feedback.companyLogo).length === 0
          ? ""
          : data.feedback.companyLogo,
      companyLinkedIn: data.feedback.companyLinkedIn,
      companyLocation: data.feedback.companyLocation,
      jobStatus: data.feedback.jobStatus,
      workingType: data.feedback.workingType,
      contractType: data.feedback.contractType,
      jobProgressType: data.feedback.jobProgressType,
      experienceRate: data.feedback.experienceRate,
      feedbackComment: data.feedback.feedbackComment,
    },
  });
  return NextResponse.json({ message: "feedback saved" });
}
