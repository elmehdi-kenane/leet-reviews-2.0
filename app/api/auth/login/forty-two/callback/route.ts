import { NextRequest } from "next/server";
import { fortyTwo } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Validate the state cookie
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
          `provider=FortyTwo; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  }
  try {
    const tokens = await fortyTwo.validateAuthorizationCode(code);
    const fortyTwoUserResponse = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const fortyTwoUser: fortyTwoUser = await fortyTwoUserResponse.json();

    const accountUserId = fortyTwoUser.id.toString();
    const fortyTwoUsername = fortyTwoUser.login;
    const fortyTwoFullName = fortyTwoUser.usual_full_name;
    const existingUser = await prismaClient.account.findFirst({
      where: {
        provider_account_id: accountUserId,
        account_type: "AUTH",
        provider: "fortyTwo",
      },
    });
    if (existingUser) {
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
    const userEmail =
      fortyTwoUser.email !== undefined ? fortyTwoUser.email : "";
    const newUser = await prismaClient.user.create({
      data: {
        username: fortyTwoUsername,
        name: fortyTwoFullName,
        email: userEmail,
        avatar: fortyTwoUser.image.link,
        bio: "I'm just a chill guy",
        accountDisplayedWithFeedbacks: "fortyTwo",
      },
    });

    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "fortyTwo",
          provider_account_id: accountUserId,
        },
      },
    });
    if (!existingAccount) {
      await prismaClient.account.create({
        data: {
          userId: newUser.id,
          account_type: "AUTH",
          type: "oauth2",
          username: fortyTwoUsername,
          avatar: fortyTwoUser.image.link,
          provider: "fortyTwo",
          provider_account_id: fortyTwoUser.id.toString(),
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
        Location: "http://localhost:3000/home",
        "Set-Cookie": [
          `auth_status=success; Path=/; Secure; SameSite=Lax`,
          `provider=FortyTwo; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      console.log("Error", e);

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

interface image {
  link: string;
}

interface fortyTwoUser {
  id: string;
  login: string;
  usual_full_name: string;
  email: string;
  image: image;
}
