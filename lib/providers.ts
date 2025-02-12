import { Discord, FortyTwo, GitHub, LinkedIn } from "arctic";

// optional
//   redirectURI, // required when multiple redirect URIs are defined
//   enterpriseDomain: "https://example.com", // the base URL of your GitHub Enterprise Server instance

// ================ AUTH-PROVIDERS ================
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);

const fortyTwoRedirectURI = `${process.env.DOMAIN_NAME}/api/auth/login/forty-two/callback`;
export const fortyTwo = new FortyTwo(
  process.env.FORTY_TWO_CLIENT_ID!,
  process.env.FORTY_TWO_CLIENT_SECRET!,
  fortyTwoRedirectURI,
);

// ================ CONNECT-PROVIDERS ================
export const DiscordImageBaseUrl: string =
  "https://cdn.discordapp.com/avatars" as string; // /user_id/user_avatar.png *
const discordRedirectURI = `${process.env.DOMAIN_NAME}/api/auth/connect/discord/callback`;
export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
  discordRedirectURI,
);

const linkedInRedirectURI = `${process.env.DOMAIN_NAME}/api/auth/connect/linkedIn/callback`;
export const linkedIn = new LinkedIn(
  process.env.LINKEDIN_CLIENT_ID!,
  process.env.LINKEDIN_CLIENT_SECRET!,
  linkedInRedirectURI,
);
