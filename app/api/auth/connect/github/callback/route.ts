import { NextRequest, NextResponse } from "next/server";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";
import { prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { validateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const storedState = cookies().get("state")?.value;

  if (
    !code ||
    !storedState ||
    state !== storedState ||
    error === "access_denied"
  ) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://localhost:3000/settings",
        "Set-Cookie": [
          `auth_status=failure; Path=/; Secure; SameSite=Lax`,
          `provider=Github; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "discord",
          provider_account_id: githubUser.id,
        },
      },
    });
    if (existingUser) {
      return NextResponse.json({
        message: "github account is already connected",
      });
    }
    const session = await validateRequest();
    const authenticatedUser = session.user;
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    await prismaClient.account.create({
      data: {
        provider: "discord",
        type: "oauth2",
        account_type: "CONNECTED",
        avatar: githubUser.avatar_url,
        username: githubUser.login,
        provider_account_id: githubUser.id,
        userId: authenticatedUser.id,
        access_token: tokens.accessToken,
      },
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://localhost:3000/settings",
        "Set-Cookie": [
          `connection_status=success; Path=/; Secure; SameSite=Lax`,
          `provider=Github; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    console.log(e);

    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}
