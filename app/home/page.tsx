"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const userContext = useContext(UserContext);
  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback/get");
        const responseData = await response.json();
        console.log("responseData", responseData);
        userContext.setFeedbacks(responseData.feedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    getFeedbacks();
  }, []);

  return (
    <div className={`w-full`}>
      {/* <h1>Welcome, {userInfo?.username}</h1>
      <Link href={"/api/auth/connect/discord"}>
        <button>connect with discord</button>
      </Link>
      <DisplayAccounts></DisplayAccounts> */}
      <div className="w-full flex flex-col items-center my-[100px]">
        {userContext.feedbacks.map((feedback) => {
          return (
            <FeedbackCard feedback={feedback} key={feedback.id}></FeedbackCard>
          );
        })}
      </div>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            color: "#FFF5E0",
            backgroundColor: "#141E46",
          },
        }}
      />
    </div>
  );
}
