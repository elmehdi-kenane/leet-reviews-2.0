"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { FeedbackInterface } from "@/lib/types";
import dots from "@/public/three-dots.svg";
import deleteFeedbackIcon from "@/public/delete.svg";
import editFeedbackIcon from "@/public/edit-feedback.svg";
import shareFeedbackIcon from "@/public/share.svg";
import dotsCross from "@/public/cross.svg";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export interface voteInterface {
  id: string;
  feedbackId: string;
  authorId: string;
  isUp: boolean;
}

export interface feedbackProfileInterface {
  id: string;
  companyLogo: string;
  companyName: string;
  experienceRate: number;
}

export interface commentInterface {
  id: string;
  feedbackId: string;
  feedback: feedbackProfileInterface;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface voteInterface {
  id: string;
  feedbackId: string;
  feedback: feedbackProfileInterface;
  authorId: string;
  isUp: boolean;
}

interface profileInterface {
  feedbacks: FeedbackInterface[];
  comments: commentInterface[];
  votes: voteInterface[];
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
  }, []);

  return (
    <div className="text-neutral w-full h-full flex flex-col max-w-[850px] mx-auto gap-16">
      {profile ? (
        <>
          <ProfileHeader></ProfileHeader>
          {profile.isOwn === true ? (
            <>
              <MyFeedbacksAndFavoritesWrapper
                feedbacks={profile.feedbacks}
              ></MyFeedbacksAndFavoritesWrapper>
              <MyCommentsAndVotesWrapper
                comments={profile.comments}
                votes={profile.votes}
              ></MyCommentsAndVotesWrapper>
            </>
          ) : (
            <div>visitor</div>
          )}
        </>
      ) : (
        <h1>LOADING...</h1>
      )}
    </div>
  );
}

const ProfileHeader = () => {
  const userContext = useContext(UserContext);
  return (
    <div className="gap-3 border-2 border-neutral p-8 rounded-3xl w-full">
      <div className="flex items-center gap-3">
        <Image
          src={userContext.userInfo?.avatar || "/default.jpeg"}
          alt={userContext.userInfo?.avatar || "/default.jpeg"}
          width={125}
          height={125}
          className="rounded-full min-w-[125px] min-h-[125px] max-w-[125px] max-h-[125px] border-2 border-neutral"
        />
        <div className="flex flex-col">
          <p className="font-SpaceGrotesk text-[25px]">El mehdi Kenane</p>
          <p className="font-SpaceGrotesk text-[15px]">1337 student</p>
        </div>
        <div className="flex flex-col gap-2 mb-auto ml-auto">
          <div className="flex justify-center items-center border p-2 border-neutral rounded-full min-w-[45px] min-h-[45px]">
            <Image
              src="/42-logo.svg"
              className="select-none"
              alt="42-logo.svg"
              width={20}
              height={20}
            />
          </div>
          <div className="flex justify-center items-center border p-2 border-neutral rounded-full min-w-[45px] min-h-[45px]">
            <Image
              src="/42-logo.svg"
              className="select-none"
              alt="42-logo.svg"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-SpaceGrotesk text-[12px] mt-auto">
          Joined at 15/08/2024
        </p>
        <button className="font-SpaceGrotesk text-[12px] bg-primary p-2 rounded-lg">
          share profile
        </button>
      </div>
    </div>
  );
};

const MyFeedbacksAndFavoritesWrapper = ({
  feedbacks,
}: {
  feedbacks: FeedbackInterface[];
}) => {
  const [selectedBtn, setSelectedBtn] = useState(1);
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
          my favorites
        </button>
      </div>
      <div className="h-[280px] w-full bg-neutral rounded-xl">
        <div className="w-[99%] mx-auto h-[270px] rounded-2xl text-secondary flex gap-5 py-5 px-[14px] overflow-x-auto dark-scroll font-SpaceGrotesk">
          {selectedBtn === 1 ? (
            feedbacks.map((feedback) => {
              return (
                <FeedbackProfileCard
                  feedback={feedback}
                  key={feedback.id}
                ></FeedbackProfileCard>
              );
            })
          ) : (
            <div>favorites</div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackProfileCard = ({ feedback }: { feedback: FeedbackInterface }) => {
  const [isCross, setIsCross] = useState(false);
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
          onClick={(e) => e.stopPropagation()}
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
  //   votes,
}: {
  comments: commentInterface[];
  votes: voteInterface[];
}) => {
  const [selectedBtn, setSelectedBtn] = useState(1);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-5">
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
      <div className="h-[280px] w-full bg-neutral rounded-xl">
        <div className="w-[97.5%] mx-auto h-full text-secondary flex flex-col gap-2 p-2 pl-0 pr-[9px] overflow-x-auto dark-scroll font-SpaceGrotesk">
          {
            selectedBtn === 1 ? (
              comments.map((comment) => {
                return (
                  <div
                    onClick={() =>
                      router.push(`/home?feedbackId=${comment.feedback.id}`)
                    }
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
                        src={getExperienceRateIcon(
                          comment.feedback.experienceRate,
                        )}
                        alt={getExperienceRateIcon(
                          comment.feedback.experienceRate,
                        )}
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
                    <p className="font-Inter italic truncate w-full">
                      {comment.text}
                    </p>
                    <p className="font-Inter italic min-w-max text-[12px] mt-8 ml-auto mr-3">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="w-[1px] h-[55%] bg-neutral"></div>
                    <Image
                      src={comment.feedback.companyLogo}
                      alt={comment.feedback.companyLogo}
                      width={45}
                      height={45}
                      className="rounded-lg min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] p-2"
                    />
                  </div>
                );
              })
            ) : (
              <div>votes</div>
            )
            // votes.map((vote) => {
            //     return (
            //       <div
            //         key={vote.id}
            //         className="w-[99%] mx-auto h-[270px] text-secondary flex gap-5 py-5 px-[14px] overflow-x-auto dark-scroll font-SpaceGrotesk"
            //       >
            //         {vote.feedback.id} {`${vote.isUp}`}
            //       </div>
            //     );
            //   })
          }
        </div>
      </div>
    </div>
  );
};
