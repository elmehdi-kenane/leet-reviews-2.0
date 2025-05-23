import { PrismaClient } from "@prisma/client";
import { voteInterface } from "./types";
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
  [type: string]: number | string | Date | voteInterface[];
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
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}
