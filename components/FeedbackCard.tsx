import Image from "next/image";
import CustomizedTooltip from "./CustomizedTooltip";
import linkedInIcon from "@/public/LInkedInIcon.svg";
import DefaultCompanyLogo from "@/public/DefaultCompanyLogo.svg";
import fun_face from "@/public/fun_face.svg";
import CompanyCityIcon from "@/public/CompanyCityIcon.svg";
import ContractTypeIcon from "@/public/ContractTypeIcon.svg";
import WorkLocationIcon from "@/public/WorkLocationIcon.svg";
import ProgressCheckIcon from "@/public/ProgressCheckIcon.svg";
import { useContext, useEffect } from "react";
import { useState, useRef } from "react";
import { UserContext } from "@/context/UserContext";

interface employmentDetailInterface {
  icon: string;
  text: string;
}

interface FeedbackInterface {
  ExperienceRate: number;
  id: string;
  CompanyLogo: string;
  CompanyName: string;
  CompanyLinkedIn: string;
  JobStatus: string;
  feedbackSubtitle: string;
  feedbackAuthorAvatar: string;
  feedbackAuthorUsername: string;
  creationDate: string;
  feedbackAuthorIntraLogin: string;
  employmentDetail: employmentDetailInterface[];
}

const getExperienceRateIcon = (experienceRate: number) => {
  const icons = [
    "VeryPoor.svg",
    "Poor.svg",
    "Average.svg",
    "Good.svg",
    "Excellent.svg",
  ];
  return icons[experienceRate];
};

const getExperienceRateText = (experienceRate: number) => {
  const icons = ["VeryPoor", "Poor", "Average", "Good", "Excellent"];
  return icons[experienceRate];
};

export const FeedbackCard = () => {
  const userInfo = useContext(UserContext);
  const [isExpandFeedbackCard, setIsExpandFeedbackCard] = useState(false);
  const [PreviewFeedbackCardPosition, setPreviewFeedbackCardPosition] =
    useState({ top: 0, left: 0 });
  const avatar = userInfo?.userInfo?.avatar
    ? userInfo?.userInfo?.avatar
    : "/default.jpeg";
  const feedback: FeedbackInterface = {
    ExperienceRate: fun_face,
    id: "1",
    CompanyLogo: DefaultCompanyLogo,
    CompanyName: "um6p",
    CompanyLinkedIn: "linkedInUrl",
    JobStatus: "software engineer",
    feedbackSubtitle: "feedback subtitle",
    feedbackAuthorAvatar: avatar, // will be replaced by the actual feedback author avatar
    feedbackAuthorUsername: "feedbackAuthorUsername",
    creationDate: "dateTime",
    feedbackAuthorIntraLogin: "feedbackAuthorIntraLogin",
    employmentDetail: [
      { icon: WorkLocationIcon, text: "Location" },
      { icon: ContractTypeIcon, text: "Contract" },
      { icon: CompanyCityIcon, text: "City" },
      { icon: ProgressCheckIcon, text: "Progress" },
    ],
  };

  return (
    <>
      {isExpandFeedbackCard === true && (
        <div className="absolute h-full w-[100%] top-0 z-[100] bg-white/50 backdrop-blur-xl flex justify-center">
          <div className="w-full flex justify-center items-start fixed mt-[90px]">
            <ExpandedFeedbackCard
              PreviewFeedbackCardPosition={PreviewFeedbackCardPosition}
              isExpandFeedbackCard={isExpandFeedbackCard}
              setIsExpandFeedbackCard={setIsExpandFeedbackCard}
              feedback={feedback}
            ></ExpandedFeedbackCard>
          </div>
        </div>
      )}
      <PreviewFeedbackCard
        setPreviewFeedbackCardPosition={setPreviewFeedbackCardPosition}
        setIsExpandFeedbackCard={setIsExpandFeedbackCard}
        feedback={feedback}
      ></PreviewFeedbackCard>
    </>
  );
};

const PreviewFeedbackCard = ({
  setPreviewFeedbackCardPosition,
  setIsExpandFeedbackCard,
  feedback,
}: {
  setPreviewFeedbackCardPosition: (position: {
    top: number;
    left: number;
  }) => void;
  setIsExpandFeedbackCard: (value: boolean) => void;
  feedback: FeedbackInterface;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const PreviewFeedbackCardRef = useRef<HTMLDivElement>(null);
  const circleRadius = 15;

  return (
    <div
      ref={PreviewFeedbackCardRef}
      onClick={() => {
        setIsExpandFeedbackCard(true);
        if (PreviewFeedbackCardRef.current) {
          const rect = PreviewFeedbackCardRef.current.getBoundingClientRect();
          console.log("rect.top", rect.top);
          console.log("rect.left", rect.left);

          setPreviewFeedbackCardPosition({
            top: rect.top,
            left: rect.left,
          });
        }
      }}
      className={`flex "cursor-pointer" flex-col p-10 max-md:p-5 cursor-pointer bg-white max-sm:px-[15px] max-sm:py-[15px] rounded-[16px] mb-[50px] w-[100%] max-w-[850px] max-md:h-max shadow-lg font-inter text-[#00224D] gap-[10px]`}
    >
      <div className="flex justify-between gap-[10px] max-md:flex-col">
        <div className="flex max-sm:flex-col justify-center items-center gap-4 h-max min-h-[110px]">
          <div className="flex justify-start items-end rounded-full select-none">
            <Image
              src={feedback.CompanyLogo}
              alt={feedback.CompanyLogo}
              width={125}
              height={125}
              className="rounded-full"
            />
            <CustomizedTooltip
              placement="bottom"
              title={`${getExperienceRateText(feedback.ExperienceRate)} Experience`}
              arrow
            >
              <div
                className={`w-[${circleRadius * 2}] h-[${
                  circleRadius * 2
                }]  ml-[-30px]`}
              >
                <Image
                  src={getExperienceRateIcon(feedback.ExperienceRate)}
                  alt={getExperienceRateIcon(feedback.ExperienceRate)}
                  width={20}
                  height={20}
                  className="ml-[5px] mb-[-25px] relative z-[9]"
                />
                <svg
                  width={circleRadius * 2}
                  height={circleRadius * 2}
                  xmlns="http://www.w3.org/2000/svg"
                  // className="border border-[blue]"
                >
                  <circle
                    r={circleRadius}
                    cx={circleRadius}
                    cy={circleRadius}
                    fill="#d1d5db"
                  />
                </svg>
              </div>
            </CustomizedTooltip>
          </div>
          <div className="flex flex-col h-full w-full max-sm:items-center justify-center">
            <div className="font-bold text-2xl max-lg:text-lg flex gap-1 items-center">
              {feedback.CompanyName}
              {feedback.CompanyLinkedIn !== "" && (
                <a
                  href={feedback.CompanyLinkedIn}
                  target="_blank"
                  className=" select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Image src={linkedInIcon} alt="" width={25} height={25} />
                </a>
              )}
            </div>
            <p className="font-semibold text-xl max-lg:text-base">
              {feedback.JobStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-wrap max-md:justify-end max-sm:justify-center w-[310px] lg:w-[310px] max-md:min-w-full gap-[10px] max-sm:w-full max-sm:gap-[5px] h-max font-medium">
          {feedback.employmentDetail.map(
            (employmentDetail: employmentDetailInterface, index: number) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-[5px] rounded-[14px] border border-[#00224D] w-[150px] max-lg:w-[48%] max-md:max-w-[140px] max-md:text-xs min-w-max h-[50px] p-[5px] max-lg:text-sm"
                >
                  <div className="bg-[#00224D] rounded-full min-w-[35px] min-h-[35px] flex justify-center items-center">
                    <Image
                      src={employmentDetail.icon}
                      className="select-none"
                      alt={employmentDetail.icon}
                      width={`${
                        employmentDetail.icon === ContractTypeIcon ? 17 : 20
                      }`}
                      height={`${
                        employmentDetail.icon === ContractTypeIcon ? 17 : 20
                      }`}
                    />
                  </div>
                  {employmentDetail.text}
                </div>
              );
            },
          )}
          {feedback.feedbackAuthorIntraLogin !== "" && (
            <div className="w-full h-max flex justify-end z-[1] select-none">
              <a
                href={`https://profile.intra.42.fr/users/${feedback.feedbackAuthorIntraLogin}`}
                target="_blank"
                className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  src="/42-logo.svg"
                  alt="42-logo.svg"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          )}
        </div>
      </div>
      {feedback.feedbackSubtitle !== "" ? (
        <div className="flex justify-between items-start flex-col mt-[-30px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedback.feedbackAuthorAvatar || ""}
              alt={feedback.feedbackAuthorAvatar || ""}
              width={40}
              height={40}
              className="rounded-full select-none max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D] mb-1"
            />
            <p className="mb-[15px] font-semibold">
              {feedback.feedbackAuthorUsername}
            </p>
          </div>
          <div className="border-2 border-[#00224D] p-4 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px]">
            <p className="overflow-x-auto w-full dark-scrollbar">
              {feedback.feedbackSubtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex border-2 border-[#00224D] rounded-2xl justify-between items-center p-2 gap-[5px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedback.feedbackAuthorAvatar || ""}
              alt={feedback.feedbackAuthorAvatar || ""}
              width={50}
              height={50}
              className="rounded-full max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D]"
            />
            <p className="font-semibold">{feedback.feedbackAuthorUsername}</p>
          </div>
          <div className="w-max h-max flex">
            <a
              href={`https://profile.intra.42.fr/users/${feedback.feedbackAuthorIntraLogin}`}
              target="_blank"
              className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/42-logo.svg"
                alt="42-logo.svg"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-col max-sm:ml-[7px]">
          {feedback.creationDate}
        </div>
        <button
          onMouseEnter={() => setIsHovered(true)}
          onClick={() => setIsExpandFeedbackCard(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="text-[#41B06E] select-none flex item hover:bg-[#41B06E] hover:text-white s-center gap-[3px] border-[2px] border-[#41B06E] rounded-xl p-2 h-max"
        >
          <Image
            src={`${isHovered ? "/CommentIconLight.svg" : "/CommentIcon.svg"}`}
            alt="CommentIcon.svg"
            width={20}
            height={20}
          />
          <p className="max-sm:hidden">Comment</p>
        </button>
      </div>
    </div>
  );
};

const ExpandedFeedbackCard = ({
  setIsExpandFeedbackCard,
  isExpandFeedbackCard,
  PreviewFeedbackCardPosition,
  feedback,
}: {
  feedback: FeedbackInterface;
  setIsExpandFeedbackCard: (value: boolean) => void;
  isExpandFeedbackCard: boolean;
  PreviewFeedbackCardPosition: { top: number; left: number };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnExpandingFeedbackCard, setIsUnExpandingFeedbackCard] =
    useState(false);
  const ExpandedFeedbackCardRef = useRef<HTMLDivElement>(null);
  const circleRadius = 15;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ExpandedFeedbackCardRef.current &&
        !ExpandedFeedbackCardRef.current.contains(e.target as Node)
      ) {
        closeExpandedFeedbackCard(e);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeExpandedFeedbackCard = (
    e: MouseEvent | React.MouseEvent<HTMLButtonElement>,
  ) => {
    setIsUnExpandingFeedbackCard(true);
    setTimeout(() => {
      setIsUnExpandingFeedbackCard(false);
      setIsExpandFeedbackCard(false);
    }, 400);
    if (e instanceof MouseEvent) e.stopPropagation();
  };

  return (
    <div
      onClick={() => setIsExpandFeedbackCard(true)}
      style={{
        transformOrigin: `${PreviewFeedbackCardPosition.left}px ${PreviewFeedbackCardPosition.top}px`,
      }}
      className={`flex ${isExpandFeedbackCard === true ? "expand-height absolute z-[101]" : "cursor-pointer"} bg-white flex-col p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] rounded-[16px] mb-[50px] mt-[50px] w-[100%] max-w-[850px] max-md:h-max shadow-lg font-inter text-[#00224D] gap-[10px] ${isExpandFeedbackCard !== true ? "transition-shadow duration-300 hover:shadow-2xl" : ""} ${isUnExpandingFeedbackCard === true ? "un-expand-height" : ""}`}
    >
      <div className="w-full flex absolute top-[-50px] left-[1px] justify-end">
        <button
          className="p-3 bg-neutral text-secondary border border-secondary rounded-xl"
          onClick={(e) => {
            closeExpandedFeedbackCard(e);
          }}
        >
          bac
        </button>
      </div>
      <div
        ref={ExpandedFeedbackCardRef}
        className="flex justify-between gap-[10px] max-md:flex-col"
      >
        <div className="flex max-sm:flex-col justify-center items-center gap-4 h-max min-h-[110px]">
          <div className="flex justify-start items-end rounded-full select-none">
            <Image
              src={feedback.CompanyLogo}
              alt={feedback.CompanyLogo}
              width={125}
              height={125}
              className="rounded-full"
            />
            <CustomizedTooltip
              placement="bottom"
              title={`${getExperienceRateText(feedback.ExperienceRate)} Experience`}
              arrow
            >
              <div
                className={`w-[${circleRadius * 2}] h-[${
                  circleRadius * 2
                }]  ml-[-30px]`}
              >
                <Image
                  src={getExperienceRateIcon(feedback.ExperienceRate)}
                  alt={getExperienceRateIcon(feedback.ExperienceRate)}
                  width={20}
                  height={20}
                  className="ml-[5px] mb-[-25px] relative z-[9]"
                />
                <svg
                  width={circleRadius * 2}
                  height={circleRadius * 2}
                  xmlns="http://www.w3.org/2000/svg"
                  // className="border border-[blue]"
                >
                  <circle
                    r={circleRadius}
                    cx={circleRadius}
                    cy={circleRadius}
                    fill="#d1d5db"
                  />
                </svg>
              </div>
            </CustomizedTooltip>
          </div>
          <div className="flex flex-col h-full w-full max-sm:items-center justify-center">
            <div className="font-bold text-2xl max-lg:text-lg flex gap-1 items-center">
              {feedback.CompanyName}
              {feedback.CompanyLinkedIn !== "" && (
                <a
                  href={feedback.CompanyLinkedIn}
                  target="_blank"
                  className=" select-none"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Image src={linkedInIcon} alt="" width={25} height={25} />
                </a>
              )}
            </div>
            <p className="font-semibold text-xl max-lg:text-base">
              {feedback.JobStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-wrap max-md:justify-end max-sm:justify-center w-[310px] lg:w-[310px] max-md:min-w-full gap-[10px] max-sm:w-full max-sm:gap-[5px] h-max font-medium">
          {feedback.employmentDetail.map(
            (employmentDetail: employmentDetailInterface, index: number) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-[5px] rounded-[14px] border border-[#00224D] w-[150px] max-lg:w-[48%] max-md:max-w-[140px] max-md:text-xs min-w-max h-[50px] p-[5px] max-lg:text-sm"
                >
                  <div className="bg-[#00224D] rounded-full min-w-[35px] min-h-[35px] flex justify-center items-center">
                    <Image
                      src={employmentDetail.icon}
                      className="select-none"
                      alt={employmentDetail.icon}
                      width={`${
                        employmentDetail.icon === ContractTypeIcon ? 17 : 20
                      }`}
                      height={`${
                        employmentDetail.icon === ContractTypeIcon ? 17 : 20
                      }`}
                    />
                  </div>
                  {employmentDetail.text}
                </div>
              );
            },
          )}
          {feedback.feedbackAuthorIntraLogin !== "" && (
            <div className="w-full h-max flex justify-end z-[1] select-none">
              <a
                href={`https://profile.intra.42.fr/users/${feedback.feedbackAuthorIntraLogin}`}
                target="_blank"
                className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  src="/42-logo.svg"
                  alt="42-logo.svg"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          )}
        </div>
      </div>
      {feedback.feedbackSubtitle !== "" ? (
        <div className="flex justify-between items-start flex-col mt-[-30px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedback.feedbackAuthorAvatar || ""}
              alt={feedback.feedbackAuthorAvatar || ""}
              width={40}
              height={40}
              className="rounded-full select-none max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D] mb-1"
            />
            <p className="mb-[15px] font-semibold">
              {feedback.feedbackAuthorUsername}
            </p>
          </div>
          <div className="border-2 border-[#00224D] p-4 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px]">
            <p className="overflow-x-auto w-full dark-scrollbar">
              {feedback.feedbackSubtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex border-2 border-[#00224D] rounded-2xl justify-between items-center p-2 gap-[5px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedback.feedbackAuthorAvatar || ""}
              alt={feedback.feedbackAuthorAvatar || ""}
              width={50}
              height={50}
              className="rounded-full max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D]"
            />
            <p className="font-semibold">{feedback.feedbackAuthorUsername}</p>
          </div>
          <div className="w-max h-max flex">
            <a
              href={`https://profile.intra.42.fr/users/${feedback.feedbackAuthorIntraLogin}`}
              target="_blank"
              className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/42-logo.svg"
                alt="42-logo.svg"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-col max-sm:ml-[7px]">
          {feedback.creationDate}
        </div>
        {isExpandFeedbackCard !== true && (
          <button
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => setIsExpandFeedbackCard(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-[#41B06E] select-none flex item hover:bg-[#41B06E] hover:text-white s-center gap-[3px] border-[2px] border-[#41B06E] rounded-xl p-2 h-max"
          >
            <Image
              src={`${isHovered ? "/CommentIconLight.svg" : "/CommentIcon.svg"}`}
              alt="CommentIcon.svg"
              width={20}
              height={20}
            />
            <p className="max-sm:hidden">Comment</p>
          </button>
        )}
      </div>
    </div>
  );
};
