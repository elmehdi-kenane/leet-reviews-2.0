import {
  FormInputFieldProps,
  FormSelectFieldProps,
  validWorkingType,
  validContractType,
  validJobProgressType,
  validFeedbackType,
  validExperienceRateType,
} from "@/lib/types";
import { useEffect, useState } from "react";
import PublicIcon from "@/public/PublicIcon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

export const FormInputField: React.FC<FormInputFieldProps> = ({
  type,
  placeholder,
  label,
  inputName,
  register,
  setValue,
  watch,
  trustScore,
  isRequired,
  setTrustScore,
}) => {
  let result;
  let previewFileURL = null;

  if (type === "file") result = watch(inputName) as unknown as FileList;
  else result = watch(inputName);

  if (type !== "file") {
    // console.log(`watch input inputName ${inputName} : '${result}'`);
  } else if (
    result !== undefined &&
    type === "file" &&
    result instanceof FileList
  ) {
    const file = result[0];
    if (file instanceof File) previewFileURL = URL.createObjectURL(file);
    // console.log("Selected file:", file); // File inputName
    // console.log("Selected file:", file.inputName); // File inputName
    // console.log("File size:", file.size); // File size
    // console.log("File type:", file.type); // File type
  }
  const { onBlur, name, onChange, ref } = register(inputName, {
    required: isRequired ? placeholder : false,
    ...(inputName === "companyLinkedIn" && {
      pattern: {
        value: /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
        message:
          "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/...).",
      },
    }),
  });
  const [preview, setPreview] = useState<string | null>(previewFileURL);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [input, setInput] = useState<string | File>(
    result === undefined
      ? ""
      : type === "file" && result instanceof FileList
        ? result[0]
        : (result as string),
  );
  useEffect(() => {
    setInput(
      result === undefined
        ? ""
        : type === "file" && result instanceof FileList
          ? result[0]
          : (result as string),
    );
    console.log(`inputName ${inputName} result ${result}`);
    if (
      trustScore &&
      (result === "" || result === undefined) &&
      !isRequired &&
      inputName in trustScore
    ) {
      setTrustScore((prevState) => {
        const newState = {
          ...prevState,
          [inputName]: 0,
        };

        return newState;
      });
    }
  }, [result]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    type: string,
  ) => {
    if (
      type === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files?.[0]
    ) {
      handleFilePreviewChange(e as React.ChangeEvent<HTMLInputElement>);
      setValue("companyLogo", e.target.files?.[0]);
    } else onChange(e);

    setInput(e.target?.value);
    if (
      trustScore &&
      (e.target?.value !== "" || type === "file") &&
      !isRequired &&
      inputName in trustScore
    ) {
      console.log("add +2", inputName);
      setTrustScore((prevState) => {
        console.log("prevState", prevState);

        const newState = {
          ...prevState,
          [inputName]: 2,
        };
        console.log("newState", newState);
        return newState;
      });
    } else if (
      trustScore &&
      e.target?.value === "" &&
      !isRequired &&
      inputName in trustScore
    ) {
      setTrustScore((prevState) => {
        const newState = {
          ...prevState,
          [inputName]: 0,
        };

        return newState;
      });
    }

    setLocationResults([]);
    const fetchLocations = async () => {
      const OpenCageEndpoint = "https://api.opencagedata.com/geocode/v1/json";
      const ResponsePromise = await fetch(
        `${OpenCageEndpoint}?q=${e.target?.value}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_API_KEY}`,
      );
      const ResponseJson = await ResponsePromise.json();
      setLocationResults(ResponseJson.results);
    };
    if (inputName === "companyLocation" && e.target?.value.length > 1)
      fetchLocations();
  };

  const handleFilePreviewChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // console.log("event.target.files", event.target.files);
    // console.log("test handleFilePreviewChange file", file);
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    } else {
      setPreview(null);
    }
  };

  const inputId = `${inputName}-input`;
  const inputMaxLength = 40;
  const authorCommentMaxLength = 250;

  return (
    <div className="text-secondary flex flex-col w-[70%]">
      <label htmlFor={inputId} className="font-semibold">
        {label}
        {isRequired && <span className="text-red-600">*</span>}
      </label>
      <div className="flex w-full">
        {inputName === "authorComment" ? (
          <textarea
            maxLength={authorCommentMaxLength}
            id={inputId}
            name={name}
            ref={ref}
            onBlur={() => {
              setIsInputFocused(false);
              onBlur;
            }}
            placeholder={placeholder}
            value={input as string}
            onChange={(e) => handleInputChange(e, type)}
            className={`p-3 bg-transparent border-2 border-secondary w-full rounded-2xl h-[55px] focus:outline-none focus:border-primary hover:outline-none hover:border-primary max-h-[200px] min-h-[55px]`}
          />
        ) : type === "file" ? (
          <input
            id={inputId}
            name={name}
            ref={ref}
            onBlur={() => {
              setIsInputFocused(false);
              onBlur;
            }}
            type={type}
            placeholder={placeholder}
            className={`p-3 bg-transparent border-2 border-secondary w-full rounded-2xl h-[55px] border-dashed focus:outline-none focus:border-primary hover:outline-none hover:border-primary`}
            onChange={(e) => handleInputChange(e, type)}
          />
        ) : (
          <div
            className={`w-full flex flex-col ${inputName === "companyLocation" ? "relative z-20" : ""}`}
          >
            <input
              maxLength={inputMaxLength}
              id={inputId}
              value={input as string}
              name={name}
              ref={ref}
              type={type}
              onFocus={() => setIsInputFocused(true)}
              placeholder={placeholder}
              onBlur={() => {
                setTimeout(() => {
                  setIsInputFocused(false);
                }, 150);
                onBlur;
              }}
              className={`p-3 bg-transparent border-2 border-secondary w-full rounded-2xl h-[55px] focus:outline-none focus:border-primary hover:outline-none hover:border-primary`}
              onChange={(e) => {
                handleInputChange(e, type);
              }}
            />
            {isInputFocused === true && inputName === "companyLocation" && (
              // {inputName === "companyLocation" && (
              <div className="w-[100%] absolute h-[100px] mt-[57px] mx-auto flex rounded-2xl flex-col justify-between bg-neutral">
                {typeof input === "string" && input.length > 1 ? (
                  <div className="w-full h-full overflow-auto scroll-bar-width font-medium rounded-2xl border-2 border-secondary flex flex-col gap-1 items-center p-1">
                    {locationResults.length === 0 ? (
                      <p className="font-semibold italic h-full rounded-xl text-center flex justify-center items-center">
                        Search term not found
                      </p>
                    ) : (
                      locationResults.map(
                        (item: { formatted: string }, index: number) => {
                          return (
                            <button
                              key={index}
                              className={`w-full min-h-[50%] rounded-lg italic border border-secondary hover:bg-secondary hover:text-neutral ${selectedLocation === item.formatted ? "bg-secondary text-neutral" : "text-secondary"}`}
                              onClick={(e) => {
                                console.log("onclick");
                                setSelectedLocation(item.formatted);
                                setInput(item.formatted);
                                setValue(name, item.formatted);
                                e.preventDefault();
                              }}
                            >
                              {item.formatted}
                            </button>
                          );
                        },
                      )
                    )}
                  </div>
                ) : (
                  <p className="font-semibold italic h-full rounded-xl text-center border-2 border-secondary flex justify-center items-center">
                    Search for locations{" "}
                    <span className="font-medium">(e.g., Casablanca)</span>.
                  </p>
                )}
              </div>
            )}
          </div>
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
    </div>
  );
};

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
  setTrustScore,
  types,
  isRequired,
  currentStep,
  watch,
}: FormSelectFieldProps<T>) => {
  const result = watch(name);
  //   console.log(`watch select name ${name} : '${result}'`);
  const [selected, setSelected] = useState<
    string | number | { name: string; description: string }
  >(typeof result === "object" ? result.name : result);
  useEffect(() => {
    setSelected(typeof result === "object" ? result.name : result);
  }, [result]);
  const selectId = `${name}-select`;
  const handleSelect = (value: T) => {
    if (
      name === "feedbackType" &&
      typeof value === "object" &&
      value.name === "Publicly"
    ) {
      setTrustScore((prevState) => {
        const newState = {
          ...prevState,
          [name]: 2,
        };
        return newState;
      });
    }
    if (
      name === "feedbackType" &&
      typeof value === "object" &&
      value.name === "Anonymously"
    ) {
      setTrustScore((prevState) => {
        const newState = {
          ...prevState,
          [name]: 0,
        };
        return newState;
      });
    }
    if (typeof value === "string" || typeof value === "number") {
      setValue(name, value);
      setSelected(value);
    } else if (typeof value === "object" && value.name) {
      setValue(name, value);
      setSelected(value.name);
    }
  };
  const experienceRateType = [
    "VeryPoor",
    "Poor",
    "Average",
    "Good",
    "Excellent",
  ];
  return (
    <div
      className={`${currentStep === 1 ? "w-full" : "w-[70%]"} text-secondary`}
    >
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
          {...register(name, {
            required: isRequired === true ? label : false,
          })}
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
                      typeof type === "string" || "number"
                        ? selected === type
                          ? `${experienceRateType[index]}Light.svg`
                          : `${experienceRateType[index]}.svg`
                        : ""
                    }
                    height={30}
                    width={30}
                    alt={
                      typeof type === "string"
                        ? selected === type
                          ? `${experienceRateType[index]}Light.svg`
                          : `${experienceRateType[index]}.svg`
                        : ""
                    }
                  ></Image>
                ) : (
                  <p
                    className={`${currentStep === 1 ? "font-semibold text-start" : ""} font-semibold ${currentStep !== 1 && selected === (typeof type === "object" ? type.name : type) && "text-neutral"}`}
                  >
                    {typeof type === "object" ? type.name : type}
                  </p>
                )}
                {currentStep === 1 && (
                  <p className={`font-thin text-[11px] text-start`}>
                    {typeof type === "object" && type.description}{" "}
                    <Tooltip
                      title={
                        // "Trust Score reflects the credibility of feedback, increasing with detailed insights and community votes."
                        "Trust Score reflects the credibility of feedback, increasing with detailed insights."
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
