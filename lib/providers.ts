import { GitHub } from "arctic";
import { FortyTwo } from "arctic";
import { Discord } from "arctic";

// optional
//   redirectURI, // required when multiple redirect URIs are defined
//   enterpriseDomain: "https://example.com", // the base URL of your GitHub Enterprise Server instance

// ================ AUTH-PROVIDERS ================
export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
);

const fortyTwoRedirectURI =
  "http://localhost:3000/api/auth/login/forty-two/callback";
export const fortyTwo = new FortyTwo(
  process.env.FORTY_TWO_CLIENT_ID!,
  process.env.FORTY_TWO_CLIENT_SECRET!,
  fortyTwoRedirectURI,
);

// ================ CONNECT-PROVIDERS ================
export const DiscordImageBaseUrl: string =
  "https://cdn.discordapp.com/avatars" as string; // /user_id/user_avatar.png *
const discordRedirectURI =
  "http://localhost:3000/api/auth/connect/discord/callback";
export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID!,
  process.env.DISCORD_CLIENT_SECRET!,
  discordRedirectURI,
);
