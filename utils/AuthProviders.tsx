import GitHubProvider from "next-auth/providers/github";
import FortyTwoProvider from "next-auth/providers/42-school";

export const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),
  FortyTwoProvider({
    clientId: process.env.FORTY_TWO_CLIENT_ID!,
    clientSecret: process.env.FORTY_TWO_CLIENT_SECRET!,
    authorization: {
      params: {
        grant_type: "authorization_code",
        prompt: "consent",
        scope: "public",
        access_type: "offline",
      },
    },
  }),
];
