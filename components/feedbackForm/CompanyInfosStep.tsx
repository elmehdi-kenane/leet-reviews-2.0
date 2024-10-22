import { FormInputFieldItem, FormData } from "@/lib/types";
import { FormInputField } from "./FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";

export type CompanyInfosStepProps = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
};

const CompanyInfosStep: React.FC<CompanyInfosStepProps> = ({
  errors,
  register,
}) => {
  const CompanyInfoFields: FormInputFieldItem[] = [
    {
      type: "text",
      placeholder: "Company name",
      name: "companyName",
      error: errors.companyName,
    },
    {
      type: "file",
      placeholder: "Company logo",
      name: "companyLogo",
      error: errors.companyLogo,
    },
    {
      type: "text",
      placeholder: "Company linkedIn",
      name: "companyLinkedIn",
      error: errors.companyLinkedIn,
    },
    {
      type: "text",
      placeholder: "Company location",
      name: "companyLocation",
      error: errors.companyLocation,
    },
  ];
  return (
    <>
      {CompanyInfoFields.map((item, index) => {
        return (
          <FormInputField
            key={index}
            type={item.type}
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
