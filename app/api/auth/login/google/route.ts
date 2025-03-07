import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/providers";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier(); // Generate the codeVerifier

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["https://www.googleapis.com/auth/userinfo.email", "profile"],
  });

  const cookieStore = cookies();
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
  console.log("Generating Google auth URL...", locationUrl);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
