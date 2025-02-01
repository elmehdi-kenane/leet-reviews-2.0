import {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { account_type, provider } from "@prisma/client";

// company information's
// company name
// company logo
// company linkedin
// company location

// job information's
// job status
// working type: On-site - Remote - Hybrid
// contract type: Internship - CDD - CDI - Freelance
// progress job: Finished - In-progress

// job feedback
// experience rate
// feedback comment

// Rhf = React Hook Form :)
export type FormDataRhf = {
  feedbackType: validFeedbackType;
  companyName: string;
  companyLogo: File;
  companyLinkedIn: string;
  companyLocation: string;

  jobStatus: string;
  workingType: validWorkingType;
  contractType: validContractType;
  jobProgressType: validJobProgressType;

  experienceRate: validExperienceRateType;
  authorComment: string;
};

export type FormInputFieldProps = {
  type: string;
  placeholder: string;
  label: string;
  watch: UseFormWatch<FormDataRhf>;
  setValue: UseFormSetValue<FormDataRhf>;
  inputName: ValidInputFieldName;
  register: UseFormRegister<FormDataRhf>;
  error: FieldError | undefined;
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    authorComment: number;
  };
  valueAsNumber?: boolean;
  isRequired: boolean;
  setTrustScore: Dispatch<
    SetStateAction<{
      feedbackType: number;
      companyLogo: number;
      companyLinkedIn: number;
      companyLocation: number;
      authorComment: number;
    }>
  >;
};

export type validFeedbackType =
  | {
      name: string;
      description: string;
    }
  | {
      name: string;
      description: string;
    };
export const feedbackTypes: validFeedbackType[] = [
  {
    name: "Publicly",
    description:
      "Your feedback will display your profile information, and contribute to your",
  },
  {
    name: "Anonymously",
    description:
      "Your feedback will appear without any identifying details, and it will not affect the overall",
  },
];

export type validWorkingType = "On-site" | "Remote" | "Hybrid";
export const workingTypes: validWorkingType[] = ["On-site", "Remote", "Hybrid"];

export type validContractType = "Internship" | "CDD" | "CDI" | "Freelance";
export const contractTypes: validContractType[] = [
  "Internship",
  "CDD",
  "CDI",
  "Freelance",
];

export type validJobProgressType = "Finished" | "In-progress";
export const jobProgressTypes: validJobProgressType[] = [
  "Finished",
  "In-progress",
];

// nb: svg files
//   | "VeryPoor"
//   | "Poor"
//   | "Average"
//   | "Good"
//   | "Excellent";

export type validExperienceRateType = 1 | 2 | 3 | 4 | 5;
export const experienceRateTypes: validExperienceRateType[] = [1, 2, 3, 4, 5];

export type FormSelectFieldProps<
  T extends { type?: string; description?: string } | string | number,
> = {
  label: string;
  currentStep: number;
  name: ValidSelectFieldName;
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    authorComment: number;
  };
  setValue: UseFormSetValue<FormDataRhf>;
  setTrustScore: Dispatch<
    SetStateAction<{
      feedbackType: number;
      companyLogo: number;
      companyLinkedIn: number;
      companyLocation: number;
      authorComment: number;
    }>
  >;
  types: T[]; // The options, passed as an array of strings
  register: UseFormRegister<FormDataRhf>;
  isRequired: boolean;
  error: FieldError | undefined;
  watch: UseFormWatch<FormDataRhf>;
};

export type ValidInputFieldName =
  | "companyName"
  | "companyLogo"
  | "companyLinkedIn"
  | "companyLocation"
  | "jobStatus"
  | "authorComment";

export type ValidSelectFieldName =
  | "feedbackType"
  | "workingType"
  | "contractType"
  | "jobProgressType"
  | "experienceRate";

export type FormSelectFieldItem = {
  name: ValidSelectFieldName;
  isRequired: boolean;
  label: string;
  step: number;
  error: FieldError | undefined;
  types: (
    | validWorkingType
    | validContractType
    | validJobProgressType
    | validFeedbackType
    | validExperienceRateType
  )[];
};

export type FormInputFieldItem = {
  type: string;
  isRequired: boolean;
  name: ValidInputFieldName;
  placeholder: string;
  label: string;
  error: FieldError | undefined;
};

export interface employmentDetailInterface {
  icon: string;
  text: string;
}

export interface voteInterface {
  id: string;
  feedbackId: string;
  authorId: string;
  isUp: boolean;
}

export interface commentAuthorInterface {
  id: string;
  name: string;
  avatar: string;
}

export interface commentInterface {
  id: string;
  feedbackId: string;
  authorId: string;
  text: string;
  createdAt: string;
  author: commentAuthorInterface;
}

export interface feedbackAuthorAccountInterface {
  provider: provider;
  username: string;
  account_type: account_type;
}

export interface feedbackAuthorInterface {
  id: string;
  username: string;
  name: string;
  avatar: string;
  linkedAccountProfileUrl: string;
  accountDisplayedWithFeedbacks: string;
}

export interface saveInterface {
  id: string;
  authorId: string;
  feedbackId: string;
  createdAt: string;
}

export interface FeedbackInterface {
  experienceRate: number;
  trustScore: number;
  id: string;
  companyLogo: string;
  feedbackType: string;
  companyName: string;
  companyLinkedIn: string;
  jobStatus: string;
  userId: string;
  authorComment: string;
  author: feedbackAuthorInterface;
  createdAt: string;
  workingType: string;
  contractType: string;
  companyLocation: string;
  jobProgressType: string;
  employmentDetail: employmentDetailInterface[];
  saves: saveInterface[];
  votes: voteInterface[];
  comments: commentInterface[];
}
