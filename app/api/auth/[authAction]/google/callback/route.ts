import { NextRequest } from "next/server";
import { google } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const storedCodeVerifier = cookies().get("google_code_verifier")?.value;
  const storedAuthAction = cookies().get("authAction")?.value;
  cookies().delete("authAction");

  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieStore = cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  console.log("==================== 1 =====================");

  if (
    !code ||
    !storedCodeVerifier ||
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
          `provider=Google; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  }
  try {
    console.log("==================== 2 =====================");
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser: GoogleUser = await googleUserResponse.json();
    console.log(
      "==================== 3 =====================",
      "googleUser",
      googleUser,
    );
    const accountUserId = googleUser.id.toString();
    const googleUsername = googleUser.name.replace(/\s+/g, "_");
    const googleFullName = googleUser.name;
    let account = null;
    try {
      const user = await prismaClient.user.findFirst({
        where: { email: googleUser.email },
      });
      console.log("==================== 4 =====================", "user", user);
      account =
        user === null
          ? null
          : await prismaClient.account.findFirst({
              where: { userId: user?.id },
            });
    } catch (error) {
      console.log(error);
    }
    console.log("==================== 5 =====================");
    if (
      googleUser.email !== undefined &&
      googleUser.email !== null &&
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
        provider: "google",
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
    const newUser = await prismaClient.user.create({
      data: {
        username: googleUsername,
        avatar: googleUser.picture,
        email: googleUser.email,
        name: googleFullName,
        bio: "I'm just a chill guy",
        accountDisplayedWithFeedbacks: "google",
      },
    });
    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "google",
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
          username: googleUsername,
          avatar: googleUser.picture,
          provider: "google",
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
        Location: `${process.env.DOMAIN_NAME}/settings`,
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

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}
