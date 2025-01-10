import { FormInputFieldItem, FormData } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { FormInputField } from "./FormField";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

export type CompanyInfosStepProps = {
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
  trustScore,
  setTrustScore,
  //   watch,
}) => {
  const CompanyInfoFields: FormInputFieldItem[] = [
    {
      type: "text",
      placeholder: "Company name",
      name: "companyName",
      isRequired: true,
      error: errors.companyName,
    },
    {
      type: "file",
      placeholder: "Company logo",
      name: "companyLogo",
      isRequired: false,
      error: errors.companyLogo,
    },
    {
      type: "text",
      placeholder: "Company linkedIn",
      name: "companyLinkedIn",
      isRequired: false,
      error: errors.companyLinkedIn,
    },
    {
      type: "text",
      placeholder: "Company location",
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
            trustScore={trustScore}
            key={index}
            type={item.type}
            isRequired={item.isRequired}
            placeholder={item.placeholder}
            name={item.name}
            register={register}
            error={item.error}
          />
        );
      })}
    </>
  );
};

export default CompanyInfosStep;
