"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "@/context/UserContext";
import { FeedbackCard } from "@/components/FeedbackCard";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSearchParams } from "next/navigation";
import { FeedbackInterface } from "@/lib/types";
import toast from "react-hot-toast";

export default function Home() {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const feedbackId = searchParams.get("feedbackId");
  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback/get");
        const responseData = await response.json();
        userContext.setFeedbacks(responseData.feedbacks.reverse());
        if (feedbackId) {
          const expandedFeedback = responseData.feedbacks.filter(
            (feedback: FeedbackInterface) => feedback.id === feedbackId,
          );
          if (expandedFeedback.length === 0)
            toast.error("Feedback not found.", {
              id: "Feedback Not Found.",
              style: { background: "#fff5e0", color: "#141e46" },
            });
        }
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
  const feedbackCardSkeletonRef = useRef<HTMLDivElement>(null);
  const [feedbackCardSkeletonWidth, setFeedbackCardSkeletonWidth] = useState(
    feedbackCardSkeletonRef.current &&
      feedbackCardSkeletonRef.current.getBoundingClientRect().width -
        (window.innerWidth < 768 ? 30 : 80),
  );

  const [isMd, setIsMd] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth > 768 ? false : true);
      feedbackCardSkeletonRef.current &&
        setFeedbackCardSkeletonWidth(
          feedbackCardSkeletonRef.current.getBoundingClientRect().width -
            (window.innerWidth < 768 ? 30 : 80),
        );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      ref={feedbackCardSkeletonRef}
      className="text-neutral w-full text-center rounded-[16px] p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] h-full flex flex-wrap items-center justify-between bg-neutral max-w-[850px] gap-[10px] mb-[50px]"
    >
      <SkeletonTheme
        baseColor="#D9D9D9"
        //   baseColor="red"
        highlightColor="#fff5e0"
      >
        <div className="flex flex-col w-full justify-center items-center gap-3">
          <div className="flex w-full max-md:flex-col justify-center items-center gap-3">
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
            <div className="flex items-center flex-wrap max-md:justify-center  gap-[7px] md:w-[310px] max-sm:gap-[5px] h-max font-medium md:ml-auto">
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={isMd === true ? 100 : 150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={isMd === true ? 100 : 150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={isMd === true ? 100 : 150}
              ></Skeleton>
              <Skeleton
                className=""
                containerClassName="flex-1"
                height={45}
                width={isMd === true ? 100 : 150}
              ></Skeleton>
            </div>
          </div>
          <Skeleton
            className="min-w-full"
            containerClassName="flex-1"
            height={60}
            width={feedbackCardSkeletonWidth || 0}
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
