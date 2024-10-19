import { NextRequest, NextResponse } from "next/server";
import { github } from "@/lib/providers";
import { cookies } from "next/headers";
import { lucia, prismaClient } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";

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
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: githubUser.id,
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

    const userId = generateIdFromEntropySize(10); // 16 characters long

    await prismaClient.user.create({
      data: {
        id: githubUser.id, // Assuming `userId` is already defined
        username: githubUser.login, // GitHub username
        avatar: githubUser.avatar_url,
      },
    });
    console.log("after create user on prisma");

    const existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider: "github",
          provider_account_id: githubUser.id.toString(), // Convert ID to string
        },
      },
    });
    console.log("githubUser", githubUser);
    if (!existingAccount) {
      await prismaClient.account.create({
        data: {
          userId: userId,
          username: githubUser.login,
          account_type: "AUTH",
          type: "oauth2",
          provider: "github",
          provider_account_id: githubUser.id.toString(),
          access_token: tokens.accessToken,
        },
      });
    } else {
      // Optionally, update the existing account with new tokens
      await prismaClient.account.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          access_token: tokens.accessToken,
          // Update other fields as needed
        },
      });
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // console.log("before create session on prisma");
    // // Create a session record in Prisma
    // await prismaClient.session.create({
    //     data: {
    //         id: session.id,
    //         sessionToken: session.id,
    //         userId: userId,
    //         expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    //     },
    // });
    // console.log("after create session on prisma");

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
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
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
}
