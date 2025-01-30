import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { CloudinaryUploadResult } from "../../feedback/create/route";

export async function POST(request: NextRequest) {
  const result = await validateRequest();
  const userId = result.user?.id;
  if (userId === undefined)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  interface FormDataWithBooleans {
    [key: string]: FormDataEntryValue | boolean;
  }
  const formDataValues: FormDataWithBooleans = Object.fromEntries(
    formData.entries(),
  );
  console.log("formDataValues", formDataValues);
  if (formDataValues.avatar && formDataValues.avatar instanceof File) {
    const fileBuffer = Buffer.from(await formDataValues.avatar.arrayBuffer());
    const uploadResult: CloudinaryUploadResult =
      await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user-avatars" },
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
    formDataValues["avatar"] = uploadResult.secure_url;
  }
  if (formDataValues["isFeedbacksHidden"])
    formDataValues["isFeedbacksHidden"] === "true"
      ? (formDataValues["isFeedbacksHidden"] = true)
      : (formDataValues["isFeedbacksHidden"] = false);
  if (formDataValues["isCommentsAndVotesHidden"])
    formDataValues["isCommentsAndVotesHidden"] === "true"
      ? (formDataValues["isCommentsAndVotesHidden"] = true)
      : (formDataValues["isCommentsAndVotesHidden"] = false);

  await prismaClient.user.update({
    where: { id: userId },
    data: formDataValues,
  });

  return NextResponse.json({ message: "information updated successfully" });
}
