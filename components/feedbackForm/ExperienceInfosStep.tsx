import {
  FormInputFieldItem,
  experienceRateTypes,
  FormDataRhf,
  FormSelectFieldItem,
} from "@/lib/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormInputField, FormSelectOptionField } from "./FormField";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormResetField,
} from "react-hook-form";

export type ExperienceInfosStepProps = {
  setValue: UseFormSetValue<FormDataRhf>;
  register: UseFormRegister<FormDataRhf>;
  resetField: UseFormResetField<FormDataRhf>;
  isResetFields: boolean[];
  setIsResetFields: Dispatch<SetStateAction<boolean[]>>;
  errors: FieldErrors<FormDataRhf>;
  watch: UseFormWatch<FormDataRhf>;
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
};

const ExperienceInfosStep: React.FC<ExperienceInfosStepProps> = ({
  errors,
  register,
  resetField,
  isResetFields,
  setIsResetFields,
  setValue,
  setTrustScore,
  trustScore,
  watch,
}) => {
  const experienceRate: FormSelectFieldItem = {
    name: "experienceRate",
    label: "Experience rate",
    step: 4,
    error: errors.experienceRate,
    isRequired: true,
    types: experienceRateTypes,
  };
  const experienceComment: FormInputFieldItem = {
    type: "text",
    placeholder: "Feedback comment",
    label: "Feedback comment",
    name: "authorComment",
    isRequired: true,
    error: errors.companyName,
  };
  useEffect(() => {
    if (isResetFields[2]) {
      resetField(experienceRate.name, { defaultValue: undefined });
      resetField(experienceComment.name, { defaultValue: "" });
      setIsResetFields([false, false, false]);
    }
  }, [isResetFields]);
  return (
    <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
      <FormSelectOptionField
        setTrustScore={setTrustScore}
        trustScore={trustScore}
        watch={watch}
        name={experienceRate.name}
        label={experienceRate.label}
        register={register}
        isRequired={true}
        error={experienceRate.error}
        setValue={setValue}
        types={experienceRate.types}
        currentStep={experienceRate.step}
      ></FormSelectOptionField>
      <FormInputField
        setTrustScore={setTrustScore}
        trustScore={trustScore}
        setValue={setValue}
        watch={watch}
        type={experienceComment.type}
        placeholder={experienceComment.placeholder}
        label={experienceComment.label}
        inputName={experienceComment.name}
        isRequired={false}
        register={register}
        error={errors.authorComment}
      />
    </div>
  );
};

export default ExperienceInfosStep;
