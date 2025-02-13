import { FormInputFieldItem, FormDataRhf } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FormInputField } from "./FormField";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormResetField,
} from "react-hook-form";

export type CompanyInfosStepProps = {
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

const CompanyInfosStep: React.FC<CompanyInfosStepProps> = ({
  errors,
  register,
  resetField,
  isResetFields,
  setIsResetFields,
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
      type: "text",
      placeholder: "Company location (at least 2 letters)",
      label: "Company location",
      name: "companyLocation",
      isRequired: false,
      error: errors.companyLocation,
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
  ];
  useEffect(() => {
    if (isResetFields[0]) {
      CompanyInfoFields.forEach((element) => {
        resetField(element.name, { defaultValue: "" });
      });
      setIsResetFields([false, false, false]);
    }
  }, [isResetFields]);
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
