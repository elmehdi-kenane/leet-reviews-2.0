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
  const storedAuthAction = cookies().get("authAction")?.value;
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
        Location: `${process.env.DOMAIN_NAME}/auth/sign-in`,
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
    const accountUserId = githubUser.id.toString();
    const githubUsername = githubUser.login;
    const githubFullName = githubUser.name;
    const user =
      githubUser.email === null
        ? null
        : await prismaClient.user.findFirst({
            where: { email: githubUser.email },
          });
    const account =
      user === null
        ? null
        : await prismaClient.account.findFirst({
            where: { userId: user?.id },
          });
    if (
      githubUser.email !== undefined &&
      githubUser.email !== null &&
      account &&
      account.providerAccountId !== accountUserId
    ) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${process.env.DOMAIN_NAME}/auth/${storedAuthAction}`,
          "Set-Cookie": [
            `auth_status=email_already_used; Path=/; Secure; SameSite=Lax`,
            `provider=Google; Path=/; Secure; SameSite=Lax`,
          ].join(", "),
        },
      });
    }

    const existingUser = await prismaClient.account.findFirst({
      where: {
        providerAccountId: accountUserId,
        accountType: "AUTH",
        provider: "github",
      },
    });
    if (existingUser) {
      if (storedAuthAction === "sign-up") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${process.env.DOMAIN_NAME}/auth/${storedAuthAction}`,
            "Set-Cookie": [
              `auth_status=account_already_exist; Path=/; Secure; SameSite=Lax`,
              `provider=Google; Path=/; Secure; SameSite=Lax`,
            ].join(", "),
          },
        });
      }
      const session = await lucia.createSession(existingUser.userId, {});
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
    if (storedAuthAction === "sign-in") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${process.env.DOMAIN_NAME}/auth/${storedAuthAction}`,
          "Set-Cookie": [
            `auth_status=account_no_exist; Path=/; Secure; SameSite=Lax`,
            `provider=Google; Path=/; Secure; SameSite=Lax`,
          ].join(", "),
        },
      });
    }
    const userEmail =
      githubUser.email !== undefined && githubUser.email !== null
        ? githubUser.email
        : githubUsername;
    // try {
    const newUser = await prismaClient.user.create({
      data: {
        username: githubUsername,
        avatar: githubUser.avatar_url,
        email: userEmail,
        name: githubFullName,
        bio: "I'm just a chill guy",
        accountDisplayedWithFeedbacks: "github",
      },
    });
    // } catch (e) {
    //   console.log("e", e);
    // }

    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: accountUserId,
        },
      },
    });
    if (!existingAccount) {
      await prismaClient.account.create({
        data: {
          userId: newUser.id,
          accountType: "AUTH",
          type: "oauth2",
          username: githubUsername,
          avatar: githubUser.avatar_url,
          provider: "github",
          providerAccountId: accountUserId,
          accessToken: tokens.accessToken,
        },
      });
    } else {
      await prismaClient.account.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          accessToken: tokens.accessToken,
        },
      });
    }

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${process.env.DOMAIN_NAME}/home`,
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
