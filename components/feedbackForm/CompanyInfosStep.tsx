import { FormInputFieldItem, FormData } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { FormInputField } from "./FormField";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

export type CompanyInfosStepProps = {
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setTrustScore: Dispatch<
    SetStateAction<{
      feedbackType: number;
      companyLogo: number;
      companyLinkedIn: number;
      companyLocation: number;
      feedbackComment: number;
    }>
  >;
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    feedbackComment: number;
  };
};

const CompanyInfosStep: React.FC<CompanyInfosStepProps> = ({
  errors,
  register,
  setValue,
  trustScore,
  setTrustScore,
  watch,
}) => {
  const CompanyInfoFields: FormInputFieldItem[] = [
    {
      type: "text",
      placeholder: "Company name",
      label: "Company name",
      name: "companyName",
      isRequired: true,
      error: errors.companyName,
    },
    {
      type: "file",
      placeholder: "Company logo",
      label: "Company logo",
      name: "companyLogo",
      isRequired: false,
      error: errors.companyLogo,
    },
    {
      type: "text",
      label: "Company linkedIn",
      placeholder: "https://www.linkedin.com/company/example",
      name: "companyLinkedIn",
      isRequired: false,
      error: errors.companyLinkedIn,
    },
    {
      type: "text",
      placeholder: "Company location (at least 2 letters)",
      label: "Company location",
      name: "companyLocation",
      isRequired: false,
      error: errors.companyLocation,
    },
  ];
  return (
    <>
      {CompanyInfoFields.map((item, index) => {
        return (
          <FormInputField
            setTrustScore={setTrustScore}
            setValue={setValue}
            trustScore={trustScore}
            key={index}
            type={item.type}
            isRequired={item.isRequired}
            placeholder={item.placeholder}
            label={item.label}
            inputName={item.name}
            register={register}
            error={item.error}
            watch={watch}
          />
        );
      })}
    </>
  );
};

export default CompanyInfosStep;
