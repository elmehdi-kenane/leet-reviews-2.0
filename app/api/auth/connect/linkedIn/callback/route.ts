import { NextRequest, NextResponse } from "next/server";
import { linkedIn } from "@/lib/providers";
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
        Location: "http://localhost:3000/settings",
        "Set-Cookie": [
          `connection_status=failure; Path=/; Secure; SameSite=Lax`,
          `provider=LinkedIn; Path=/; Secure; SameSite=Lax`,
        ].join(", "),
      },
    });
  }
  try {
    const tokens = await linkedIn.validateAuthorizationCode(code);
    const linkedInUserResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Cache-Control": "no-cache",
        },
      },
    );
    const linkedInUser: linkedInUser = await linkedInUserResponse.json();
    console.log("linkedInUser", linkedInUser);
    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "linkedIn",
          provider_account_id: linkedInUser.sub,
        },
      },
    });

    if (existingAccount) {
      return NextResponse.json({
        message: "linkedIn account is already connected",
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
      const avatar_url = `${linkedInUser.picture}`;
      await prismaClient.account.create({
        data: {
          provider: "linkedIn",
          type: "oauth2",
          account_type: "CONNECTED",
          avatar: avatar_url,
          username: linkedInUser.name,
          provider_account_id: linkedInUser.sub,
          userId: authenticatedUser.id,
          access_token: tokens.accessToken,
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://localhost:3000/settings",
        "Set-Cookie": [
          `connection_status=success; Path=/; Secure; SameSite=Lax`,
          `provider=LinkedIn; Path=/; Secure; SameSite=Lax`,
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

interface linkedInUser {
  sub: string;
  name: string;
  picture: string;
}
