import {
  FieldError,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

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

export type FormData = {
  feedbackType: validFeedbackType;
  companyName: string;
  companyLogo: string;
  companyLinkedIn: string;
  companyLocation: string;

  jobStatus: string;
  workingType: validWorkingType;
  contractType: validContractType;
  jobProgressType: validJobProgressType;

  experienceRate: validExperienceRateType;
  feedbackComment: string;
};

export type FormInputFieldProps = {
  type: string;
  placeholder: string;
  name: ValidInputFieldName;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    feedbackComment: number;
  };
  valueAsNumber?: boolean;
  isRequired: boolean;
  setTrustScore: Dispatch<
    SetStateAction<{
      feedbackType: number;
      companyLogo: number;
      companyLinkedIn: number;
      companyLocation: number;
      feedbackComment: number;
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
    feedbackComment: number;
  };
  setValue: UseFormSetValue<FormData>;
  setTrustScore: Dispatch<
    SetStateAction<{
      feedbackType: number;
      companyLogo: number;
      companyLinkedIn: number;
      companyLocation: number;
      feedbackComment: number;
    }>
  >;
  types: T[]; // The options, passed as an array of strings
  register: UseFormRegister<FormData>;
  isRequired: boolean;
  error: FieldError | undefined;
  watch: UseFormWatch<FormData>;
};

export type ValidInputFieldName =
  | "companyName"
  | "companyLogo"
  | "companyLinkedIn"
  | "companyLocation"
  | "jobStatus"
  | "feedbackComment";

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
  error: FieldError | undefined;
};
