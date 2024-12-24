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
import Image from "next/image";
import closeIcon from "@/public/closeIcon.svg";

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
    step: 4,
    error: errors.experienceRate,
    types: experienceRateTypes,
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCloseForm, setIsCloseForm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsCloseForm(true);
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
      className="relative w-[90%] max-w-[700px] h-[900px] mt-[40px] rounded-[45px] flex flex-col items-center bg-neutral border-b border-b-secondary drop-shadow-2xl"
      ref={formRef}
    >
      {isCloseForm && (
        <PopUpFormClose
          setIsCloseForm={setIsCloseForm}
          setIsFeedbackFormOpen={setIsFeedbackFormOpen}
        ></PopUpFormClose>
      )}
      <div
        className="min-w-[22px] w-[22px] min-h-[22px] h-[22px] border-2 border-secondary rounded-full flex justify-center items-center ml-auto mt-7 mr-7"
        onClick={() => setIsCloseForm(true)}
      >
        <Image
          className="min-w-[9px]"
          src={closeIcon}
          height={9}
          width={9}
          alt={closeIcon}
        ></Image>
      </div>
      <div
        className={`flex flex-col w-full h-full justify-center items-center ${currentStep === 1 ? "gap-24" : "gap-10"}`}
      >
        {/* <h1 className="text-xl font-bold mb-4">step {currentStep}</h1> */}
        {currentStep === 1 && (
          <h1 className="font-SpaceGrotesk font-semibold text-[30px] max-md:text-[20px] text-center">
            Choose How to Publish Your Feedback
          </h1>
        )}
        {currentStep === 1 && (
          <FeedbackTypeStep
            register={register}
            errors={errors}
            setValue={setValue}
          ></FeedbackTypeStep>
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
              step={experienceRate.step}
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
        <div className="flex flex-col items-center gap-2 w-full">
          {currentStep !== 1 && (
            <>
              <button
                type="button"
                className={`w-full bg-primary p-3 text-white font-bold font-SpaceGrotesk`}
              >
                RESET
              </button>
              <button
                type="button"
                className={`w-full ${currentStep === firstStep ? "bg-gray-400" : "bg-primary"} p-3 text-white font-bold font-SpaceGrotesk`}
                onClick={() =>
                  setCurrentStep((prev) => {
                    return prev !== firstStep ? prev - 1 : prev;
                  })
                }
              >
                BACK
              </button>
            </>
          )}
          {currentStep <= lastStep - 1 && (
            <button
              type="button"
              className={`p-3 text-white font-bold font-SpaceGrotesk ${currentStep === 1 ? "w-[80%]" : "w-[100%]"} bg-primary rounded-md`}
              onClick={() => {
                console.log("next button clicked");

                setCurrentStep((prev) => {
                  return prev !== lastStep ? prev + 1 : prev;
                });
              }}
            >
              {currentStep === 1 ? "Create a Public Feedback" : "NEXT"}
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
      </div>
    </form>
  );
};

const PopUpFormClose = ({
  setIsFeedbackFormOpen,
  setIsCloseForm,
}: {
  setIsFeedbackFormOpen: (value: boolean) => void;
  setIsCloseForm: (value: boolean) => void;
}) => {
  return (
    <div className="flex justify-center items-center absolute w-full h-full bg-white/30 backdrop-blur-sm rounded-[45px] mt-[2px]">
      <div className="flex justify-center items-center flex-col bg-secondary p-5 rounded-xl drop-shadow-xl PopUpFormClose">
        <p className="font-semibold mb-4 text-white">
          Are you sure you want to close this form?
        </p>
        <div className="flex w-full justify-between">
          <button
            className="w-[48%] font-SpaceGrotesk rounded-lg p-2 border border-white text-white bg-transparent"
            onClick={() => setIsCloseForm(false)}
          >
            Cancel
          </button>
          <button
            className="w-[48%] font-SpaceGrotesk rounded-lg p-2 border border-primary text-white bg-primary"
            onClick={() => setIsFeedbackFormOpen(false)}
          >
            Close Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
