"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { FeedbackInterface } from "@/lib/types";
import dots from "@/public/three-dots.svg";
import dotsCross from "@/public/cross.svg";

export default function Profile() {
  const userContext = useContext(UserContext);

  interface profileInterface {
    feedbacks: FeedbackInterface[];
    isOwn: boolean;
  }

  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<profileInterface | undefined>(
    undefined
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
    };
    fetchProfile();
  }, []);

  return (
    <div className="text-neutral w-full h-full flex flex-col max-w-[850px] mx-auto gap-16">
      {profile ? (
        <>
          <ProfileHeader></ProfileHeader>
          {profile.isOwn === true ? (
            <MyFeedbacksWrapper
              feedbacks={profile.feedbacks}
            ></MyFeedbacksWrapper>
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
          Share profile
        </button>
      </div>
    </div>
  );
};

const MyFeedbacksWrapper = ({
  feedbacks,
}: {
  feedbacks: FeedbackInterface[];
}) => {
  const [selectedBtn, setSelectedBtn] = useState(1);
  const [isCross, setIsCross] = useState(false);
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-neutral w-max p-2 flex gap-2 rounded-2xl font-SpaceGrotesk font-semibold">
        <button
          onClick={() => setSelectedBtn(1)}
          className={`rounded-lg w-[140px] ${selectedBtn === 1 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          My Feedbacks
        </button>
        <button
          onClick={() => setSelectedBtn(2)}
          className={`rounded-lg w-[140px] ${selectedBtn === 2 ? "text-neutral bg-secondary" : "text-secondary border-2 border-secondary"} p-2`}
        >
          My Favorites
        </button>
      </div>
      <div className="h-[280px] w-full bg-neutral rounded-xl">
        <div className="w-[99%] mx-auto h-[270px] rounded-2xl text-secondary flex gap-5 p-5 overflow-x-auto dark-scroll font-SpaceGrotesk">
          {selectedBtn === 1 ? (
            feedbacks.map((feedback) => {
              return (
                <div
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
                  <p className="text-xl font-SpaceGrotesk">
                    {feedback.companyName}
                  </p>
                  <p className="text-lg font-SpaceGrotesk">
                    {feedback.jobStatus}
                  </p>
                  <div className="mt-auto flex w-full gap-1">
                    <button
                      className={`bg-neutral text-secondary px-2 rounded-lg h-[30px] w-full transition-transform duration-500 transform ${isCross === true ? "scale-[0] -translate-x-[60px]" : ""}`}
                    >
                      view
                    </button>
                    <button
                      onClick={() => setIsCross(!isCross)}
                    >
                      <Image
                        src={isCross === true ? dotsCross : dots}
                        alt={isCross === true ? dotsCross : dots}
                        width={30}
                        height={30}
                        className="rounded-lg min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] p-2 bg-neutral"
                      />
                    </button>
                  </div>
                </div>
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
