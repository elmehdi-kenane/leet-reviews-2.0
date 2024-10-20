import { NextResponse } from "next/server";
import { generateState } from "arctic";
import { fortyTwo } from "@/lib/providers";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();

  const url = await fortyTwo.createAuthorizationURL(state, {
    scopes: ["public"],
  });

  cookies().set("state", state, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });
  return NextResponse.redirect(url);
}
