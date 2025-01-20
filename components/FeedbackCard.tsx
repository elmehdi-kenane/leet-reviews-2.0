import Image from "next/image";
import CustomizedTooltip from "./CustomizedTooltip";
import linkedInIcon from "@/public/LInkedInIcon.svg";
import CompanyCityIcon from "@/public/CompanyCityIcon.svg";
import ContractTypeIcon from "@/public/ContractTypeIcon.svg";
import WorkLocationIcon from "@/public/WorkLocationIcon.svg";
import ProgressCheckIcon from "@/public/ProgressCheckIcon.svg";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { FeedbackInterface, employmentDetailInterface } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { RefObject } from "react";

const getExperienceRateIcon = (experienceRate: number) => {
  const icons = [
    "/VeryPoor.svg",
    "/Poor.svg",
    "/Average.svg",
    "/Good.svg",
    "/Excellent.svg",
  ];
  return icons[experienceRate - 1];
};

const getExperienceRateText = (experienceRate: number) => {
  const texts = ["VeryPoor", "Poor", "Average", "Good", "Excellent"];
  return texts[experienceRate - 1];
};

export const FeedbackCard = ({ feedback }: { feedback: FeedbackInterface }) => {
  const searchParams = useSearchParams();
  const feedbackId = searchParams.get("feedbackId");

  const [isExpandFeedbackCard, setIsExpandFeedbackCard] = useState(
    feedbackId === feedback.id ? true : false,
  );
  const [PreviewFeedbackCardPosition, setPreviewFeedbackCardPosition] =
    useState({ top: 0, left: 0 });
  const PreviewFeedbackCardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isExpandFeedbackCard === true && (
        <div className="absolute font-SpaceGrotesk h-full min-w-[100%] top-0 z-[151] bg-white/50 backdrop-blur-xl flex justify-center">
          <div
            className="max-w-[860px] w-full flex justify-center h-full items-start overflow-auto"
            ref={PreviewFeedbackCardRef}
          >
            <PreviewFeedbackCard
              PreviewFeedbackCardPosition={PreviewFeedbackCardPosition}
              isExpandFeedbackCard={true}
              PreviewFeedbackCardRef={PreviewFeedbackCardRef}
              setPreviewFeedbackCardPosition={setPreviewFeedbackCardPosition}
              setIsExpandFeedbackCard={setIsExpandFeedbackCard}
              feedback={feedback}
            ></PreviewFeedbackCard>
          </div>
        </div>
      )}
      <PreviewFeedbackCard
        PreviewFeedbackCardPosition={PreviewFeedbackCardPosition}
        isExpandFeedbackCard={false}
        PreviewFeedbackCardRef={PreviewFeedbackCardRef}
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
  isExpandFeedbackCard,
  PreviewFeedbackCardPosition,
  PreviewFeedbackCardRef,
}: {
  setPreviewFeedbackCardPosition: (position: {
    top: number;
    left: number;
  }) => void;
  setIsExpandFeedbackCard: (value: boolean) => void;
  isExpandFeedbackCard: boolean;
  PreviewFeedbackCardPosition: { top: number; left: number };
  feedback: FeedbackInterface;
  PreviewFeedbackCardRef: RefObject<HTMLDivElement>;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnExpandingFeedbackCard, setIsUnExpandingFeedbackCard] =
    useState(false);
  const router = useRouter();

  const circleRadius = 15;

  const employmentDetails: employmentDetailInterface[] = [
    { icon: WorkLocationIcon, text: feedback.workingType },
    { icon: ContractTypeIcon, text: feedback.contractType },
    { icon: CompanyCityIcon, text: feedback.companyLocation },
    { icon: ProgressCheckIcon, text: feedback.jobProgressType },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        PreviewFeedbackCardRef.current &&
        !PreviewFeedbackCardRef.current.contains(e.target as Node)
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
    if (isExpandFeedbackCard === false) return;
    console.log("PreviewFeedbackCardRef", PreviewFeedbackCardRef);
    router.push(`/home`);
    setIsUnExpandingFeedbackCard(true);
    setTimeout(() => {
      setIsUnExpandingFeedbackCard(false);
      setIsExpandFeedbackCard(false);
    }, 400);
    if (e instanceof MouseEvent) e.stopPropagation();
  };

  return (
    <div
      onClick={() => {
        router.push(`/home?feedbackId=${feedback.id}`);
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
      style={{
        transformOrigin: `${PreviewFeedbackCardPosition.left / 2}px ${PreviewFeedbackCardPosition.top}px`,
      }}
      className={`flex font-SpaceGrotesk ${isExpandFeedbackCard === true ? "expand-height z-[101] mt-[160px] mb-[100px]" : "cursor-pointer"} bg-neutral flex-col p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] rounded-[16px] mb-[50px] w-[100%] max-w-[850px] max-md:h-max shadow-lg font-inter text-[#00224D] gap-[10px] ${isExpandFeedbackCard !== true ? "transition-shadow duration-300 hover:shadow-2xl" : ""} ${isUnExpandingFeedbackCard === true ? "un-expand-height" : ""}`}
    >
      <div className="flex justify-between gap-[10px] max-md:flex-col items-center">
        <div className="flex max-sm:flex-col justify-center items-center gap-4 h-max min-h-[110px]">
          <div className="flex justify-start items-end rounded-full select-none">
            <Image
              src={feedback.companyLogo}
              alt={feedback.companyLogo}
              width={125}
              height={125}
              className="rounded-full min-w-[125px] min-h-[125px] max-w-[125px] max-h-[125px] border-2 border-secondary"
            />
            <CustomizedTooltip
              placement="bottom"
              title={`${getExperienceRateText(feedback.experienceRate)} Experience`}
              arrow
            >
              <div
                className={`w-[${circleRadius * 2}] h-[${
                  circleRadius * 2
                }]  ml-[-30px]`}
              >
                <Image
                  src={getExperienceRateIcon(feedback.experienceRate)}
                  alt={getExperienceRateIcon(feedback.experienceRate)}
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
                    fill="#FFF5E0"
                  />
                </svg>
              </div>
            </CustomizedTooltip>
          </div>
          <div className="flex flex-col h-full w-full max-sm:items-center justify-center">
            <div className="font-bold text-2xl max-lg:text-lg flex gap-1 items-center">
              {feedback.companyName}
              {feedback.companyLinkedIn !== "" && (
                <a
                  href={feedback.companyLinkedIn}
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
              {feedback.jobStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-wrap max-md:justify-end max-sm:justify-center w-[310px] lg:w-[310px] max-md:min-w-full gap-[10px] max-sm:w-full max-sm:gap-[5px] h-max font-medium">
          {employmentDetails.map(
            (employmentDetail: employmentDetailInterface, index: number) => {
              return (
                <div
                  key={index}
                  className={`flex ${employmentDetail.text === "" ? "hidden" : ""} items-center gap-[5px] rounded-[14px] border border-[#00224D] w-[150px] max-lg:w-[48%] max-md:max-w-[140px] max-md:text-xs min-w-max h-[50px] p-[5px] max-lg:text-sm ${index != 0 && employmentDetails[index - 1].text === "" ? "min-w-full w-full max-w-full max-lg:w-full" : ""}`}
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
                  <p className="font-semibold">{employmentDetail.text}</p>
                </div>
              );
            },
          )}
        </div>
      </div>
      {feedback.authorComment !== "" ? (
        <div className="flex justify-between items-start flex-col">
          <div className="flex items-center gap-1">
            <Image
              src={feedback.authorAvatar || ""}
              alt={feedback.authorAvatar || ""}
              width={40}
              height={40}
              className="rounded-full select-none max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D] mb-1"
            />
            <p className="mb-[15px] font-semibold">{feedback.authorName}</p>
          </div>
          <div className="border-2 border-secondary p-2 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px] flex items-center h-[60px]">
            <p className="overflow-x-auto w-full font-Inter dark-scrollbar">
              {feedback.authorComment}
            </p>
            {feedback.authorIntraProfile !== "" && (
              <div className="h-max flex">
                <a
                  href={feedback.authorIntraProfile}
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
      ) : (
        <div className="flex border-2 border-[#00224D] rounded-2xl justify-between items-center mt-[24px] p-2 gap-[5px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedback.authorAvatar || ""}
              alt={feedback.authorAvatar || ""}
              width={50}
              height={50}
              className="rounded-full max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D]"
            />
            <p className="font-semibold">{feedback.authorName}</p>
          </div>
          {feedback.authorIntraProfile !== "" && (
            <div className="h-max flex">
              <a
                href={feedback.authorIntraProfile}
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
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-col max-sm:ml-[7px]">
          <p className="font-medium italic text-[12px]">
            {formatDistanceToNow(new Date(feedback.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        {!isExpandFeedbackCard && (
          <button
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => setIsExpandFeedbackCard(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-[#41B06E] select-none items-center flex item hover:bg-[#41B06E] hover:text-neutral s-center gap-[3px] border-[2px] border-[#41B06E] rounded-xl p-2 h-max"
          >
            <Image
              src={`${isHovered ? "/CommentIconLight.svg" : "/CommentIcon.svg"}`}
              alt="CommentIcon.svg"
              width={20}
              height={20}
            />
            <p className="max-sm:hidden font-semibold">Comment</p>
          </button>
        )}
      </div>
      {isExpandFeedbackCard && !isUnExpandingFeedbackCard && (
        <div className="w-full flex absolute top-[910px] left-[1px] justify-between">
          <button className="p-3 bg-secondary text-neutral rounded-xl font-semibold w-max flex gap-2">
            <p>Report feedback</p>
          </button>
          <button
            className="p-3 bg-secondary text-neutral rounded-xl font-semibold w-max flex gap-2"
            onClick={(e) => {
              closeExpandedFeedbackCard(e);
              e.stopPropagation();
            }}
          >
            <p>Back</p>
            <Image
              src={"/back-to-home.svg"}
              alt={"/back-to-home.svg"}
              width={25}
              height={25}
              className="rounded-full min-w-[25px] min-h-[25px] max-w-[25px] max-h-[25px]"
            />
          </button>
        </div>
      )}
    </div>
  );
};
