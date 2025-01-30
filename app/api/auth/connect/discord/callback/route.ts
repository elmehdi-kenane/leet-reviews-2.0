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
    return NextResponse.redirect(
      `http://localhost:3000/settings/?error=connect-cancelled`,
    );
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
        provider_provider_account_id: {
          provider: "discord",
          provider_account_id: discordUser.id,
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
      console.log(discordUser);
      const avatar_url = `${DiscordImageBaseUrl}/${discordUser.id}/${discordUser.avatar}.png`;
      await prismaClient.account.create({
        data: {
          provider: "discord",
          type: "oauth2",
          account_type: "CONNECTED",
          avatar: avatar_url,
          username: discordUser.username,
          provider_account_id: discordUser.id,
          userId: authenticatedUser.id,
          access_token: tokens.accessToken,
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://localhost:3000/settings",
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

interface discordUser {
  id: string;
  username: string;
  avatar: string;
}
