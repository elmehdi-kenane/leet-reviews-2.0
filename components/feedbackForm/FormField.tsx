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
import toast, { Toaster } from "react-hot-toast";

export const FormInputField: React.FC<FormInputFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  isRequired,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Generate a preview URL for images
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    } else {
      setPreview(null);
    }
  };

  const notify = () => {
    console.log("notify call in inputField");
    return toast("Here is your toast.");
  };

  const inputId = `${name}-input`;
  return (
    <div className="flex flex-col w-[70%]">
      <label htmlFor={inputId} className="font-semibold">
        {placeholder}
        {isRequired && <span className="text-red-600">*</span>}
      </label>
      <div className="flex w-full">
        {name === "feedbackComment" ? (
          <textarea
            id={inputId}
            placeholder={placeholder}
            {...register(name, { required: isRequired, valueAsNumber })}
            className={`p-3 bg-transparent border-2 border-secondary w-full rounded-2xl h-[55px] ${type === "file" && "border-dashed"} focus:outline-none focus:border-primary hover:outline-none hover:border-primary max-h-[200px] min-h-[55px]`}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            placeholder={placeholder}
            {...register(name, { required: isRequired, valueAsNumber })}
            className={`p-3 bg-transparent border-2 border-secondary w-full rounded-2xl h-[55px] ${type === "file" && "border-dashed"} focus:outline-none focus:border-primary hover:outline-none hover:border-primary`}
            onChange={type === "file" ? handleFileChange : undefined}
          />
        )}
        {type === "file" && (
          <div className="ml-2 h-[55px] w-[55px] min-h-[55px] min-w-[55px] rounded-2xl border-2 border-secondary flex justify-center items-center">
            {preview ? (
              <Image
                src={preview}
                width={55}
                height={55}
                alt="File Preview"
                className="object-cover w-full h-full rounded-2xl"
              />
            ) : (
              <p className="text-[13px]">Preview</p>
            )}
          </div>
        )}
      </div>
      {/* {error && error.type === "required" && <span>This is required</span>} */}
      {error && error.type === "required" && notify()}
      <Toaster />
    </div>
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
  isRequired,
  currentStep,
  error,
  watch,
}: FormSelectFieldProps<T>) => {
  const result = watch(name);
  const [selected, setSelected] = useState<string>(
    typeof result === "object" ? result.name : result,
  );
  const selectId = `${name}-select`;

  const handleSelect = (value: T) => {
    if (typeof value === "string") {
      setValue(name, value);
      console.log("string value", value);
      setSelected(value);
    } else if (typeof value === "object" && value.name) {
      setValue(name, value);
      setSelected(value.name);
    }
  };
  //   console.log("error", error);
  //   console.log("error.type", error?.type);

  //   const notify = () => {
  //     console.log("notify call selectOptions");
  //     return toast("Here is your toast.");
  //   };
  return (
    <div className={`${currentStep === 1 ? "w-full" : "w-[70%]"}`}>
      {currentStep !== 1 && (
        <label htmlFor={selectId} className="font-semibold">
          {label}
          {isRequired && <span className="text-red-600">*</span>}
        </label>
      )}
      <div
        className={`flex gap-4 ${currentStep === 1 && "flex-col"} w-full items-center justify-between flex-wrap`}
      >
        <input
          id={selectId}
          type="hidden"
          {...register(name, { required: isRequired })}
        />
        {types.map((type, index) => {
          return (
            <button
              type="button"
              key={index}
              className={`flex items-center gap-3 text-secondary ${currentStep === 4 ? "p-2 max-w-max" : "p-3"} border-2 border-secondary ${selected === (typeof type === "object" ? type.name : type) ? "bg-secondary text-neutral" : "bg-transparent"} ${currentStep === 1 ? "w-[80%] bg-transparent h-28 border-2 border-secondary rounded-[30px] text-secondary" : `rounded-[15px]`}`}
              style={
                currentStep !== 1
                  ? { width: `${90 / types.length}%`, minWidth: "max-content" }
                  : undefined
              }
              onClick={() => handleSelect(type)}
            >
              {currentStep === 1 && (
                <>
                  <div className="min-w-[23px] w-[23px] h-[23px] border-2 border-secondary rounded-full flex justify-center items-center mr-3">
                    <div
                      className={`min-w-[15px] w-[15px] h-[15px] ${selected === (typeof type === "object" ? type.name : type) ? "bg-secondary" : "bg-transparent"} rounded-full`}
                    ></div>
                  </div>
                  <Image
                    className="min-w-[55px] max-sm:hidden"
                    src={index === 0 ? PublicIcon : AnonymousIcon}
                    height={55}
                    width={55}
                    alt={index === 0 ? PublicIcon : AnonymousIcon}
                  ></Image>
                </>
              )}
              <div className="w-full justify-start">
                {currentStep === 4 ? (
                  <Image
                    className="min-w-[30px]"
                    src={
                      typeof type === "string"
                        ? selected === type
                          ? `${type}Light.svg`
                          : `${type}.svg`
                        : ""
                    }
                    height={30}
                    width={30}
                    alt={
                      typeof type === "string"
                        ? selected === type
                          ? `${type}Light.svg`
                          : `${type}.svg`
                        : ""
                    }
                  ></Image>
                ) : (
                  <p
                    className={`${currentStep === 1 ? "font-semibold text-start" : ""} font-medium ${currentStep !== 1 && selected === (typeof type === "object" ? type.name : type) && "text-neutral"}`}
                  >
                    {typeof type === "object" ? type.name : type}
                  </p>
                )}
                {currentStep === 1 && (
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
      {/* {error && error.type === "required" && <span>This is required</span>} */}
      <div className="hidden">
        {error && error.type === "required" && toast("Here is your toast.")}
      </div>
      <Toaster />
    </div>
  );
};
