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
import CheckMarkIcon from "@/public/checkMarkIcon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";
import toast from "react-hot-toast";
import Link from "next/link";

const FeedbackForm = ({
  setIsFeedbackFormOpen,
  setIsClosingFeedbackForm,
  buttonCreateFeedbackPosition,
}: {
  setIsFeedbackFormOpen: (value: boolean) => void;
  setIsClosingFeedbackForm: (value: boolean) => void;
  buttonCreateFeedbackPosition: { top: number; left: number };
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
    const formData = { trustScore: 2, ...data };
    console.log("SUCCESS", formData);
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
  const [isPopUpFeedbackFormOpen, setIsPopUpFeedbackFormOpen] = useState(false);
  //   const [isProcessing, setIsProcessing] = useState(false);
  const [trustScore, setTrustScore] = useState({
    feedbackType: 0,
    companyLogo: 0,
    companyLinkedIn: 0,
    companyLocation: 0,
    feedbackComment: 0,
  });
  //   feedtype 2 logo 2 linkedin 2 location 2 feed 2

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsPopUpFeedbackFormOpen(true);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleStepValidation = async () => {
    const isValid = await trigger();
    if (isValid) {
      console.log("step is valid");
      if (currentStep === 4) console.log("send form");
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      console.log("step isn't valid");
      if (errors) {
        console.log("errors", errors);

        const errorKeys = Object.keys(errors) as (keyof FormData)[]; // Explicitly cast keys to keyof FormData
        console.log("errorKeys", errorKeys);
        const firstField = errorKeys[0];
        console.log("firstField", firstField);
        let errorMessage = "Feedback type";
        errorMessage = errors[firstField]?.message || "Feedback type";
        console.log("errorMessage", errorMessage);
        console.log("errors[firstField]", errors[firstField]);
        toast.dismiss();
        toast.error(`Invalid ${errorMessage}`);
      }
    }
  };
  const firstStep = 1;
  const lastStep = 4;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        transformOrigin: `${buttonCreateFeedbackPosition.left}px ${buttonCreateFeedbackPosition.top}px`,
      }}
      className={` relative w-[98%] max-w-[700px] h-[750px] max-sm:h-[900px] min-h-max my-auto rounded-[45px] flex flex-col items-center bg-neutral border-b border-b-secondary drop-shadow-xl`}
      ref={formRef}
    >
      {isPopUpFeedbackFormOpen && (
        <PopUpFormClose
          currentStep={currentStep}
          setIsPopUpFeedbackFormOpen={setIsPopUpFeedbackFormOpen}
          setIsClosingFeedbackForm={setIsClosingFeedbackForm}
          setIsFeedbackFormOpen={setIsFeedbackFormOpen}
        ></PopUpFormClose>
      )}
      <div
        className={`${currentStep >= 5 ? "hidden" : ""} min-w-[18px] w-[18px] min-h-[18px] h-[18px] border-2 border-secondary rounded-full flex justify-center items-center ml-auto mt-7 mr-7 opacity-50`}
        onClick={() => setIsPopUpFeedbackFormOpen(true)}
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
        {currentStep !== 1 && currentStep < 5 && (
          <FeedbackFormHeader
            currentStep={currentStep}
            trustScore={trustScore}
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
            setTrustScore={setTrustScore}
            trustScore={trustScore}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          ></FeedbackTypeStep>
        )}
        {currentStep === 2 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <CompanyInfosStep
              setTrustScore={setTrustScore}
              trustScore={trustScore}
              register={register}
              errors={errors}
              watch={watch}
            ></CompanyInfosStep>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <JobInfosStep
              setTrustScore={setTrustScore}
              trustScore={trustScore}
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
              setTrustScore={setTrustScore}
              trustScore={trustScore}
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
              setTrustScore={setTrustScore}
              trustScore={trustScore}
              watch={watch}
              type="text"
              placeholder="Feedback comment"
              label="Feedback comment"
              inputName="feedbackComment"
              isRequired={false}
              register={register}
              error={errors.feedbackComment}
            />
          </div>
        )}
        {currentStep >= 5 ? (
          <div className="flex flex-col w-[50%] min-h-[390px] h-full items-center justify-center">
            <h1 className="font-SpaceGrotesk font-semibold text-[30px] mt-[-50px] mb-[30px] max-md:text-[20px] text-center">
              🎉 Thank you for sharing your feedback!
            </h1>
            <Link
              href={"/home"}
              className={`p-3 text-secondary font-bold font-SpaceGrotesk w-[80%] border-2 border-secondary rounded-md mb-[10px] h-11 flex justify-center items-center`}
              onClick={handleStepValidation}
            >
              Back to home
            </Link>
            <Link
              href={"/feedback?id=feedbackId"}
              className={`p-3 text-neutral font-bold font-SpaceGrotesk w-[80%] bg-secondary border-2 border-secondary rounded-md h-11 flex justify-center items-center`}
              onClick={handleStepValidation}
            >
              View feedback
            </Link>
          </div>
        ) : (
          <div
            className={`flex items-center justify-center flex-wrap gap-2 ${currentStep === 1 ? "w-full" : "max-sm:justify-between w-[80%] mt-auto mb-[20px]"}`}
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
                className={`p-3 text-white font-bold font-SpaceGrotesk ${currentStep === 1 ? "w-[80%] mb-[20px]" : "max-sm:w-[48%]"} bg-primary border-2 border-primary rounded-md w-[130px] h-11 flex justify-center items-center`}
                onClick={handleStepValidation}
              >
                {currentStep === 1 ? "Create a Public Feedback" : "NEXT"}
              </button>
            )}
            {currentStep === lastStep && (
              <button
                type="submit"
                className={`bg-primary p-3 text-white font-bold w-[130px] h-11 flex justify-center items-center rounded-md max-sm:min-w-[49%]`}
                onClick={handleStepValidation}
              >
                PUBLISH
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

const PopUpFormClose = ({
  currentStep,
  setIsFeedbackFormOpen,
  setIsPopUpFeedbackFormOpen,
  setIsClosingFeedbackForm,
}: {
  currentStep: number;
  setIsFeedbackFormOpen: (value: boolean) => void;
  setIsPopUpFeedbackFormOpen: (value: boolean) => void;
  setIsClosingFeedbackForm: (value: boolean) => void;
}) => {
  if (currentStep >= 5) {
    setIsClosingFeedbackForm(true);
    setIsPopUpFeedbackFormOpen(false);
    setTimeout(() => {
      setIsClosingFeedbackForm(false);
      setIsFeedbackFormOpen(false);
    }, 300);
  }
  return (
    <div className="flex justify-center items-center absolute w-full h-full bg-white/30 backdrop-blur-sm rounded-[45px] mt-[2px]">
      <div className="flex justify-center items-center flex-col bg-secondary p-5 rounded-xl drop-shadow-xl PopUpFormClose">
        <p className="font-semibold mb-4 text-white">
          Are you sure you want to close this form?
        </p>
        <div className="flex w-full justify-between">
          <button
            className="w-[48%] font-SpaceGrotesk rounded-lg p-2 border border-white text-white bg-transparent"
            onClick={() => setIsPopUpFeedbackFormOpen(false)}
          >
            Cancel
          </button>
          <button
            className="w-[48%] font-SpaceGrotesk rounded-lg p-2 border border-primary text-white bg-primary"
            onClick={() => {
              setIsClosingFeedbackForm(true);
              setIsPopUpFeedbackFormOpen(false);
              setTimeout(() => {
                setIsClosingFeedbackForm(false);
                setIsFeedbackFormOpen(false);
              }, 300);
            }}
          >
            Close Form
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackFormHeader = ({
  watch,
  trustScore,
  currentStep,
}: {
  watch: UseFormWatch<FormData>;
  currentStep: number;
  trustScore: {
    feedbackType: number;
    companyLogo: number;
    companyLinkedIn: number;
    companyLocation: number;
    feedbackComment: number;
  };
}) => {
  const trustSoreRadius = 15;
  const fullCircle = 2 * Math.PI * trustSoreRadius;
  console.log();

  const totalTrustScore = Object.values(trustScore).reduce(
    (total, score) => total + score,
    0,
  );
  const full = fullCircle - (fullCircle * totalTrustScore) / 10;
  if (totalTrustScore === 10) console.log("full", full);

  const svgSize = 35;
  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="h-[52px] mb-3 flex justify-between font-SpaceGrotesk w-[80%]">
        {watch("feedbackType").name === "Publicly" && (
          <div className="bg-secondary h-full w-max font-semibold flex items-center gap-2 p-3 rounded-xl text-neutral">
            <div className="rounded-full min-w-[35px] min-h-[35px] bg-neutral flex justify-center items-center">
              <Image
                className="min-w-[25px]"
                src={PublicIcon}
                height={25}
                width={25}
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
                className="min-w-[25px]"
                src={AnonymousIcon}
                height={25}
                width={25}
                alt={AnonymousIcon}
              ></Image>
            </div>
            <p className="max-sm:hidden">Anonymous Feedback</p>
          </div>
        )}
        <div className="bg-secondary h-full w-max font-semibold flex items-center gap-2 p-3 rounded-xl text-neutral">
          <p>Trust score</p>
          {totalTrustScore !== 10 && (
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className={`${totalTrustScore <= 4 ? "bg-red-400" : "bg-green-500"} rounded-full flex justify-center items-center`}
            >
              <circle
                cx={svgSize / 2}
                cy={svgSize / 2 + 0.5}
                r={trustSoreRadius + 0.7}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${fullCircle + 0.1}`}
                style={{
                  transition: "stroke-dashoffset 1s ease-in-out",
                  strokeDashoffset: `calc(${fullCircle} - (${fullCircle} * ${totalTrustScore} / 10))`,
                }}
                transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                strokeLinecap="round"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy="0.3em"
                fontSize="15"
                fill="currentColor"
              >
                {totalTrustScore}
              </text>
            </svg>
          )}
          {totalTrustScore === 10 && (
            <div
              className="w-[35px] h-[35px] flex justify-center items-center border-[3px] border-neutral rounded-full"
              style={{
                animation: "scaleUp 0.3s ease-out",
              }}
            >
              <Image
                className="min-w-[25px] relative top-0 left-0 z-[200]"
                src={CheckMarkIcon}
                height={25}
                width={25}
                alt={CheckMarkIcon}
              ></Image>
            </div>
          )}
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

export default FeedbackForm;
