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
import PublicIcon from "@/public/PublicIcon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

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
  step,
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
    <div className={`${step === 1 && "w-full"}`}>
      {step !== 1 && <label htmlFor={selectId}>{label}</label>}
      <div
        className={`flex gap-4 ${step === 1 && "flex-col"} w-full items-center`}
      >
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
              className={`flex items-center gap-3 p-4 ${selected === (typeof type === "object" ? type.name : type) ? "bg-blue-500" : "bg-gray-300"} ${step === 1 ? "w-[80%] bg-transparent h-28 border-2 rounded-[30px] text-secondary border-secondary" : ""}`}
              onClick={() => handleSelect(type)}
            >
              {step === 1 && (
                <div className="min-w-[23px] w-[23px] h-[23px] border-2 border-secondary rounded-full flex justify-center items-center mr-3">
                  <div
                    className={`min-w-[15px] w-[15px] h-[15px] ${selected === (typeof type === "object" ? type.name : type) ? "bg-secondary" : "bg-transparent"} rounded-full`}
                  ></div>
                </div>
              )}
              {step === 1 && (
                <Image
                  className="min-w-[55px] max-sm:hidden"
                  src={index === 0 ? PublicIcon : AnonymousIcon}
                  height={55}
                  width={55}
                  alt={index === 0 ? PublicIcon : AnonymousIcon}
                ></Image>
              )}
              <div className="w-full justify-start">
                <p
                  className={`${step === 1 ? "font-semibold text-start" : ""}`}
                >
                  {typeof type === "object" ? type.name : type}
                </p>
                {step === 1 && (
                  <p className={`font-thin text-[11px] text-start`}>
                    {typeof type === "object" && type.description}{" "}
                    <Tooltip
                      title={
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
                      }
                    >
                      <span className="underline cursor-help">trust score</span>
                    </Tooltip>
                    .
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
