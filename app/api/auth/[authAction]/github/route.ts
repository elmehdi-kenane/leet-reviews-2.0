import { NextResponse } from "next/server";
import { generateState } from "arctic";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";

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
