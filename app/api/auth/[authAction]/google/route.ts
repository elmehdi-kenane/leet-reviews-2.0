import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/providers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { authAction: string } },
) {
  const { authAction } = params;
  if (authAction !== "sign-up" && authAction !== "sign-in")
    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  const cookieStore = cookies();
  cookieStore.set("authAction", authAction, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  const state = generateState();
  const codeVerifier = generateCodeVerifier(); // Generate the codeVerifier

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["https://www.googleapis.com/auth/userinfo.email", "profile"],
  });

  cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  cookieStore.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  const locationUrl = url.toString();
  //   console.log("Generating Google auth URL...", locationUrl);

  return new Response(null, {
    status: 302,
    headers: {
      Location: locationUrl,
    },
  });
}
