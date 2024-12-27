import {
  FormInputFieldItem,
  FormSelectFieldItem,
  FormData,
  workingTypes,
  contractTypes,
  jobProgressTypes,
} from "@/lib/types";
import { FormInputField, FormSelectOptionField } from "./FormField";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

export type JobInfosStepProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
};

const JobInfosStep: React.FC<JobInfosStepProps> = ({
  errors,
  register,
  setValue,
  watch,
}) => {
  const jobStatusField: FormInputFieldItem = {
    type: "text",
    name: "jobStatus",
    placeholder: "Job status",
    isRequired: true,
    error: errors.jobStatus,
  };
  const jobInfosFields: FormSelectFieldItem[] = [
    {
      name: "workingType",
      label: "Working type",
      error: errors.workingType,
      isRequired: true,
      types: workingTypes,
      step: 3,
    },
    {
      name: "contractType",
      label: "Contract type",
      error: errors.contractType,
      isRequired: true,
      types: contractTypes,
      step: 3,
    },
    {
      name: "jobProgressType",
      label: "Job progress",
      error: errors.jobProgressType,
      isRequired: true,
      types: jobProgressTypes,
      step: 3,
    },
  ];
  return (
    <>
      <FormInputField
        type={jobStatusField.type}
        placeholder={jobStatusField.placeholder}
        name={jobStatusField.name}
        register={register}
        error={jobStatusField.error}
        isRequired={jobStatusField.isRequired}
      />
      {jobInfosFields.map((item, index) => {
        return (
          <FormSelectOptionField
            key={index}
            name={item.name}
            label={item.label}
            isRequired={item.isRequired}
            register={register}
            error={item.error}
            setValue={setValue}
            types={item.types}
            currentStep={item.step}
            watch={watch}
          ></FormSelectOptionField>
        );
      })}
    </>
  );
};

export default JobInfosStep;
