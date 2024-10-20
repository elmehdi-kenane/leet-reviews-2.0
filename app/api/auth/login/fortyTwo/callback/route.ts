import { NextRequest, NextResponse } from "next/server";
import { fortyTwo } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Validate the state cookie
  const storedState = cookies().get("state")?.value;

  if (!code || !storedState || state !== storedState) {
    // 400 Bad Request
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  try {
    const tokens = await fortyTwo.validateAuthorizationCode(code);
    const fortyTwoUserResponse = await fetch("https://api.intra.42.fr/v2/me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const fortyTwoUser: fortyTwoUser = await fortyTwoUserResponse.json();

    const userId = fortyTwoUser.id.toString();
    const fortyTwoUsername = fortyTwoUser.login;
    const fortyTwoFullName = fortyTwoUser.usual_full_name;

    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: userId,
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
        id: userId,
        username: fortyTwoUsername,
        name: fortyTwoFullName,
        email: fortyTwoUser.email,
        avatar: fortyTwoUser.image.link,
      },
    });

    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "fortyTwo",
          provider_account_id: userId,
        },
      },
    });
    if (!existingAccount) {
      await prismaClient.account.create({
        data: {
          userId: userId,
          account_type: "AUTH",
          type: "oauth2",
          username: fortyTwoUsername,
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

    const session = await lucia.createSession(userId, {});
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
