"use client";
import Image from "next/image";
import { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { FeedbackInterface, saveInterface } from "@/lib/types";
import dots from "@/public/three-dots.svg";
import deleteFeedbackIcon from "@/public/delete.svg";
import editFeedbackIcon from "@/public/edit-feedback.svg";
import shareFeedbackIcon from "@/public/share.svg";
import dotsCross from "@/public/cross.svg";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import ArrowDownIcon from "@/public/arrow-down-profile.svg";
import ArrowUpIcon from "@/public/arrow-up-profile.svg";
import exploreArrow from "@/public/exploreArrow.svg";
import saveIcon from "@/public/save-icon.svg";
import saveFilledIcon from "@/public/save-filled-icon.svg";
import AnonymousIcon from "@/public/AnonymousIcon.svg";

export interface feedbackProfileInterface {
  id: string;
  companyLogo: string;
  companyName: string;
  feedbackType: string;
  jobStatus: string;
  experienceRate: number;
  author: authorFeedbackProfileInterface;
}

export interface authorFeedbackProfileInterface {
  id: string;
  avatar: string;
  name: string;
}

export interface commentInterface {
  id: string;
  feedbackId: string;
  feedback: feedbackProfileInterface;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface voteProfileInterface {
  id: string;
  feedbackId: string;
  feedback: feedbackProfileInterface;
  authorId: string;
  isUp: boolean;
  createdAt: string;
}

export interface accountProfileInterface {
  provider: string;
  username: string;
}

export interface userProfileInterface {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
  accounts: accountProfileInterface[];
}

export interface saveProfileInterface {
  id: string;
  authorId: string;
  feedbackId: string;
  createdAt: string;
  feedback: feedbackProfileInterface;
}

interface profileInterface {
  feedbacks: FeedbackInterface[];
  comments: commentInterface[];
  votes: voteProfileInterface[];
  saves: saveProfileInterface[];
  user: userProfileInterface;
  isOwn: boolean;
}

const circleRadius = 10;
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

export default function Profile() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<profileInterface | undefined>(
    undefined,
  );

  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`/api/profile/get?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        return;
      }

      const profile = await response.json();
      setProfile(profile.data);
      console.log("profile.data", profile.data);
    };
    fetchProfile();
  }, [userId]);

  return (
    <div className="text-neutral w-full h-full flex flex-col max-w-[850px] mx-auto gap-16">
      {profile ? (
        <>
          <ProfileHeader user={profile.user}></ProfileHeader>
          {profile.isOwn === true ? (
            <>
              <MyFeedbacksAndSavedWrapper
                feedbacks={profile.feedbacks}
                saves={profile.saves}
              ></MyFeedbacksAndSavedWrapper>
              <MyCommentsAndVotesWrapper
                comments={profile.comments}
                votes={profile.votes}
              ></MyCommentsAndVotesWrapper>
            </>
          ) : (
            <>
              <FeedbackAsVisitorWrapper
                feedbacks={profile.feedbacks}
              ></FeedbackAsVisitorWrapper>
              <MyCommentsAndVotesWrapper
                comments={profile.comments}
                votes={profile.votes}
              ></MyCommentsAndVotesWrapper>
            </>
          )}
        </>
      ) : (
        <h1>LOADING...</h1>
      )}
    </div>
  );
}

const ProfileHeader = ({ user }: { user: userProfileInterface }) => {
  const accountIcons = [
    {
      icon: "42-logo.svg",
      provider: "fortyTwo",
      onclick: () => {
        console.log("42-logo.svg");
      },
    },
    {
      icon: "discord.svg",
      provider: "discord",
      onclick: () => {
        console.log("discord.svg");
      },
    },
    {
      icon: "brand-github.svg",
      provider: "github",
      onclick: () => {
        console.log("brand-github.svg");
      },
    },
  ];

  return (
    <div className="gap-3 border-2 border-neutral p-8 rounded-3xl w-full">
      <div className="flex items-center gap-3">
        <Image
          src={user.avatar || "/default.jpeg"}
          alt={user.avatar || "/default.jpeg"}
          width={125}
          height={125}
          className="rounded-full select-none min-w-[125px] min-h-[125px] max-w-[125px] max-h-[125px] border-2 border-neutral"
        />
        <div className="flex flex-col">
          <p className="font-SpaceGrotesk text-[25px]">{user.name}</p>
          <p className="font-SpaceGrotesk text-[15px]">{user.bio}</p>
        </div>
        <div className="flex flex-col gap-2 mb-auto ml-auto">
          {user.accounts.map((account) => {
            const selectedIcon = accountIcons.find(
              (icon) => icon.provider === account.provider,
            );
            if (selectedIcon === undefined)
              return <div key={account.provider}>account not found!</div>;
            return (
              <button
                onClick={selectedIcon.onclick}
                key={account.provider}
                className="flex justify-center items-center border p-2 border-neutral hover:bg-primary rounded-full min-w-[36px] min-h-[36px]"
              >
                <Image
                  src={selectedIcon?.icon}
                  className="select-none"
                  alt={selectedIcon?.icon}
                  width={17}
                  height={17}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-SpaceGrotesk text-[12px] mt-auto italic">
          Joined • {format(new Date(user.createdAt), "dd MMMM yyyy")}
        </p>
        <button
          className="font-SpaceGrotesk text-[12px] bg-primary p-2 rounded-lg transition-transform duration-500 transform hover:scale-[1.05] select-none"
          onClick={() => {
            navigator.clipboard.writeText(
              `http://localhost:3000/profile?userId=${user.id}`,
            );
            toast.dismiss();
            toast.success("profile link copied!", {
              style: { background: "#fff5e0", color: "#141e46" },
            });
          }}
        >
          share profile
        </button>
      </div>
    </div>
  );
};

const MyFeedbacksAndSavedWrapper = ({
  feedbacks,
  saves,
}: {
  feedbacks: FeedbackInterface[];
  saves: saveProfileInterface[];
}) => {
  const [selectedBtn, setSelectedBtn] = useState(1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollHeight > containerRef.current.clientHeight,
        );
      }
    };

    // Initial check
    checkOverflow();

    // Optional: Recheck on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [selectedBtn]);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-neutral w-max p-2 flex gap-2 rounded-2xl font-SpaceGrotesk font-semibold select-none">
        <button
          onClick={() => setSelectedBtn(1)}
          className={`rounded-lg w-[140px] ${selectedBtn === 1 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          my feedbacks
        </button>
        <button
          onClick={() => setSelectedBtn(2)}
          className={`rounded-lg w-[140px] ${selectedBtn === 2 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          my saved
        </button>
      </div>
      <div
        className={`${isOverflowing === true ? "h-[280px]" : "h-[270px]"} w-full bg-neutral rounded-xl`}
      >
        {((selectedBtn === 1 && feedbacks.length === 0) ||
          (selectedBtn === 2 && saves.length === 0)) && (
          <div className="w-full h-full text-secondary font-SpaceGrotesk flex flex-col justify-center items-center font-semibold text-lg gap-3">
            <p>No {selectedBtn === 1 ? "feedbacks" : "saved"} available.</p>
            {selectedBtn === 1 ? (
              <p>Do you have an experience to share? Create a feedback!</p>
            ) : (
              <button
                onClick={() => router.push(`/home`)}
                className="bg-secondary text-neutral p-2 rounded-lg hover:bg-primary flex items-center gap-1 select-none transition-transform duration-500 transform hover:scale-[1.05]"
              >
                <p>explore feedbacks</p>
                <Image
                  src={exploreArrow}
                  alt={exploreArrow}
                  width={25}
                  height={15}
                  className=""
                />
              </button>
            )}
          </div>
        )}
        <div
          className={`${isOverflowing === true ? "w-[99%] mx-auto" : ""} h-[270px] rounded-2xl text-secondary flex gap-5 py-5 px-[14px] overflow-x-auto dark-scroll font-SpaceGrotesk`}
        >
          {selectedBtn === 1 &&
            feedbacks.length > 0 &&
            feedbacks.map((feedback) => {
              return (
                <FeedbackProfileCard
                  feedback={feedback}
                  key={feedback.id}
                ></FeedbackProfileCard>
              );
            })}
          {selectedBtn === 2 &&
            saves.length > 0 &&
            saves.map((save) => {
              return (
                <SaveProfileCard save={save} key={save.id}></SaveProfileCard>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const FeedbackAsVisitorWrapper = ({
  feedbacks,
}: {
  feedbacks: FeedbackInterface[];
}) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollHeight > containerRef.current.clientHeight,
        );
      }
    };

    // Initial check
    checkOverflow();

    // Optional: Recheck on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-neutral w-max p-2 flex gap-2 rounded-2xl font-SpaceGrotesk font-semibold select-none">
        <button
          className={`rounded-lg w-[140px] text-neutral bg-secondary p-2`}
        >
          feedbacks
        </button>
      </div>
      <div
        className={`${isOverflowing === true ? "h-[280px]" : "h-[270px]"} w-full bg-neutral rounded-xl`}
      >
        {feedbacks.length === 0 && (
          <div className="w-full h-full text-secondary font-SpaceGrotesk flex flex-col justify-center items-center font-semibold text-lg gap-3">
            <p>No feedbacks available.</p>
            <button
              onClick={() => router.push(`/home`)}
              className="bg-secondary text-neutral p-2 rounded-lg hover:bg-primary flex items-center gap-1 select-none transition-transform duration-500 transform hover:scale-[1.05]"
            >
              <p>explore feedbacks</p>
              <Image
                src={exploreArrow}
                alt={exploreArrow}
                width={25}
                height={15}
                className=""
              />
            </button>
          </div>
        )}
        <div
          className={`${isOverflowing === true ? "w-[99%] mx-auto" : ""} h-[270px] rounded-2xl text-secondary flex gap-5 py-5 px-[14px] overflow-x-auto dark-scroll font-SpaceGrotesk`}
        >
          {feedbacks.length > 0 &&
            feedbacks
              .filter((feedback) => feedback.feedbackType === "Publicly")
              .map((feedback) => {
                return (
                  <FeedbackAsVisitorCard
                    feedback={feedback}
                    key={feedback.id}
                  ></FeedbackAsVisitorCard>
                );
              })}
        </div>
      </div>
    </div>
  );
};

const PopUpDeleteFeedback = ({
  setIsPopUpDeleteFeedbackOpen,
  feedbackId,
}: {
  setIsPopUpDeleteFeedbackOpen: (value: boolean) => void;
  feedbackId: string;
}) => {
  const userContext = useContext(UserContext);

  const deleteFeedback = async (feedbackId: string) => {
    try {
      const response = await fetch(
        `/api/feedback/delete?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <div className="flex justify-center items-center z-30 absolute inset-0 h-full backdrop-blur-sm rounded-[45px]">
      <div className="flex justify-center items-center flex-col bg-secondary h-full bg-opacity-75 p-5 rounded-xl drop-shadow-xl PopUpUnSaveFeedback">
        <p className="font-semibold mb-4 text-white">
          Are you sure you want to delete feedback?
        </p>
        <div className="flex w-full justify-between gap-3 flex-col">
          <button
            className="w-full font-SpaceGrotesk rounded-lg p-2 border border-white text-white bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              deleteFeedback(feedbackId);
              setIsPopUpDeleteFeedbackOpen(false);
            }}
          >
            Yes, delete
          </button>
          <button
            className="w-full font-SpaceGrotesk rounded-lg p-2 border border-primary text-white bg-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopUpDeleteFeedbackOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const PopUpUnSaveFeedback = ({
  setIsPopUpUnSaveFeedbackOpen,
  setIsSaved,
  feedbackId,
}: {
  setIsPopUpUnSaveFeedbackOpen: (value: boolean) => void;
  setIsSaved: (value: boolean) => void;
  feedbackId: string;
}) => {
  const userContext = useContext(UserContext);

  const deleteSave = async (feedbackId: string) => {
    try {
      const response = await fetch(
        `/api/feedback/save/delete?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <div className="flex justify-center items-center z-30 absolute inset-0 h-full backdrop-blur-sm rounded-[45px]">
      <div className="flex justify-center items-center flex-col bg-secondary h-full bg-opacity-75 p-5 rounded-xl drop-shadow-xl PopUpUnSaveFeedback">
        <p className="font-semibold mb-4 text-white">
          Are you sure you want to un-save feedback?
        </p>
        <div className="flex w-full justify-between gap-3 flex-col">
          <button
            className="w-full font-SpaceGrotesk rounded-lg p-2 border border-white text-white bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              deleteSave(feedbackId);
              setIsSaved(false);
              setIsPopUpUnSaveFeedbackOpen(false);
            }}
          >
            Yes, un-save
          </button>
          <button
            className="w-full font-SpaceGrotesk rounded-lg p-2 border border-primary text-white bg-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsPopUpUnSaveFeedbackOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SaveProfileCard = ({ save }: { save: saveProfileInterface }) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(true);
  const [isPopUpUnSaveFeedbackOpen, setIsPopUpUnSaveFeedbackOpen] =
    useState(false);
  const userContext = useContext(UserContext);
  const createSave = async (feedbackId: string) => {
    try {
      const response = await fetch(
        `/api/feedback/save/create?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div
      onClick={() => router.push(`/home?feedbackId=${save.id}`)}
      className="bg-secondary cursor-pointer text-neutral min-w-[200px] max-w-[200px] flex rounded-lg flex-col items-center p-5 transition-transform duration-500 transform hover:scale-[1.05]"
      key={save.id}
    >
      <Image
        src={save.feedback.companyLogo}
        alt={save.feedback.companyLogo}
        width={70}
        height={70}
        className="rounded-full min-w-[70px] min-h-[70px] max-w-[70px] max-h-[70px] border-2 border-neutral"
      />
      <div
        className={`w-[${circleRadius * 2}] h-[${
          circleRadius * 2
        }]  ml-[40px] mt-[-10px]`}
      >
        <Image
          src={getExperienceRateIcon(save.feedback.experienceRate)}
          alt={getExperienceRateIcon(save.feedback.experienceRate)}
          width={15}
          height={15}
          className="ml-[2.5px] mb-[-18px] relative z-[9]"
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
      <p className="text-xl font-SpaceGrotesk">{save.feedback.companyName}</p>
      <div className="w-full border rounded-xl p-1 mb-1 flex text-sm my-auto items-center gap-[2px]">
        {/* <p className="text-sm">by</p> */}
        <Image
          src={
            save.feedback.feedbackType === "Publicly"
              ? save.feedback.author.avatar
              : AnonymousIcon
          }
          alt={
            save.feedback.feedbackType === "Publicly"
              ? save.feedback.author.avatar
              : AnonymousIcon
          }
          width={50}
          height={50}
          className="rounded-full min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] bg-neutral border border-neutral"
          onClick={() => {}}
        />
        <p className="truncate">
          {save.feedback.feedbackType === "Publicly"
            ? save.feedback.author.name
            : "Anonymous Author"}
        </p>
      </div>
      <div className="mt-auto flex w-full gap-1 select-none">
        <button
          onClick={() => router.push(`/home?feedbackId=${save.id}`)}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-full`}
        >
          view
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isSaved === true) {
              setIsPopUpUnSaveFeedbackOpen(true);
            } else {
              toast.dismiss();
              toast.success("feedback saved!", {
                style: { background: "#fff5e0", color: "#141e46" },
              });
              setIsSaved(true);
              createSave(save.feedback.id);
            }
          }}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-[30px] flex justify-center items-center`}
        >
          <Image
            src={isSaved === true ? saveFilledIcon : saveIcon}
            alt={isSaved === true ? saveFilledIcon : saveIcon}
            width={30}
            height={30}
            className="rounded-lg min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] p-2"
            onClick={() => {}}
          />
        </button>
        {isPopUpUnSaveFeedbackOpen === true && (
          <PopUpUnSaveFeedback
            setIsSaved={setIsSaved}
            feedbackId={save.feedback.id}
            setIsPopUpUnSaveFeedbackOpen={setIsPopUpUnSaveFeedbackOpen}
          ></PopUpUnSaveFeedback>
        )}
      </div>
    </div>
  );
};

const FeedbackAsVisitorCard = ({
  feedback,
}: {
  feedback: FeedbackInterface;
}) => {
  const userContext = useContext(UserContext);
  const userVote =
    feedback.saves === undefined
      ? undefined
      : feedback.saves.find(
          (save: saveInterface) => save.authorId === userContext.userInfo?.id,
        );

  const [isSaved, setIsSaved] = useState(userVote === undefined ? false : true);
  const [isPopUpUnSaveFeedbackOpen, setIsPopUpUnSaveFeedbackOpen] =
    useState(false);
  const router = useRouter();
  const createSave = async (feedbackId: string) => {
    try {
      const response = await fetch(
        `/api/feedback/save/create?userId=${userContext.userInfo?.id}&feedbackId=${feedbackId}`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <div
      onClick={() => router.push(`/home?feedbackId=${feedback.id}`)}
      className="bg-secondary cursor-pointer text-neutral min-w-[200px] max-w-[200px] flex rounded-lg flex-col items-center p-5 transition-transform duration-500 transform hover:scale-[1.05]"
      key={feedback.id}
    >
      <Image
        src={feedback.companyLogo}
        alt={feedback.companyLogo}
        width={70}
        height={70}
        className="rounded-full min-w-[70px] min-h-[70px] max-w-[70px] max-h-[70px] border-2 border-neutral"
      />
      <div
        className={`w-[${circleRadius * 2}] h-[${
          circleRadius * 2
        }]  ml-[40px] mt-[-10px]`}
      >
        <Image
          src={getExperienceRateIcon(feedback.experienceRate)}
          alt={getExperienceRateIcon(feedback.experienceRate)}
          width={15}
          height={15}
          className="ml-[2.5px] mb-[-18px] relative z-[9]"
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
      <p className="text-xl font-SpaceGrotesk">{feedback.companyName}</p>
      <p className="text-lg font-SpaceGrotesk">{feedback.jobStatus}</p>
      <div className="mt-auto flex w-full gap-1 select-none">
        <button
          onClick={() => router.push(`/home?feedbackId=${feedback.id}`)}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-full`}
        >
          view
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isSaved === true) {
              setIsPopUpUnSaveFeedbackOpen(true);
            } else {
              toast.dismiss();
              toast.success("feedback saved!", {
                style: { background: "#fff5e0", color: "#141e46" },
              });
              setIsSaved(true);
              createSave(feedback.id);
            }
          }}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-[30px] flex justify-center items-center`}
        >
          <Image
            src={isSaved === true ? saveFilledIcon : saveIcon}
            alt={isSaved === true ? saveFilledIcon : saveIcon}
            width={30}
            height={30}
            className="rounded-lg min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] p-2"
            onClick={() => {}}
          />
        </button>
        {isPopUpUnSaveFeedbackOpen === true && (
          <PopUpUnSaveFeedback
            setIsSaved={setIsSaved}
            feedbackId={feedback.id}
            setIsPopUpUnSaveFeedbackOpen={setIsPopUpUnSaveFeedbackOpen}
          ></PopUpUnSaveFeedback>
        )}
      </div>
    </div>
  );
};

const FeedbackProfileCard = ({ feedback }: { feedback: FeedbackInterface }) => {
  const [isCross, setIsCross] = useState(false);
  const [isPopUpDeleteFeedbackOpen, setIsPopUpDeleteFeedbackOpen] =
    useState(false);
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/home?feedbackId=${feedback.id}`)}
      className="bg-secondary cursor-pointer text-neutral min-w-[200px] flex rounded-lg flex-col items-center p-5 transition-transform duration-500 transform hover:scale-[1.05]"
      key={feedback.id}
    >
      <Image
        src={feedback.companyLogo}
        alt={feedback.companyLogo}
        width={70}
        height={70}
        className="rounded-full min-w-[70px] min-h-[70px] max-w-[70px] max-h-[70px] border-2 border-neutral"
      />
      <div
        className={`w-[${circleRadius * 2}] h-[${
          circleRadius * 2
        }]  ml-[40px] mt-[-10px]`}
      >
        <Image
          src={getExperienceRateIcon(feedback.experienceRate)}
          alt={getExperienceRateIcon(feedback.experienceRate)}
          width={15}
          height={15}
          className="ml-[2.5px] mb-[-18px] relative z-[9]"
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
      <p className="text-xl font-SpaceGrotesk">{feedback.companyName}</p>
      <p className="text-lg font-SpaceGrotesk">{feedback.jobStatus}</p>
      <div className="mt-auto flex w-full gap-1 select-none">
        <button
          onClick={() => router.push(`/home?feedbackId=${feedback.id}`)}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-full transition-transform duration-500 transform ${isCross === true ? "scale-[0] -translate-x-[60px]" : ""}`}
        >
          view
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-[30px] flex justify-center items-center transition-all duration-500 transform ${isCross ? "scale-[1]" : "scale-0"} absolute left-[30px]`}
        >
          <Image
            src={shareFeedbackIcon}
            alt={shareFeedbackIcon}
            width={30}
            height={30}
            className="rounded-lg min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] p-2"
            onClick={() => {
              navigator.clipboard.writeText(
                `http://localhost:3000/home?feedbackId=${feedback.id}`,
              );
              toast.dismiss();
              toast.success("feedback link copied!", {
                style: { background: "#fff5e0", color: "#141e46" },
              });
            }}
          />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-[30px] flex justify-center items-center transition-all duration-500 transform ${isCross ? "scale-[1]" : "scale-0"} absolute left-[70px]`}
        >
          <Image
            src={editFeedbackIcon}
            alt={editFeedbackIcon}
            width={30}
            height={30}
            className="rounded-lg min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] p-2"
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPopUpDeleteFeedbackOpen(true);
          }}
          className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-[30px] flex justify-center items-center transition-all duration-500 transform ${isCross ? "scale-[1]" : "scale-0"} absolute left-[110px]`}
        >
          <Image
            src={deleteFeedbackIcon}
            alt={deleteFeedbackIcon}
            width={30}
            height={30}
            className="rounded-lg min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] p-2"
          />
        </button>

        {isPopUpDeleteFeedbackOpen === true && (
          <PopUpDeleteFeedback
            feedbackId={feedback.id}
            setIsPopUpDeleteFeedbackOpen={setIsPopUpDeleteFeedbackOpen}
          ></PopUpDeleteFeedback>
        )}
        <button
          onClick={(e) => {
            setIsCross(!isCross);
            e.stopPropagation();
          }}
        >
          <Image
            src={isCross === true ? dotsCross : dots}
            alt={isCross === true ? dotsCross : dots}
            width={isCross === true ? 20 : 30}
            height={isCross === true ? 20 : 30}
            className="rounded-lg min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] p-2 bg-neutral"
          />
        </button>
      </div>
    </div>
  );
};

const MyCommentsAndVotesWrapper = ({
  comments,
  votes,
}: {
  comments: commentInterface[];
  votes: voteProfileInterface[];
}) => {
  const [selectedBtn, setSelectedBtn] = useState(1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        setIsOverflowing(
          containerRef.current.scrollHeight > containerRef.current.clientHeight,
        );
      }
    };

    // Initial check
    checkOverflow();

    // Optional: Recheck on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [selectedBtn]);

  return (
    <div className="flex flex-col gap-5 mb-5">
      <div className="bg-neutral w-max p-2 flex gap-2 rounded-2xl font-SpaceGrotesk font-semibold select-none">
        <button
          onClick={() => setSelectedBtn(1)}
          className={`rounded-lg w-[140px] ${selectedBtn === 1 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          my comments
        </button>
        <button
          onClick={() => setSelectedBtn(2)}
          className={`rounded-lg w-[140px] ${selectedBtn === 2 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          my votes
        </button>
      </div>
      <div className="h-[280px] w-full bg-neutral rounded-xl flex justify-center">
        {((selectedBtn === 1 && comments.length === 0) ||
          (selectedBtn === 2 && votes.length === 0)) && (
          <div className="min-w-max h-max my-auto text-secondary font-SpaceGrotesk font-semibold text-lg flex flex-col items-center gap-3">
            <p>No {selectedBtn === 1 ? "comments" : "votes"} available.</p>
            <button
              onClick={() => router.push(`/home`)}
              className="bg-secondary text-neutral p-2 rounded-lg hover:bg-primary flex items-center gap-1 transition-transform select-none duration-500 transform hover:scale-[1.05]"
            >
              <p>explore feedbacks</p>
              <Image
                src={exploreArrow}
                alt={exploreArrow}
                width={25}
                height={25}
                className=""
              />
            </button>
          </div>
        )}
        {((selectedBtn === 1 && comments.length > 0) ||
          (selectedBtn === 2 && votes.length > 0)) && (
          <div
            className={`${isOverflowing === true ? "w-[97.5%] pl-0 pr-[9px]" : "w-full"} mx-auto text-secondary flex flex-col gap-2 p-2 overflow-y-auto dark-scroll font-SpaceGrotesk`}
            ref={containerRef}
          >
            {selectedBtn === 1
              ? comments.map((comment) => {
                  return (
                    <CommentProfileCard
                      key={comment.id}
                      comment={comment}
                    ></CommentProfileCard>
                  );
                })
              : votes.map((vote) => {
                  return (
                    <VoteProfileCard
                      key={vote.id}
                      vote={vote}
                    ></VoteProfileCard>
                  );
                })}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentProfileCard = ({ comment }: { comment: commentInterface }) => {
  const router = useRouter();
  const size = comment.feedback.feedbackType === "Publicly" ? 30 : 30;
  return (
    <div
      onClick={() => router.push(`/home?feedbackId=${comment.feedback.id}`)}
      key={comment.id}
      className="w-[100%] cursor-pointer text-neutral bg-secondary flex gap-2 items-center font-SpaceGrotesk p-1 rounded-lg"
    >
      <Image
        src={comment.feedback.companyLogo}
        alt={comment.feedback.companyLogo}
        width={60}
        height={60}
        className="rounded-lg min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] p-2"
      />
      <div
        className={`w-[${circleRadius * 2}] h-[${
          circleRadius * 2
        }]  ml-[-30px] mt-[30px]`}
      >
        <Image
          src={getExperienceRateIcon(comment.feedback.experienceRate)}
          alt={getExperienceRateIcon(comment.feedback.experienceRate)}
          width={15}
          height={15}
          className="ml-[2.5px] mb-[-18px] relative z-[9]"
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
      {/* <p className="font-Inter font-semibold text-lg">
                      {comment.feedback.companyName}
                    </p> */}
      <div className="w-[1px] h-[55%] bg-neutral"></div>
      <p className="font-Inter italic truncate w-full">{comment.text}</p>
      <p className="font-Inter italic min-w-max text-[12px] mt-8 ml-auto mr-3">
        {formatDistanceToNow(new Date(comment.createdAt), {
          addSuffix: true,
        })}
      </p>
      <div className="w-[1px] h-[55%] bg-neutral"></div>
      <Image
        src={
          comment.feedback.feedbackType === "Publicly"
            ? comment.feedback.author.avatar
            : AnonymousIcon
        }
        alt={
          comment.feedback.feedbackType === "Publicly"
            ? comment.feedback.author.avatar
            : AnonymousIcon
        }
        width={size}
        height={size}
        className={`rounded-full mr-[6px] min-w-[${size}px] min-h-[${size}px] ${comment.feedback.feedbackType != "Publicly" ? "p-[2px]" : ""} max-w-[${size}px] max-h-[${size}px] bg-neutral border border-neutral`}
        onClick={(e) => {
          e.stopPropagation();
          comment.feedback.feedbackType === "Publicly" &&
            router.push(`/profile?userId=${comment.feedback.author.id}`);
        }}
      />
    </div>
  );
};

const VoteProfileCard = ({ vote }: { vote: voteProfileInterface }) => {
  const router = useRouter();
  const size = vote.feedback.feedbackType === "Publicly" ? 30 : 30;
  return (
    <div
      onClick={() => router.push(`/home?feedbackId=${vote.feedback.id}`)}
      key={vote.id}
      className="w-[100%] cursor-pointer text-neutral bg-secondary flex gap-2 items-center font-SpaceGrotesk p-1 rounded-lg"
    >
      <Image
        src={vote.isUp === true ? ArrowUpIcon : ArrowDownIcon}
        alt={vote.isUp === true ? ArrowUpIcon : ArrowDownIcon}
        width={35}
        height={35}
        className="rounded-full min-w-[35px] min-h-[35px] bg-neutral max-w-[35px] max-h-[35px] p-2 ml-[6px]"
      />
      <div className="w-[1px] h-[55%] bg-neutral"></div>
      <Image
        src={vote.feedback.companyLogo}
        alt={vote.feedback.companyLogo}
        width={60}
        height={60}
        className="rounded-lg min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px] ml-[-8px] p-2"
      />
      <div
        className={`w-[${circleRadius * 2}] h-[${
          circleRadius * 2
        }]  ml-[-30px] mt-[30px]`}
      >
        <Image
          src={getExperienceRateIcon(vote.feedback.experienceRate)}
          alt={getExperienceRateIcon(vote.feedback.experienceRate)}
          width={15}
          height={15}
          className="ml-[2.5px] mb-[-18px] relative z-[9]"
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
      <p className="font-semibold font-SpaceGrotesk text-lg">
        {vote.feedback.companyName}
      </p>
      •
      <p className="font-medium font-SpaceGrotesk text-md">
        {vote.feedback.jobStatus}
      </p>
      <p className="font-Inter italic min-w-max text-[12px] mt-8 ml-auto mr-3">
        time
        {/* {formatDistanceToNow(new Date("vote.createdAt"), {
          addSuffix: true,
        })} */}
      </p>
      <div className="w-[1px] h-[55%] bg-neutral"></div>
      <Image
        src={
          vote.feedback.feedbackType === "Publicly"
            ? vote.feedback.author.avatar
            : AnonymousIcon
        }
        alt={
          vote.feedback.feedbackType === "Publicly"
            ? vote.feedback.author.avatar
            : AnonymousIcon
        }
        width={size}
        height={size}
        className={`rounded-full mr-[6px] min-w-[${size}px] min-h-[${size}px] ${vote.feedback.feedbackType != "Publicly" ? "p-[2px]" : ""} max-w-[${size}px] max-h-[${size}px] bg-neutral border border-neutral`}
        onClick={(e) => {
          e.stopPropagation();
          vote.feedback.feedbackType === "Publicly" &&
            router.push(`/profile?userId=${vote.feedback.author.id}`);
        }}
      />
    </div>
  );
};
