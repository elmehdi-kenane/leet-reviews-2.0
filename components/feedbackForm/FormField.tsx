import {
  FormInputFieldProps,
  FormSelectFieldProps,
  validWorkingType,
  validContractType,
  validJobProgressType,
  validFeedbackType,
  validExperienceRateType,
} from "@/lib/types";
import { useState } from "react";

export const FormInputField: React.FC<FormInputFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}) => {
  const inputId = `${name}-input`;
  return (
    <>
      <label htmlFor={inputId}>{placeholder}</label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
};

// Define the reusable select component with generics
export const FormSelectOptionField = <
  T extends
    | validWorkingType
    | validContractType
    | validJobProgressType
    | validFeedbackType
    | validExperienceRateType,
>({
  name,
  label,
  register,
  setValue,
  types,
}: FormSelectFieldProps<T>) => {
  const [selected, setSelected] = useState<string>("");
  const selectId = `${name}-select`;

  const handleSelect = (value: T) => {
    if (typeof value === "string") {
      setValue(name, value);
      setSelected(value);
    } else if (typeof value === "object" && value.name) {
      setValue(name, value);
      setSelected(value.name);
    }
  };
  return (
    <>
      <label htmlFor={selectId}>{label}</label>
      <div className="flex gap-4">
        <input
          id={selectId}
          type="hidden"
          {...register(
            name,
            // {required: `Please select a ${label}`,}
          )}
        />
        {types.map((type, index) => {
          return (
            <button
              type="button"
              key={index}
              className={`${selected === (typeof type === "object" ? type.name : type) ? "bg-blue-500" : "bg-gray-300"}`}
              onClick={() => handleSelect(type)}
            >
              {typeof type === "object" ? type.name : type}
            </button>
          );
        })}
      </div>
    </>
  );
};
