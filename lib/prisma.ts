import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;

export interface FeedbackCreateInput {
  [type: string]: number | string | Date;
  feedbackType: string;
  trustScore: number;
  companyName: string;
  companyLogo: string;
  companyLinkedIn: string;
  companyLocation: string;
  jobStatus: string;
  workingType: string;
  contractType: string;
  jobProgressType: string;
  experienceRate: number;
  authorComment: string;
  authorAvatar: string;
  authorName: string;
  authorIntraProfile: string;
  authorDiscordProfile: string;
  createdAt: Date;
  userId: string;
}
