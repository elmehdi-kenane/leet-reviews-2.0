import {
  FormInputFieldItem,
  FormSelectFieldItem,
  FormData,
  workingTypes,
  contractTypes,
  jobProgressTypes,
} from "@/lib/types";
import { FormInputField, FormSelectOptionField } from "./FormField";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";

export type JobInfosStepProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
};

const JobInfosStep: React.FC<JobInfosStepProps> = ({
  errors,
  register,
  setValue,
}) => {
  const jobStatusField: FormInputFieldItem = {
    type: "text",
    name: "jobStatus",
    placeholder: "Job status",
    error: errors.jobStatus,
  };
  const jobInfosFields: FormSelectFieldItem[] = [
    {
      name: "workingType",
      label: "Working type",
      error: errors.workingType,
      types: workingTypes,
      step: 3,
    },
    {
      name: "contractType",
      label: "Contract type",
      error: errors.contractType,
      types: contractTypes,
      step: 3,
    },
    {
      name: "jobProgressType",
      label: "JobProgress type",
      error: errors.jobProgressType,
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
      />
      {jobInfosFields.map((item, index) => {
        return (
          <FormSelectOptionField
            key={index}
            name={item.name}
            label={item.label}
            register={register}
            error={item.error}
            setValue={setValue}
            types={item.types}
            step={item.step}
          ></FormSelectOptionField>
        );
      })}
    </>
  );
};

export default JobInfosStep;
