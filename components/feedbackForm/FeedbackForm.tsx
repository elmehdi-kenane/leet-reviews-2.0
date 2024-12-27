import { useForm, UseFormWatch } from "react-hook-form";
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
import PublicIcon from "@/public/PublicIcon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";

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
    watch,
    trigger,
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
    isRequired: true,
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
      className="relative w-[90%] max-w-[700px] h-[700px] max-sm:h-[950px] min-h-max my-auto rounded-[45px] flex flex-col items-center bg-neutral border-b border-b-secondary drop-shadow-2xl"
      ref={formRef}
    >
      {isCloseForm && (
        <PopUpFormClose
          setIsCloseForm={setIsCloseForm}
          setIsFeedbackFormOpen={setIsFeedbackFormOpen}
        ></PopUpFormClose>
      )}
      <div
        className="min-w-[18px] w-[18px] min-h-[18px] h-[18px] border-2 border-secondary rounded-full flex justify-center items-center ml-auto mt-7 mr-7 opacity-50"
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
        className={`flex flex-col w-full h-full items-center ${currentStep === 1 ? "gap-24 justify-center" : "gap-10"}`}
      >
        {currentStep !== 1 && (
          <FeedbackFormHeader
            currentStep={currentStep}
            watch={watch}
          ></FeedbackFormHeader>
        )}
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
            watch={watch}
          ></FeedbackTypeStep>
        )}
        {currentStep === 2 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <CompanyInfosStep
              register={register}
              errors={errors}
              watch={watch}
            ></CompanyInfosStep>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <JobInfosStep
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            ></JobInfosStep>
          </div>
        )}
        {currentStep === 4 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <FormSelectOptionField
              watch={watch}
              name={experienceRate.name}
              label={experienceRate.label}
              register={register}
              isRequired={true}
              error={experienceRate.error}
              setValue={setValue}
              types={experienceRate.types}
              currentStep={experienceRate.step}
            ></FormSelectOptionField>
            <FormInputField
              type="text"
              placeholder="Feedback comment"
              name="feedbackComment"
              isRequired={false}
              register={register}
              error={errors.feedbackComment}
            />
          </div>
        )}
        <div
          className={`flex items-center justify-center flex-wrap gap-2 ${currentStep === 1 ? "w-full" : "max-sm:justify-between w-[80%] max-sm:mt-auto max-sm:mb-[20px]"}`}
        >
          {currentStep !== 1 && (
            <>
              <button
                type="button"
                className={`text-gray-400 border-2 border-gray-400 p-3 font-bold font-SpaceGrotesk rounded-md w-[130px] max-sm:min-w-full h-11 flex justify-center items-center`}
              >
                RESET
              </button>
              <button
                type="button"
                className={`p-3 font-bold font-SpaceGrotesk rounded-md w-[130px] bg-transparent text-primary border-2 border-primary max-sm:w-[48%] sm:ml-auto h-11 flex justify-center items-center`}
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
              className={`p-3 text-white font-bold font-SpaceGrotesk ${currentStep === 1 ? "w-[80%]" : "max-sm:w-[48%]"} bg-primary border-2 border-primary rounded-md w-[130px] h-11 flex justify-center items-center`}
              onClick={async () => {
                const isValid = await trigger();
                if (isValid) {
                  console.log("step is valid");
                  setCurrentStep((prevStep) => prevStep + 1);
                } else console.log("step isn't valid");
              }}
            >
              {currentStep === 1 ? "Create a Public Feedback" : "NEXT"}
            </button>
          )}
          {currentStep === lastStep && (
            <button
              type="submit"
              className={`bg-primary p-3 text-white font-bold w-[130px] h-11 flex justify-center items-center rounded-md max-sm:min-w-[49%]`}
              onClick={() => {
                // console.log("publish button clicked");
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

const FeedbackFormHeader = ({
  watch,
  currentStep,
}: {
  watch: UseFormWatch<FormData>;
  currentStep: number;
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="h-[52px] mb-3 flex justify-between font-SpaceGrotesk w-[80%]">
        {watch("feedbackType").name === "Publicly" && (
          <div className="bg-secondary h-full w-max font-semibold flex items-center gap-2 p-3 rounded-xl text-neutral">
            <div className="rounded-full min-w-[35px] min-h-[35px] bg-neutral flex justify-center items-center">
              <Image
                className="min-w-[30px]"
                src={PublicIcon}
                height={30}
                width={30}
                alt={PublicIcon}
              ></Image>
            </div>
            <p className="max-sm:hidden">Public Feedback</p>
          </div>
        )}
        {watch("feedbackType").name === "Anonymously" && (
          <div className="bg-secondary h-full w-max font-semibold flex items-center gap-2 p-3 rounded-xl text-neutral">
            <div className="rounded-full min-w-[35px] min-h-[35px] bg-neutral flex justify-center items-center">
              <Image
                className="min-w-[30px]"
                src={AnonymousIcon}
                height={30}
                width={30}
                alt={AnonymousIcon}
              ></Image>
            </div>
            <p className="max-sm:hidden">Anonymous Feedback</p>
          </div>
        )}
        <div className="bg-secondary h-full w-max font-semibold flex items-center gap-2 p-3 rounded-xl text-neutral">
          <p>Trust score</p>
        </div>
      </div>
      <div className="flex items-center justify-between max-sm:justify-center gap-3 w-[80%]">
        {currentStep === 2 ? (
          <p className="bg-primary p-[6px] rounded-xl text-neutral font-SpaceGrotesk font-semibold text-[20px] max-sm:text-[15px] flex items-center gap-2 max-sm:min-w-full min-w-[284px]">
            <span className="rounded-full bg-neutral text-primary w-[40px] h-[40px] text-center flex justify-center items-center text-[20px]">
              1
            </span>
            <span>Company information&apos;s</span>
          </p>
        ) : (
          <p
            className={`${currentStep >= 3 ? "bg-primary" : "bg-secondary"} rounded-full w-10 h-10 min-w-10 min-h-10 text-neutral flex justify-center items-center font-semibold font-SpaceGrotesk text-[20px] max-sm:hidden`}
          >
            1
          </p>
        )}
        <div className="w-14 h-1 bg-secondary max-sm:hidden"></div>
        {currentStep === 3 ? (
          <p className="bg-primary p-[6px] rounded-xl text-neutral font-SpaceGrotesk font-semibold text-[20px] max-sm:text-[15px] flex items-center gap-2 max-sm:min-w-full min-w-[284px]">
            <span className="rounded-full bg-neutral text-primary w-[40px] h-[40px] text-center flex justify-center items-center text-[20px]">
              2
            </span>
            <span>Job information&apos;s</span>
          </p>
        ) : (
          <p
            className={`${currentStep >= 3 ? "bg-primary" : "bg-secondary"} rounded-full w-10 h-10 min-w-10 min-h-10 text-neutral flex justify-center items-center font-semibold font-SpaceGrotesk text-[20px] max-sm:hidden`}
          >
            2
          </p>
        )}
        <div className="w-14 h-1 bg-secondary max-sm:hidden"></div>
        {currentStep === 4 ? (
          <p className="bg-primary p-[6px] rounded-xl text-neutral font-SpaceGrotesk font-semibold text-[20px] max-sm:text-[15px] flex items-center gap-2 max-sm:min-w-full min-w-[284px]">
            <span className="rounded-full bg-neutral text-primary w-[40px] h-[40px] text-center flex justify-center items-center text-[20px]">
              3
            </span>
            <span>Job feedback</span>
          </p>
        ) : (
          <p className="rounded-full bg-secondary w-10 h-10 min-w-10 min-h-10 text-neutral flex justify-center items-center font-semibold font-SpaceGrotesk text-[20px] max-sm:hidden">
            3
          </p>
        )}
      </div>
    </div>
  );
};
