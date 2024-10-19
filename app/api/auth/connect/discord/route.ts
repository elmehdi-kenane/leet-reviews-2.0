import { NextResponse } from "next/server";
import { generateState } from "arctic";
import { discord } from "@/lib/providers";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();

  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });

  cookies().set("state", state, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(url);
}
