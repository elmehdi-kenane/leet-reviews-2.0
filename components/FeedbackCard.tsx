import Image from "next/image";
import CustomizedTooltip from "./CustomizedTooltip";
import linkedInIcon from "@/public/LInkedInIcon.svg";
import CompanyCityIcon from "@/public/CompanyCityIcon.svg";
import ContractTypeIcon from "@/public/ContractTypeIcon.svg";
import WorkLocationIcon from "@/public/WorkLocationIcon.svg";
import ProgressCheckIcon from "@/public/ProgressCheckIcon.svg";
import saveIcon from "@/public/save-icon.svg";
import saveFilledIcon from "@/public/save-filled-icon.svg";
// import unSaveIcon from "@/public/un-save-icon.svg";
import { useEffect } from "react";
import { useState, useRef, useContext } from "react";
import { accountsArr } from "@/app/(protected)/settings/utils";
import {
  FeedbackInterface,
  employmentDetailInterface,
  commentInterface,
  voteInterface,
  saveInterface,
} from "@/lib/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { RefObject } from "react";
import AnonymousIcon from "@/public/AnonymousIcon.svg";
import link from "@/public/link-green.svg";
import arrowDown from "@/public/dislike.svg";
import arrowDownFilled from "@/public/dislike-filled.svg";
import arrowUp from "@/public/like.svg";
import arrowUpFilled from "@/public/like-filled.svg";
import { UserContext } from "@/context/UserContext";
import { tooltipClasses } from "@mui/material/Tooltip";

const getExperienceRateIcon = (experienceRate: number) => {
  const icons = [
    "/VeryPoorLight.svg",
    "/PoorLight.svg",
    "/AverageLight.svg",
    "/GoodLight.svg",
    "/ExcellentLight.svg",
  ];
  return icons[experienceRate - 1];
};

type votesCounterType = {
  up: number;
  down: number;
};

enum vote {
  NONE,
  UP,
  DOWN,
}

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

  let upVotesLength = 0;
  let downVotesLength = 0;

  if (feedback.votes) {
    upVotesLength = feedback.votes.filter(
      (vote: voteInterface) => vote.isUp === true,
    ).length;
    downVotesLength = feedback.votes.filter(
      (vote: voteInterface) => vote.isUp === false,
    ).length;
  }

  const [votesCounter, setVotesCounter] = useState<votesCounterType>({
    up: upVotesLength,
    down: downVotesLength,
  });
  const [SelectedVote, setSelectedVote] = useState(vote.NONE);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (feedbackId === feedback.id) setIsExpandFeedbackCard(true);
  }, [feedbackId, feedback.id]);

  const userContext = useContext(UserContext);

  useEffect(() => {
    if (feedback.saves) {
      const userSave = feedback.saves.find(
        (save: saveInterface) => save.authorId === userContext.userInfo?.id,
      );

      setIsSaved(userSave === undefined ? false : true);
    }
    if (feedback.votes) {
      const userVote = feedback.votes.find(
        (vote: voteInterface) => vote.authorId === userContext.userInfo?.id,
      );

      setSelectedVote(
        userVote === undefined
          ? vote.NONE
          : userVote.isUp === true
            ? vote.UP
            : vote.DOWN,
      );
    }
  }, [userContext.userInfo?.id]);

  const [PreviewFeedbackCardPosition, setPreviewFeedbackCardPosition] =
    useState({ top: 0, left: 0 });
  const PreviewFeedbackCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-max w-full flex justify-center">
      {isExpandFeedbackCard === true && (
        <div className="absolute font-SpaceGrotesk h-full min-w-[100%] top-0 z-[151] bg-white/50 backdrop-blur-xl flex justify-center">
          <div className="max-w-[860px] w-full flex justify-center h-full items-start overflow-auto">
            <PreviewFeedbackCard
              isSaved={isSaved}
              setIsSaved={setIsSaved}
              setVotesCounter={setVotesCounter}
              votesCounter={votesCounter}
              setSelectedVote={setSelectedVote}
              SelectedVote={SelectedVote}
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
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        setVotesCounter={setVotesCounter}
        votesCounter={votesCounter}
        setSelectedVote={setSelectedVote}
        SelectedVote={SelectedVote}
        PreviewFeedbackCardPosition={PreviewFeedbackCardPosition}
        isExpandFeedbackCard={false}
        PreviewFeedbackCardRef={PreviewFeedbackCardRef}
        setPreviewFeedbackCardPosition={setPreviewFeedbackCardPosition}
        setIsExpandFeedbackCard={setIsExpandFeedbackCard}
        feedback={feedback}
      ></PreviewFeedbackCard>
    </div>
  );
};

const PreviewFeedbackCard = ({
  setPreviewFeedbackCardPosition,
  setVotesCounter,
  setSelectedVote,
  setIsSaved,
  SelectedVote,
  isSaved,
  setIsExpandFeedbackCard,
  feedback,
  isExpandFeedbackCard,
  PreviewFeedbackCardPosition,
  votesCounter,
  PreviewFeedbackCardRef,
}: {
  setPreviewFeedbackCardPosition: (position: {
    top: number;
    left: number;
  }) => void;
  setVotesCounter: React.Dispatch<React.SetStateAction<votesCounterType>>;
  setIsExpandFeedbackCard: (value: boolean) => void;
  setSelectedVote: (value: vote) => void;
  setIsSaved: (value: boolean) => void;
  SelectedVote: vote;
  isSaved: boolean;
  isExpandFeedbackCard: boolean;
  PreviewFeedbackCardPosition: { top: number; left: number };
  votesCounter: { up: number; down: number };
  feedback: FeedbackInterface;
  PreviewFeedbackCardRef: RefObject<HTMLDivElement>;
}) => {
  const [isCommentBtnHovered, setIsCommentBtnHovered] = useState(false);
  const [isProfileHovering, setIsProfileHovering] = useState(false);
  const [isOrderByRecent, setIsOrderByRecent] = useState(true);

  const [isVoteBtnClicked, setIsVoteBtnClicked] = useState({
    save: false,
    up: false,
    down: false,
  });

  const userContext = useContext(UserContext);

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

  const ExpandedPreviewFeedbackCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ExpandedPreviewFeedbackCardRef.current &&
        !ExpandedPreviewFeedbackCardRef.current.contains(e.target as Node)
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
    router.push(`/home`);
    setIsUnExpandingFeedbackCard(true);
    setTimeout(() => {
      setIsUnExpandingFeedbackCard(false);
      setIsExpandFeedbackCard(false);
    }, 400);
    if (e instanceof MouseEvent) e.stopPropagation();
  };

  const openExpandedFeedbackCard = (
    e:
      | MouseEvent
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLDivElement>,
    isCommentAreaFocused: boolean,
  ) => {
    router.push(
      `/home?feedbackId=${feedback.id}&isCommentAreaFocused=${isCommentAreaFocused}`,
    );
    setIsExpandFeedbackCard(true);
    if (PreviewFeedbackCardRef.current) {
      const rect = PreviewFeedbackCardRef.current.getBoundingClientRect();

      setPreviewFeedbackCardPosition({
        top: rect.top,
        left: rect.left,
      });
    }
  };

  const createVote = async (feedbackId: string, isUp: boolean) => {
    try {
      await fetch(
        `/api/feedback/vote/create?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}&isUp=${isUp}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const createSave = async (feedbackId: string) => {
    try {
      await fetch(
        `/api/feedback/save/create?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteSave = async (feedbackId: string) => {
    try {
      await fetch(
        `/api/feedback/save/delete?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteVote = async (feedbackId: string, isUp: boolean) => {
    try {
      await fetch(
        `/api/feedback/vote/delete?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}&isUp=${isUp}`,
        {
          method: "POST",
        },
      );
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div
      ref={
        isExpandFeedbackCard === false
          ? PreviewFeedbackCardRef
          : ExpandedPreviewFeedbackCardRef
      }
      onClick={(e) => openExpandedFeedbackCard(e, false)}
      style={{
        transformOrigin: `${PreviewFeedbackCardPosition.left / 2}px ${PreviewFeedbackCardPosition.top}px`,
      }}
      className={`flex font-SpaceGrotesk ${isExpandFeedbackCard === true ? "expand-height z-[101] mt-[110px] mb-[100px]" : "cursor-pointer"} bg-neutral flex-col p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] rounded-[16px] mb-[50px] w-[100%] max-w-[850px] max-md:h-max shadow-lg font-inter text-[#00224D] gap-[10px] ${isExpandFeedbackCard !== true ? "transition-shadow duration-300 hover:shadow-2xl" : ""} ${isUnExpandingFeedbackCard === true ? "un-expand-height" : ""}`}
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
                    // fill="#FFFFFF"
                    fill="#141e46"
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
                  className={`flex ${employmentDetail.text === "" ? "hidden" : ""} items-center gap-[5px] rounded-[14px] border border-secondary bg-secondary text-neutral w-[150px] max-lg:w-[48%] max-md:max-w-[140px] max-md:text-xs h-[50px] p-[5px] max-lg:text-sm ${index != 0 && employmentDetails[index - 1].text === "" ? "min-w-full w-full max-w-full max-lg:w-full" : ""}`}
                >
                  <div className="bg-neutral rounded-full min-w-[35px] min-h-[35px] flex justify-center items-center">
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
                  {employmentDetail.icon === CompanyCityIcon &&
                  isExpandFeedbackCard === true ? (
                    <CustomizedTooltip
                      placement="bottom"
                      title={`${employmentDetail.text}`}
                      arrow
                    >
                      <p className="font-semibold truncate">
                        {employmentDetail.text}
                      </p>
                    </CustomizedTooltip>
                  ) : (
                    <p className="font-semibold truncate">
                      {employmentDetail.text}
                    </p>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
      {feedback.authorComment !== "" ? (
        <div className="flex justify-between items-start flex-col">
          <div className="flex items-center gap-1">
            <div
              className={`border-2 ${feedback.feedbackType === "Publicly" && isProfileHovering === true ? "border-primary cursor-pointer" : "border-secondary"} flex justify-center items-center mb-[5px] ml-[-14px] rounded-full w-[44px] h-[44px] relative z-[9] bg-neutral`}
              onClick={(e) => {
                if (feedback.feedbackType === "Publicly") {
                  e.stopPropagation();
                  router.push(`/profile?userId=${feedback.author.id}`);
                }
              }}
              onMouseEnter={() => setIsProfileHovering(true)}
              onMouseLeave={() => setIsProfileHovering(false)}
            >
              <Image
                src={
                  feedback.feedbackType === "Publicly"
                    ? feedback.author.avatar
                    : AnonymousIcon
                }
                alt={
                  feedback.feedbackType === "Publicly"
                    ? feedback.author.avatar
                    : AnonymousIcon
                }
                width={feedback.feedbackType === "Publicly" ? 40 : 30}
                height={feedback.feedbackType === "Publicly" ? 40 : 30}
                className={`rounded-full select-none max-w-[${feedback.feedbackType === "Publicly" ? 40 : 30}px] max-h-[${feedback.feedbackType === "Publicly" ? 40 : 30}px] w-[${feedback.feedbackType === "Publicly" ? 40 : 30}] h-[${feedback.feedbackType === "Publicly" ? 40 : 30}]`}
              />
            </div>
            <p
              className={`mb-[15px] font-semibold ${feedback.feedbackType === "Publicly" && isProfileHovering === true ? "text-primary cursor-pointer" : ""}`}
              onMouseEnter={() => setIsProfileHovering(true)}
              onMouseLeave={() => setIsProfileHovering(false)}
              onClick={(e) => {
                if (feedback.feedbackType === "Publicly") {
                  e.stopPropagation();
                  router.push(`/profile?userId=${feedback.author.id}`);
                }
              }}
            >
              {feedback.feedbackType === "Publicly"
                ? feedback.author.name
                : "Anonymous Author"}
            </p>
          </div>
          <div className="border-2 border-secondary p-2 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px] flex items-center h-[60px]">
            <p className="w-full font-Inter leading-4 max-sm:leading-3">
              {feedback.authorComment}
            </p>
            {feedback.author.linkedAccountProfileUrl !== "" &&
              feedback.feedbackType === "Publicly" && (
                <div className="h-max w-[40px] flex justify-end items-center ">
                  <a
                    href={feedback.author.linkedAccountProfileUrl}
                    className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Image
                      src={
                        accountsArr.find(
                          (acc) =>
                            acc.provider ===
                            feedback.author.accountDisplayedWithFeedbacks,
                        )?.avatar || ""
                      }
                      className="select-none"
                      alt={
                        accountsArr.find(
                          (acc) =>
                            acc.provider ===
                            feedback.author.accountDisplayedWithFeedbacks,
                        )?.avatar || ""
                      }
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
            <div
              className={`border-2 ${feedback.feedbackType === "Publicly" && isProfileHovering === true ? "border-primary cursor-pointer" : "border-secondary"} w-[44px] h-[44px] flex justify-center items-center rounded-full`}
              onClick={(e) => {
                if (feedback.feedbackType === "Publicly") {
                  e.stopPropagation();
                  router.push(`/profile?userId=${feedback.author.id}`);
                }
              }}
              onMouseEnter={() => setIsProfileHovering(true)}
              onMouseLeave={() => setIsProfileHovering(false)}
            >
              <Image
                src={
                  feedback.feedbackType === "Publicly"
                    ? feedback.author.avatar
                    : AnonymousIcon
                }
                alt={
                  feedback.feedbackType === "Publicly"
                    ? feedback.author.avatar
                    : AnonymousIcon
                }
                width={feedback.feedbackType === "Publicly" ? 40 : 30}
                height={feedback.feedbackType === "Publicly" ? 40 : 30}
                className={`rounded-full select-none max-w-[${feedback.feedbackType === "Publicly" ? 40 : 30}px] max-h-[${feedback.feedbackType === "Publicly" ? 40 : 30}px] w-[${feedback.feedbackType === "Publicly" ? 40 : 30}] h-[${feedback.feedbackType === "Publicly" ? 40 : 30}]`}
              />
            </div>
            <p
              className={`font-semibold ${feedback.feedbackType === "Publicly" && isProfileHovering === true ? "text-primary cursor-pointer" : ""}`}
              onClick={(e) => {
                if (feedback.feedbackType === "Publicly") {
                  e.stopPropagation();
                  router.push(`/profile?userId=${feedback.author.id}`);
                }
              }}
              onMouseEnter={() => setIsProfileHovering(true)}
              onMouseLeave={() => setIsProfileHovering(false)}
            >
              {feedback.feedbackType === "Publicly"
                ? feedback.author.name
                : "Anonymous Author"}
            </p>
          </div>
          {feedback.author.linkedAccountProfileUrl !== "" &&
            feedback.feedbackType === "Publicly" && (
              <div className="h-max w-[40px] flex justify-end items-center ">
                <a
                  href={feedback.author.linkedAccountProfileUrl}
                  className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(``);
                  }}
                >
                  <Image
                    src={
                      accountsArr.find(
                        (acc) =>
                          acc.provider ===
                          feedback.author.accountDisplayedWithFeedbacks,
                      )?.avatar || ""
                    }
                    className="select-none"
                    alt={
                      accountsArr.find(
                        (acc) =>
                          acc.provider ===
                          feedback.author.accountDisplayedWithFeedbacks,
                      )?.avatar || ""
                    }
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            )}
        </div>
      )}
      <div className="flex justify-between items-center">
        <CustomizedTooltip
          placement="top"
          title={`[ ${feedback.trustScore}/10 ]`}
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: "0px",
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: "0px",
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: "0px",
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: "0px",
                  },
              },
            },
          }}
          arrow
        >
          <div className="h-[44px] cursor-pointer select-none flex flex-col justify-center w-[100px]">
            <p className="text-sm">trust score</p>
            <div className="h-[8px] w-full border border-secondary rounded-full flex items-center py-1">
              <div
                className={`h-[8px] bg-secondary rounded-full`}
                style={{ width: `${feedback.trustScore * 10}%` }}
              ></div>
            </div>
          </div>
        </CustomizedTooltip>
        <div className="flex flex-col max-sm:ml-[7px]">
          <p className="font-medium italic text-[12px]">
            {formatDistanceToNow(new Date(feedback.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          {isExpandFeedbackCard === true && (
            <div className="flex gap-2">
              <button
                className={`rounded-xl h-[38px] px-2 w-[38px] select-none border-[2px] border-[#41B06E] flex justify-center items-center`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                  if (isSaved === false) {
                    toast.dismiss();
                    toast.success("feedback saved!");
                    createSave(feedback.id);
                  } else deleteSave(feedback.id);
                  setIsVoteBtnClicked({ save: true, up: false, down: false });
                  setTimeout(() => {
                    setIsVoteBtnClicked({
                      save: false,
                      up: false,
                      down: false,
                    });
                  }, 500);
                }}
              >
                <Image
                  src={isSaved === true ? saveFilledIcon : saveIcon}
                  alt={isSaved === true ? saveFilledIcon : saveIcon}
                  width={11}
                  height={11}
                  className={`${isVoteBtnClicked.save === true ? "click-animation" : ""}`}
                />
              </button>
              <button
                className={`rounded-xl h-[38px] px-2 w-[38px] select-none border-[2px] border-[#41B06E] flex justify-center items-center`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/home?feedbackId=${feedback.id}`,
                  );
                  toast.dismiss();
                  toast.success("feedback link copied!");
                }}
              >
                <Image src={link} alt={link} width={20} height={20} />
              </button>
            </div>
          )}
          <div className="flex border-[2px] border-[#41B06E] gap-2 px-2 rounded-xl h-[38px] items-center">
            <button
              className={`h-[38px] flex justify-center items-center `}
              onClick={(e) => {
                e.stopPropagation();
                setIsVoteBtnClicked({ save: false, up: true, down: false });
                setTimeout(() => {
                  setIsVoteBtnClicked({
                    save: false,
                    up: false,
                    down: false,
                  });
                }, 500);
                if (SelectedVote === vote.UP) {
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up - 1,
                    down: prev.down,
                  }));
                  setSelectedVote(vote.NONE);
                  deleteVote(feedback.id, true);
                  return;
                }
                if (SelectedVote === vote.DOWN) {
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up + 1,
                    down: prev.down - 1,
                  }));
                  deleteVote(feedback.id, false);
                } else
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up + 1,
                    down: prev.down,
                  }));
                createVote(feedback.id, true);
                setSelectedVote(vote.UP);
              }}
            >
              <Image
                src={SelectedVote === vote.UP ? arrowUpFilled : arrowUp}
                alt={SelectedVote === vote.UP ? arrowUpFilled : arrowUp}
                width={20}
                height={20}
                className={`${isVoteBtnClicked.up === true ? "click-animation" : ""} select-none`}
              />
              {isExpandFeedbackCard === true && (
                <p className="text-primary">{votesCounter.up}</p>
              )}
            </button>
            <button
              className={`h-[38px] flex justify-center items-center `}
              onClick={(e) => {
                e.stopPropagation();
                setIsVoteBtnClicked({ save: false, up: false, down: true });
                setTimeout(() => {
                  setIsVoteBtnClicked({
                    save: false,
                    up: false,
                    down: false,
                  });
                }, 500);
                if (SelectedVote === vote.DOWN) {
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up,
                    down: prev.down - 1,
                  }));
                  setSelectedVote(vote.NONE);
                  deleteVote(feedback.id, false);
                  return;
                }
                if (SelectedVote === vote.UP) {
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up - 1,
                    down: prev.down + 1,
                  }));
                  deleteVote(feedback.id, true);
                } else
                  setVotesCounter((prev: votesCounterType) => ({
                    up: prev.up,
                    down: prev.down + 1,
                  }));
                createVote(feedback.id, false);
                setSelectedVote(vote.DOWN);
              }}
            >
              <Image
                src={SelectedVote === vote.DOWN ? arrowDownFilled : arrowDown}
                alt={SelectedVote === vote.DOWN ? arrowDownFilled : arrowDown}
                width={20}
                height={20}
                className={`${isVoteBtnClicked.down === true ? "click-animation" : ""} select-none`}
              />
              {isExpandFeedbackCard === true && (
                <p className="text-primary">{votesCounter.down}</p>
              )}
            </button>
          </div>
          {!isExpandFeedbackCard && (
            <button
              onMouseEnter={() => setIsCommentBtnHovered(true)}
              onClick={(e) => {
                openExpandedFeedbackCard(e, true);
                e.stopPropagation();
              }}
              onMouseLeave={() => setIsCommentBtnHovered(false)}
              className="text-[#41B06E] select-none items-center flex item hover:bg-[#41B06E] hover:text-neutral s-center gap-[3px] border-[2px] border-[#41B06E] rounded-xl p-2 h-max"
            >
              <Image
                src={`${isCommentBtnHovered ? "/CommentIconLight.svg" : "/CommentIcon.svg"}`}
                alt="CommentIcon.svg"
                width={20}
                height={20}
              />
              {/* <p className="max-sm:hidden font-semibold">Comment</p> */}
            </button>
          )}
        </div>
      </div>
      {isExpandFeedbackCard && (
        <>
          <div className="w-full border-2 border-secondary h-[530px] p-3 rounded-xl flex flex-col">
            <CommentTextArea feedback={feedback}></CommentTextArea>
            {feedback.comments.length === 0 ? (
              <div className="flex flex-col justify-center items-center m-auto bg-secondary text-neutral p-3 rounded-lg">
                <p className="font-semibold text-xl mb-2">No comments yet!</p>
                <p className="italic">
                  Be the first to share your thoughts and start the
                  conversation.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end gap-1 mt-2 ml-auto w-max z-50 text-sm">
                  <p>order by:</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIsOrderByRecent(true)}
                      className={`${isOrderByRecent === true ? "underline" : ""} font-semibold`}
                    >
                      Most Recent
                    </button>
                    <p>•</p>
                    <button
                      onClick={() => setIsOrderByRecent(false)}
                      className={`${isOrderByRecent === false ? "underline" : ""} font-semibold`}
                    >
                      Oldest
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full overflow-y-auto mt-3 dark-scroll">
                  {isOrderByRecent === true
                    ? feedback.comments.map((comment) => {
                        return (
                          <Comment
                            feedbackType={feedback.feedbackType}
                            comment={comment}
                            key={comment.id}
                          ></Comment>
                        );
                      })
                    : [...feedback.comments].reverse().map((comment) => {
                        return (
                          <Comment
                            feedbackType={feedback.feedbackType}
                            comment={comment}
                            key={comment.id}
                          ></Comment>
                        );
                      })}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isExpandFeedbackCard && !isUnExpandingFeedbackCard && (
        <div className="w-full flex absolute top-[910px] left-[1px] justify-between">
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
          <button className="p-3 bg-secondary text-neutral rounded-xl font-semibold w-max flex gap-2">
            <p>Report feedback</p>
            <div className="p-1 bg-primary text-neutral absolute rounded-md text-[10px] right-2 top-9">
              SOON
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  feedbackType,
}: {
  comment: commentInterface;
  feedbackType: string;
}) => {
  const router = useRouter();
  const [isProfileHovering, setIsProfileHovering] = useState(false);
  return (
    <div className="flex justify-between items-start flex-col w-[99%]">
      <div className="flex items-center gap-1">
        <div
          onMouseEnter={() => setIsProfileHovering(true)}
          onMouseLeave={() => setIsProfileHovering(false)}
          className={`border-2 ${feedbackType === "Publicly" && isProfileHovering === true ? "border-primary cursor-pointer" : "border-secondary"} flex justify-center items-center mb-1 rounded-full w-[33px] h-[33px] relative z-[9] bg-neutral`}
          onClick={(e) => {
            if (feedbackType === "Publicly") {
              e.stopPropagation();
              router.push(`/profile?userId=${comment.authorId}`);
            }
          }}
        >
          <Image
            src={comment.author.avatar}
            alt={comment.author.avatar}
            width={30}
            height={30}
            className={`rounded-full select-none max-w-[${30}px] max-h-[${30}px] w-[${30}] h-[${30}]`}
          />
        </div>
        <p
          onClick={(e) => {
            if (feedbackType === "Publicly") {
              e.stopPropagation();
              router.push(`/profile?userId=${comment.authorId}`);
            }
          }}
          className={`mb-[20px] ${feedbackType === "Publicly" && isProfileHovering === true ? "text-primary cursor-pointer" : "text-secondary"} font-semibold text-sm`}
          onMouseEnter={() => setIsProfileHovering(true)}
          onMouseLeave={() => setIsProfileHovering(false)}
        >
          {comment.author.name}
        </p>
      </div>
      <div className="border border-secondary p-2 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px] flex items-center h-[60px]">
        <p className="overflow-auto w-full h-full font-Inter text-sm">
          {comment.text}
        </p>
      </div>
      <p className="text-[10px] ml-auto italic">
        {formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};

const CommentTextArea = ({ feedback }: { feedback: FeedbackInterface }) => {
  const [commentText, setCommentText] = useState("");
  const [isCommentAdding, setIsCommentAdding] = useState(false);
  const userContext = useContext(UserContext);

  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCommentAreaFocusedParam = searchParams.get("isCommentAreaFocused");
  useEffect(() => {
    if (isCommentAreaFocusedParam === "true" && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommentAreaFocusedParam]);

  const createComment = async (feedbackId: string, text: string) => {
    try {
      toast.loading("Posting...");
      setIsCommentAdding(true);
      setCommentText("");
      const response = await fetch(
        `/api/feedback/comment/create?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}&text=${text}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      toast.dismiss();
      toast.success("comment added!");
      setIsCommentAdding(false);
      userContext.setFeedbacks((prevFeedbacks: FeedbackInterface[]) => {
        const updatedFeedbacks: FeedbackInterface[] = prevFeedbacks.map(
          (feedback) => {
            if (feedback.id === data.newComment.feedbackId)
              feedback = {
                ...feedback,
                comments: [data.newComment, ...feedback.comments],
              };
            return feedback;
          },
        );
        return updatedFeedbacks;
      });
    } catch (error) {
      console.error("Error", error);
    }
  };
  const textareaMaxLength = 300;
  return (
    <div className="flex flex-col gap-2">
      <textarea
        disabled={isCommentAdding}
        ref={textareaRef}
        className="bg-transparent border border-secondary w-full p-2 rounded-lg border-tl-0 focus:outline-primary min-h-[70px] max-h-[70px] font-Inter"
        placeholder={`type your comment`}
        onChange={(e) => setCommentText(e.target.value)}
        maxLength={textareaMaxLength}
        value={commentText}
      ></textarea>
      <button
        className={`${commentText === "" ? "bg-gray cursor-not-allowed" : "bg-primary"} p-2 text-neutral rounded-md ml-auto text-[12px]`}
        onClick={() => {
          if (commentText !== "") createComment(feedback.id, commentText);
        }}
      >
        comment
      </button>
    </div>
  );
};
