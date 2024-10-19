import { NextResponse } from "next/server";
import { generateState } from "arctic";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  console.log("state in github route:", state);

  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });

  cookies().set("state", state, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
  });
  return NextResponse.redirect(url);
}
