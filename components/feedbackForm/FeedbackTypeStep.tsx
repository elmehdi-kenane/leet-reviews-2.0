import { FormSelectFieldItem, feedbackTypes, FormData } from "@/lib/types";
import { FormSelectOptionField } from "./FormField";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";

export type FeedbackTypeStepProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
};

const FeedbackTypeStep: React.FC<FeedbackTypeStepProps> = ({
  errors,
  register,
  setValue,
}) => {
  const feedbackType: FormSelectFieldItem = {
    name: "feedbackType",
    step: 1,
    label: "Feedback type",
    error: errors.feedbackType?.name,
    types: feedbackTypes,
  };
  return (
    <FormSelectOptionField
      name={feedbackType.name}
      label={feedbackType.label}
      register={register}
      error={feedbackType.error}
      setValue={setValue}
      types={feedbackType.types}
      step={feedbackType.step}
    ></FormSelectOptionField>
  );
};

export default FeedbackTypeStep;
