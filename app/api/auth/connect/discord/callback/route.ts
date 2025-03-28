import { NextRequest, NextResponse } from "next/server";
import { discord, DiscordImageBaseUrl } from "@/lib/providers";
import { cookies } from "next/headers";
import { prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { validateRequest } from "@/lib/auth";

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
        Location: `${process.env.DOMAIN_NAME}/settings`,
        "Set-Cookie": [
          `connection_status=failure; Path=/; Secure; SameSite=Lax`,
          `provider=Discord; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  }
  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordUserResponse = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Cache-Control": "no-cache", // optional, but recommended
        },
      },
    );
    const discordUser: discordUser = await discordUserResponse.json();
    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "discord",
          providerAccountId: discordUser.id,
        },
      },
    });

    if (existingAccount) {
      return NextResponse.json({
        message: "discord account is already connected",
      });
    } else {
      const session = await validateRequest();
      const authenticatedUser = session.user;
      if (!authenticatedUser) {
        return NextResponse.json(
          { error: "User not authenticated" },
          { status: 401 },
        );
      }
      const avatar_url = `${DiscordImageBaseUrl}/${discordUser.id}/${discordUser.avatar}.png`;
      await prismaClient.account.create({
        data: {
          provider: "discord",
          type: "oauth2",
          accountType: "CONNECTED",
          avatar: avatar_url,
          username: discordUser.username,
          providerAccountId: discordUser.id,
          userId: authenticatedUser.id,
          accessToken: tokens.accessToken,
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${process.env.DOMAIN_NAME}/settings`,
        "Set-Cookie": [
          `connection_status=success; Path=/; Secure; SameSite=Lax`,
          `provider=Discord; Path=/; Secure; SameSite=Lax`,
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

interface discordUser {
  id: string;
  username: string;
  avatar: string;
}
