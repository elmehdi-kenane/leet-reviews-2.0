import { NextRequest } from "next/server";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

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
        Location: "http://localhost:3000/auth/sign-in",
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
          Location: "/home",
        },
      });
    }
    const createAt = new Date();
    const userEmail = githubUser.email !== undefined ? githubUser.email : "";
    await prismaClient.user.create({
      data: {
        id: githubUserId,
        username: githubUsername,
        avatar: githubUser.avatar_url,
        email: userEmail,
        name: githubFullName,
        bio: "I'm just a chill guy",
        createdAt: createAt,
        accountDisplayedWithFeedbacks: "github",
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
          avatar: githubUser.avatar_url,
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
        Location: "http://localhost:3000/home",
        "Set-Cookie": [
          `auth_status=success; Path=/; Secure; SameSite=Lax`,
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
