import { useForm, UseFormWatch } from "react-hook-form";
import { FormDataRhf, FeedbackInterface } from "@/lib/types";
import FeedbackTypeStep from "./FeedbackTypeStep";
import CompanyInfosStep from "./CompanyInfosStep";
import ExperienceInfosStep from "./ExperienceInfosStep";
import JobInfosStep from "./JobInfosStep";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import closeIcon from "@/public/closeIcon.svg";
import PublicIcon from "@/public/PublicIcon.svg";
import PublicIconMinimal from "@/public/PublicIconMinimal.svg";
import AnonymousIconMinimal from "@/public/AnonymousIconMinimal.svg";
import CheckMarkIcon from "@/public/checkMarkIcon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";
import toast from "react-hot-toast";
import Link from "next/link";
import JSConfetti from "js-confetti";
import CustomizedTooltip from "@/components/CustomizedTooltip";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface responseDataInterface {
  newFeedback: FeedbackInterface;
}

const FeedbackForm = ({
  setIsFeedbackFormOpen,
  setIsClosingFeedbackForm,
}: {
  setIsFeedbackFormOpen: (value: boolean) => void;
  setIsClosingFeedbackForm: (value: boolean) => void;
  buttonCreateFeedbackPosition: { top: number; left: number };
}) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormDataRhf>();

  const defaultNewFeedback: FeedbackInterface = {
    experienceRate: 0,
    trustScore: 0,
    id: "",
    companyLogo: "",
    feedbackType: "",
    companyName: "",
    companyLinkedIn: "",
    jobStatus: "",
    userId: "",
    authorComment: "",
    author: {
      id: "",
      username: "",
      name: "",
      avatar: "",
      linkedAccountProfileUrl: "",
      accountDisplayedWithFeedbacks: "",
    },
    createdAt: "",
    workingType: "",
    contractType: "",
    companyLocation: "",
    jobProgressType: "",
    employmentDetail: [{ icon: "", text: "" }],
    votes: [],
    saves: [],
    comments: [],
  };

  const [newFeedback, setNewFeedback] =
    useState<FeedbackInterface>(defaultNewFeedback);
  const userContext = useContext(UserContext);
  const [isResetFields, setIsResetFields] = useState([false, false, false]);

  const onSubmit = async (data: FormDataRhf) => {
    const finalFormDataRhf = { trustScore: totalTrustScore, ...data };
    const finalFormData = new FormData();

    Object.entries(finalFormDataRhf).map((entry) => {
      const key = entry[0];
      const value = entry[1];
      if (value instanceof File) {
        finalFormData.append(key, value);
      } else if (typeof value === "object") {
        finalFormData.append(key, String(value.name));
      } else {
        finalFormData.append(key, String(value));
      }
    });

    console.log("SUCCESS", finalFormData);
    let responseData: responseDataInterface;
    const addNewFeedback = async () => {
      try {
        const response = await fetch("/api/feedback/create", {
          method: "POST",
          body: finalFormData,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        responseData = await response.json();
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unknown error occurred");
        }
      } finally {
        console.log("responseData.newFeedback", responseData.newFeedback);

        setNewFeedback(responseData.newFeedback);
        userContext?.setFeedbacks((prev: FeedbackInterface[]) => {
          return [responseData.newFeedback, ...prev];
        });
      }
    };
    addNewFeedback();
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
    authorComment: 0,
  });

  const totalTrustScore = Object.values(trustScore).reduce(
    (total, score) => total + score,
    0,
  );

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
      setCurrentStep((prevStep) => {
        return prevStep + 1;
      });
    } else {
      console.log("step isn't valid");
      if (errors) {
        console.log("errors", errors);

        const errorKeys = Object.keys(errors) as (keyof FormDataRhf)[]; // Explicitly cast keys to keyof FormDataRhf
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
  const jsConfetti = new JSConfetti();

  useEffect(() => {
    if (currentStep === 5) {
      console.log("run a jsConfetti.addConfetti");

      jsConfetti.addConfetti({
        confettiColors: ["#41B06E", "#141E46"],
        confettiNumber: 100,
      });
    }
  }, [currentStep]);

  const firstStep = 1;
  const lastStep = 4;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleStepValidation();
        handleSubmit(onSubmit)(e);
      }}
      className={`relative w-[98%] max-w-[700px] h-[750px] max-sm:h-[900px] min-h-max mt-20 mb-20 rounded-[45px] flex flex-col items-center bg-neutral border-b border-b-secondary drop-shadow-xl`}
      ref={formRef}
    >
      {isPopUpFeedbackFormOpen && (
        <PopUpFormClose
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
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
            totalTrustScore={totalTrustScore}
            watch={watch}
          ></FeedbackFormHeader>
        )}
        {currentStep === 1 && (
          <h1 className="font-SpaceGrotesk text-secondary font-semibold text-[30px] max-md:text-[20px] text-center">
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
              resetField={resetField}
              isResetFields={isResetFields}
              setIsResetFields={setIsResetFields}
              setTrustScore={setTrustScore}
              trustScore={trustScore}
              setValue={setValue}
              register={register}
              errors={errors}
              watch={watch}
            ></CompanyInfosStep>
          </div>
        )}
        {currentStep === 3 && (
          <div className="flex flex-col w-full min-h-[390px] items-center gap-4">
            <JobInfosStep
              resetField={resetField}
              isResetFields={isResetFields}
              setIsResetFields={setIsResetFields}
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
          <ExperienceInfosStep
            resetField={resetField}
            isResetFields={isResetFields}
            setIsResetFields={setIsResetFields}
            setTrustScore={setTrustScore}
            trustScore={trustScore}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          ></ExperienceInfosStep>
        )}
        {currentStep >= 5 ? (
          <MinimalPreviewFeedback
            feedback={newFeedback}
            setIsClosingFeedbackForm={setIsClosingFeedbackForm}
            setIsFeedbackFormOpen={setIsFeedbackFormOpen}
          ></MinimalPreviewFeedback>
        ) : (
          <div
            className={`flex items-center justify-center flex-wrap gap-2 ${currentStep === 1 ? "w-full" : "max-sm:justify-between w-[80%] mt-auto mb-[20px]"}`}
          >
            {currentStep !== 1 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetFields((prev) =>
                      prev.map((value, i) =>
                        i + 2 === currentStep ? true : value,
                      ),
                    );
                  }}
                  className={`text-gray-400 border-2 border-primary p-3 font-bold font-SpaceGrotesk rounded-md w-[130px] max-sm:min-w-full h-11 flex justify-center items-center text-primary`}
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
                className={`p-3 text-neutral font-bold font-SpaceGrotesk ${currentStep === 1 ? "w-[80%] mb-[20px]" : "max-sm:w-[48%]"} bg-primary border-2 border-primary rounded-md w-[130px] h-11 flex justify-center items-center`}
                onClick={handleStepValidation}
              >
                {currentStep === 1 ? "Create a Public Feedback" : "NEXT"}
              </button>
            )}
            {currentStep === lastStep && (
              <button
                type="submit"
                className={`bg-primary p-3 text-neutral font-bold w-[130px] h-11 flex justify-center items-center rounded-md max-sm:min-w-[49%]`}
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
  setCurrentStep,
  setIsPopUpFeedbackFormOpen,
  setIsClosingFeedbackForm,
}: {
  currentStep: number;
  setIsFeedbackFormOpen: (value: boolean) => void;
  setCurrentStep: (value: number) => void;
  setIsPopUpFeedbackFormOpen: (value: boolean) => void;
  setIsClosingFeedbackForm: (value: boolean) => void;
}) => {
  useEffect(() => {
    if (currentStep >= 5) {
      setCurrentStep(currentStep + 1);
      setIsClosingFeedbackForm(true);
      setIsPopUpFeedbackFormOpen(false);
      setTimeout(() => {
        setIsClosingFeedbackForm(false);
        setIsFeedbackFormOpen(false);
      }, 300);
    }
  }, [currentStep]);
  return (
    <div className="flex justify-center items-center absolute z-30 w-full h-full bg-white/30 backdrop-blur-sm rounded-[45px] mt-[2px]">
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
  totalTrustScore,
  currentStep,
}: {
  watch: UseFormWatch<FormDataRhf>;
  currentStep: number;
  totalTrustScore: number;
}) => {
  const trustSoreRadius = 15;
  const fullCircle = 2 * Math.PI * trustSoreRadius;

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
              {totalTrustScore > 0 ? (
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
              ) : (
                <circle
                  cx={svgSize / 2}
                  cy={svgSize / 2 + 0.5}
                  r={trustSoreRadius + 0.7}
                  stroke="currentColor"
                  strokeWidth="0"
                  fill="none"
                  strokeDasharray={`${fullCircle + 0.1}`}
                  style={{
                    transition: "stroke-dashoffset 1s ease-in-out",
                    strokeDashoffset: `calc(${fullCircle} - (${fullCircle} * ${totalTrustScore} / 10))`,
                  }}
                  transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                  strokeLinecap="round"
                />
              )}
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

const MinimalPreviewFeedback = ({
  setIsClosingFeedbackForm,
  setIsFeedbackFormOpen,
  feedback,
}: {
  setIsClosingFeedbackForm: (value: boolean) => void;
  setIsFeedbackFormOpen: (value: boolean) => void;
  feedback: FeedbackInterface;
}) => {
  const trustSoreRadius = 9;
  const fullCircle = 2 * Math.PI * trustSoreRadius;
  const svgSize = 22;
  const router = useRouter();

  const copyFeedbackLink = () =>
    // e:
    //   | React.MouseEvent<HTMLAnchorElement, MouseEvent>
    //   | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    {
      navigator.clipboard.writeText(
        `http://localhost:3000/home?feedbackId=${feedback.id}`,
      );
      toast.dismiss();
      toast.success("feedback link copied!");
    };

  const handleFeedbackFormClosing = (
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!(e instanceof HTMLButtonElement)) e.stopPropagation();
    setIsClosingFeedbackForm(true);
    setTimeout(() => {
      setIsClosingFeedbackForm(false);
      setIsFeedbackFormOpen(false);
    }, 300);
  };

  const editFeedback = () =>
    // e:
    //   | React.MouseEvent<HTMLAnchorElement, MouseEvent>
    //   | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    {};

  const viewFeedback = (
    e:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    router.push(`/home?feedbackId=${feedback.id}`);
    handleFeedbackFormClosing(e);
  };

  const buttons = [
    {
      icon: "/link.svg",
      text: "Copy",
      onclick: () =>
        // e:
        //   | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        //   | React.MouseEvent<HTMLButtonElement, MouseEvent>,
        copyFeedbackLink(),
    },
    {
      icon: "/edit.svg",
      text: "Edit",
      onclick: () =>
        // e:
        //   | React.MouseEvent<HTMLAnchorElement, MouseEvent>
        //   | React.MouseEvent<HTMLButtonElement, MouseEvent>,
        editFeedback(),
    },
    {
      icon: "/eye.svg",
      text: "View",
      onclick: (
        e:
          | React.MouseEvent<HTMLAnchorElement, MouseEvent>
          | React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => viewFeedback(e),
    },
  ];

  return (
    <div className="flex flex-col w-[50%] min-h-[390px] h-full items-center justify-center">
      <h1 className="font-SpaceGrotesk text-secondary font-semibold text-[30px] max-md:text-[20px] text-center">
        Thank you for sharing your feedback!
      </h1>
      <div className="bg-secondary h-[395px] transition-transform duration-300 hover:scale-105 shadow-2xl w-full text-neutral my-[30px] p-5 rounded-xl flex flex-col items-center gap-[30px]">
        {feedback.id === "" ? (
          <MinimalPreviewFeedbackSkeleton></MinimalPreviewFeedbackSkeleton>
        ) : (
          <>
            <div className="flex w-full justify-between">
              <div className="w-full font-semibold flex items-center justify-between rounded-lg text-secondary h-[38px]">
                <div className="bg-neutral w-max font-semibold flex items-center gap-2 p-2 rounded-lg text-secondary">
                  <svg
                    width={svgSize}
                    height={svgSize}
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                    className={`rounded-full flex justify-center items-center`}
                  >
                    <circle
                      cx={svgSize / 2}
                      cy={svgSize / 2 + 0.5}
                      r={trustSoreRadius + 0.7}
                      stroke="#141e46"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${fullCircle + 0.1}`}
                      style={{
                        transition: "stroke-dashoffset 1s ease-in-out",
                        strokeDashoffset: `calc(${fullCircle} - (${fullCircle} * ${feedback.trustScore} / 10))`,
                      }}
                      transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                      strokeLinecap="round"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dy="0.3em"
                      fontSize="14"
                      fill="#141e46"
                    >
                      {feedback.trustScore}
                    </text>
                  </svg>
                </div>
                <div className="flex items-center gap-1 bg-neutral p-2 rounded-lg h-[38px]">
                  <div className="rounded-full min-w-[20px] min-h-[20px] bg-secondary flex justify-center items-center">
                    <Image
                      className="min-w-[15px]"
                      src={
                        feedback.feedbackType === "Publicly"
                          ? PublicIconMinimal
                          : AnonymousIconMinimal
                      }
                      height={15}
                      width={15}
                      alt={
                        feedback.feedbackType === "Publicly"
                          ? PublicIconMinimal
                          : AnonymousIconMinimal
                      }
                    ></Image>
                  </div>
                  <p className="text-[10px]">{feedback.feedbackType}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mb-[5px]">
              <Image
                className="min-w-[70px]"
                src={feedback.companyLogo}
                height={150}
                width={150}
                alt={feedback.companyLogo}
              ></Image>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[20px]">
                  {feedback.companyName}
                </p>
                <p className="font-medium">{feedback.jobStatus}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {buttons.map((item, index) => {
                return (
                  <CustomizedTooltip
                    key={index}
                    placement="top"
                    title={item.text}
                    arrow
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        item.onclick(e);
                      }}
                      className={`p-1 w-[32px] relative h-[32px] justify-center  rounded-md bg-neutral flex items-center gap-1 text-secondary`}
                    >
                      <Image
                        className="min-w-[20px]"
                        src={item.icon}
                        height={20}
                        width={20}
                        alt={item.icon}
                      ></Image>
                      {item.text === "Edit" && (
                        <div className="p-1 bg-primary text-neutral absolute rounded-sm text-[7px] left-2 top-5">
                          SOON
                        </div>
                      )}
                    </button>
                  </CustomizedTooltip>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Link
        href={"/home"}
        className={`p-3 text-secondary font-bold font-SpaceGrotesk w-[100%] border-2 border-secondary rounded-md mb-[10px] h-11 flex justify-center items-center`}
        onClick={(e) => {
          handleFeedbackFormClosing(e);
        }}
      >
        Back to home
      </Link>
    </div>
  );
};

const MinimalPreviewFeedbackSkeleton = () => {
  return (
    <>
      <SkeletonTheme baseColor="#D9D9D9" highlightColor="#fff5e0" height={395}>
        <div className="flex flex-col w-full h-full justify-between items-center gap-3">
          <div className="flex flex-col w-full justify-center items-center gap-3">
            <div className="flex w-full items-center justify-between">
              <Skeleton
                className=""
                containerClassName=""
                height={35}
                width={35}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName=""
                height={35}
                width={95}
              ></Skeleton>
            </div>
            <div className="w-[125px] h-[125px] rounded-full flex justify-center items-center">
              <Skeleton
                className=""
                containerClassName="flex-1"
                circle={true}
                height={125}
                width={125}
              ></Skeleton>
            </div>
            <div className="flex flex-col max-sm:items-center items-center justify-center ">
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={25}
                width={150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={25}
                width={105}
              ></Skeleton>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton
              className=""
              containerClassName="flex-1"
              height={32}
              width={32}
            ></Skeleton>
            <Skeleton
              className=""
              containerClassName="flex-1"
              height={32}
              width={32}
            ></Skeleton>
            <Skeleton
              className=""
              containerClassName="flex-1"
              height={32}
              width={32}
            ></Skeleton>
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
};
