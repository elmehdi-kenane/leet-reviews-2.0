import { NextRequest, NextResponse } from "next/server";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("state")?.value;

  if (!code || !storedState || state !== storedState) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const githubUserId = githubUser.id.toString();
    const githubUsername = githubUser.login;
    const githubFullName = githubUser.name;
    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: githubUserId,
      },
    });
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    await prismaClient.user.create({
      data: {
        id: githubUserId,
        username: githubUsername,
        avatar: githubUser.avatar_url,
        name: githubFullName,
      },
    });

    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "github",
          provider_account_id: githubUserId,
        },
      },
    });
    if (!existingAccount) {
      await prismaClient.account.create({
        data: {
          userId: githubUserId,
          account_type: "AUTH",
          type: "oauth2",
          username: githubUsername,
          provider: "github",
          provider_account_id: githubUserId,
          access_token: tokens.accessToken,
        },
      });
    } else {
      await prismaClient.account.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          access_token: tokens.accessToken,
        },
      });
    }

    const session = await lucia.createSession(githubUserId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
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
}
