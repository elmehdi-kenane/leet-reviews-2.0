import { useForm } from "react-hook-form";
import {
  FormData,
  experienceRateTypes,
  FormSelectFieldItem,
} from "@/lib/types";
import { FormInputField, FormSelectOptionField } from "./FormField";
import FeedbackTypeStep from "./FeedbackTypeStep";
import CompanyInfosStep from "./CompanyInfosStep";
import JobInfosStep from "./JobInfosStep";
import { useEffect, useRef, useState } from "react";

const Form = ({
  setIsFeedbackFormOpen,
}: {
  setIsFeedbackFormOpen: (value: boolean) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  //   const handleSelect = (value: validWorkingTypes) => {
  //     // Set the form value for "workingType" and mark it as dirty for validation
  //     setValue("workingType", value);
  //     setSelected(value);
  //   };

  const onSubmit = async (data: FormData) => {
    console.log("currentStep", currentStep);
    console.log("SUCCESS", data);
  };

  const experienceRate: FormSelectFieldItem = {
    name: "experienceRate",
    label: "Experience rate",
    error: errors.experienceRate,
    types: experienceRateTypes,
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsFeedbackFormOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const firstStep = 1;
  const lastStep = 4;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-blue-400"
      ref={formRef}
    >
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4">Feedback Form</h1>
        <h1 className="text-xl font-bold mb-4">step {currentStep}</h1>
        {currentStep === 1 && (
          <>
            <FeedbackTypeStep
              register={register}
              errors={errors}
              setValue={setValue}
            ></FeedbackTypeStep>
          </>
        )}
        {currentStep === 2 && (
          <>
            <CompanyInfosStep
              register={register}
              errors={errors}
            ></CompanyInfosStep>
          </>
        )}
        {currentStep === 3 && (
          <>
            <JobInfosStep
              register={register}
              errors={errors}
              setValue={setValue}
            ></JobInfosStep>
          </>
        )}
        {currentStep === 4 && (
          <>
            <FormSelectOptionField
              name={experienceRate.name}
              label={experienceRate.label}
              register={register}
              error={experienceRate.error}
              setValue={setValue}
              types={experienceRate.types}
            ></FormSelectOptionField>
            <FormInputField
              type="text"
              placeholder="Feedback comment"
              name="feedbackComment"
              register={register}
              error={errors.feedbackComment}
            />
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={`w-full bg-primary p-3 text-white font-bold`}
        >
          RESET
        </button>
        <button
          type="button"
          className={`w-full ${currentStep === firstStep ? "bg-gray-400" : "bg-primary"} p-3 text-white font-bold`}
          onClick={() =>
            setCurrentStep((prev) => {
              return prev !== firstStep ? prev - 1 : prev;
            })
          }
        >
          BACK
        </button>
        {currentStep <= lastStep - 1 && (
          <button
            type="button"
            className={`w-full bg-primary p-3 text-white font-bold`}
            onClick={() => {
              console.log("next button clicked");

              setCurrentStep((prev) => {
                return prev !== lastStep ? prev + 1 : prev;
              });
            }}
          >
            NEXT
          </button>
        )}
        {currentStep === lastStep && (
          <button
            type="submit"
            className={`w-full bg-primary p-3 text-white font-bold`}
            onClick={() => {
              console.log("publish button clicked");
              //   console.log("publish clicked");
              //   setCurrentStep((prev) => {
              //     return prev !== lastStep ? prev + 1 : prev;
              //   });
            }}
          >
            PUBLISH
          </button>
        )}
      </div>
    </form>
  );
};

export default Form;
