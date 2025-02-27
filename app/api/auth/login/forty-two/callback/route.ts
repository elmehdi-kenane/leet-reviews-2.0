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

    console.log("==============>");
    const accountUserId = fortyTwoUser.id.toString();
    const fortyTwoUsername = fortyTwoUser.login;
    const fortyTwoFullName = fortyTwoUser.usual_full_name;

    let existingAccount = await prismaClient.account.findFirst({
      where: {
        username: fortyTwoUsername,
        accountType: "AUTH",
        provider: "fortyTwo",
      },
    });

    console.log("Existing account found:", existingAccount);

    existingAccount = await prismaClient.account.findFirst({
      where: {
        username: fortyTwoUsername,
        accountType: "AUTH",
        provider: "fortyTwo",
      },
    });
    if (existingAccount) {
      const existingUser = await prismaClient.user.findFirst({
        where: {
          username: fortyTwoUsername,
        },
      });

      if (existingUser) {
        const newUserId = crypto.randomUUID();
        try {
          await prismaClient.$transaction(async (prisma) => {
            // Ensure newUserId exists (optional, to avoid breaking the database)
            const userExists = await prisma.user.findUnique({
              where: {
                id: newUserId,
              },
            });

            if (userExists) {
              throw new Error(`User with ID ${newUserId} already exist`);
            }

            // Create a new user record with newUserId (optional, depends on use case)
            await prisma.user.create({
              data: {
                id: newUserId,
                name: fortyTwoUser.usual_full_name,
                email: "xd",
                username: fortyTwoUser.login,
                avatar: fortyTwoUser.image.link,
                bio: "I'm just a chill guy",
                accountDisplayedWithFeedbacks: "fortyTwo",
              },
            });

            // Now update the Account record to reference newUserId
            await prisma.account.update({
              where: {
                id: existingAccount?.id,
              },
              data: {
                userId: newUserId, // Link the account to the new user ID
                providerAccountId: accountUserId, // Optionally update providerAccountId
              },
            });
            console.log(
              `User ID updated and account linked with new user ID ${newUserId}`,
            );

            // Optionally, delete the old user record if needed
            await prisma.user.delete({
              where: {
                id: existingUser.id,
              },
            });
            await prisma.user.update({
              where: {
                id: newUserId,
              },
              data: {
                email: fortyTwoUser.email,
              },
            });
            console.log(`Old user ID ${existingUser.id} deleted`);
          });
        } catch (error) {
          console.error(
            "Error during user ID update and account linking:",
            error,
          );
          // Optionally, rethrow the error if you want to propagate it
          throw error;
        }
        const session = await lucia.createSession(newUserId, {});
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

    existingAccount = await prismaClient.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "fortyTwo",
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
          username: fortyTwoUsername,
          avatar: fortyTwoUser.image.link,
          provider: "fortyTwo",
          providerAccountId: fortyTwoUser.id.toString(),
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
          `provider=FortyTwo; Path=/; Secure; SameSite=Lax`,
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
