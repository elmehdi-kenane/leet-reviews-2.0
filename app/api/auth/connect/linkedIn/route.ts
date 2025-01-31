import { NextResponse } from "next/server";
import { generateState } from "arctic";
import { linkedIn } from "@/lib/providers";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();

  const url = await linkedIn.createAuthorizationURL(state, {
    scopes: ["profile", "email"],
  });

  cookies().set("state", state, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(url);
}
