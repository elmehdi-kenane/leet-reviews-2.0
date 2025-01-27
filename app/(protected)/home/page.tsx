"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { FeedbackCard } from "@/components/FeedbackCard";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Home() {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback/get");
        const responseData = await response.json();
        // console.log("responseData", responseData);
        userContext.setFeedbacks(responseData.feedbacks.reverse());
        console.log("responseData.feedbacks", responseData.feedbacks.reverse());

        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    getFeedbacks();
  }, []);

  return (
    <div className={`w-full h-max`}>
      {/* <h1>Welcome, {userInfo?.username}</h1>
      <Link href={"/api/auth/connect/discord"}>
        <button>connect with discord</button>
      </Link>
      <DisplayAccounts></DisplayAccounts> */}
      {loading ? (
        <div className="w-full flex flex-col items-center pl-[6px] h-max">
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
          <FeedbackCardSkeleton></FeedbackCardSkeleton>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center pl-[6px] h-max">
          {userContext.feedbacks.map((feedback) => {
            return (
              <FeedbackCard
                feedback={feedback}
                key={feedback.id}
              ></FeedbackCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

const FeedbackCardSkeleton = () => {
  return (
    <div className="text-neutral w-full text-center rounded-[16px] p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] h-full flex items-center justify-between bg-neutral max-w-[850px] gap-[10px] mb-[50px]">
      <SkeletonTheme
        baseColor="#D9D9D9"
        //   baseColor="red"
        highlightColor="#fff5e0"
      >
        <div className="flex flex-col w-full justify-center items-center gap-3">
          <div className="flex w-full justify-center items-center gap-3">
            <div className="w-[125px] h-[125px] rounded-full flex justify-center items-center">
              <Skeleton
                className=""
                containerClassName="flex-1"
                circle={true}
                height={125}
                width={125}
              ></Skeleton>
            </div>
            <div className="flex flex-col max-sm:items-center items-start justify-center ">
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
            <div className="flex items-center flex-wrap max-md:justify-end max-sm:justify-center  gap-[7px] w-[310px] max-sm:gap-[5px] h-max font-medium ml-auto">
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={150}
              ></Skeleton>
            </div>
          </div>
          <Skeleton
            className="min-w-full"
            containerClassName="flex-1"
            height={60}
            width={770}
          ></Skeleton>
          <div className="ml-auto">
            <Skeleton
              className=""
              containerClassName="flex-1"
              height={44}
              width={150}
            ></Skeleton>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};
