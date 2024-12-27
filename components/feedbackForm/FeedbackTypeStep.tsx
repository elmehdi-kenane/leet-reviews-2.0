import { FormSelectFieldItem, feedbackTypes, FormData } from "@/lib/types";
import { FormSelectOptionField } from "./FormField";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

export type FeedbackTypeStepProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
};

const FeedbackTypeStep: React.FC<FeedbackTypeStepProps> = ({
  errors,
  register,
  watch,
  setValue,
}) => {
  const feedbackType: FormSelectFieldItem = {
    name: "feedbackType",
    step: 1,
    label: "Feedback type",
    error: errors.feedbackType,
    isRequired: true,
    types: feedbackTypes,
  };

  return (
    <FormSelectOptionField
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
