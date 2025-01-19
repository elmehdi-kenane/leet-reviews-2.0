import { FormSelectFieldItem, feedbackTypes, FormDataRhf } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { FormSelectOptionField } from "./FormField";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

export type FeedbackTypeStepProps = {
  register: UseFormRegister<FormDataRhf>;
  errors: FieldErrors<FormDataRhf>;
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
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    authorComment: number;
  };
  watch: UseFormWatch<FormDataRhf>;
};

const FeedbackTypeStep: React.FC<FeedbackTypeStepProps> = ({
  errors,
  register,
  watch,
  setValue,
  setTrustScore,
  trustScore,
}) => {
  const feedbackType: FormSelectFieldItem = {
    name: "feedbackType",
    step: 1,
    label: "Feedback type",
    error: errors.feedbackType?.description,
    isRequired: true,
    types: feedbackTypes,
  };

  return (
    <FormSelectOptionField
      trustScore={trustScore}
      setTrustScore={setTrustScore}
      name={feedbackType.name}
      label={feedbackType.label}
      isRequired={feedbackType.isRequired}
      register={register}
      error={feedbackType.error}
      setValue={setValue}
      types={feedbackType.types}
      currentStep={feedbackType.step}
      watch={watch}
    ></FormSelectOptionField>
  );
};

export default FeedbackTypeStep;
