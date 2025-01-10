"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { FeedbackCard } from "@/components/FeedbackCard";

export default function Home() {
  //   const { user } = await validateRequest();
  //   if (!user) return redirect("/auth/signin");
  const userContext = useContext(UserContext);
  if (!userContext) {
    console.log("user Context undefined");
    return <div>user Context undefined</div>;
  }
  return (
    <div className="w-full px-3">
      {/* <h1>Welcome, {userInfo?.username}</h1>
      <Link href={"/api/auth/connect/discord"}>
        <button>connect with discord</button>
      </Link>
      <DisplayAccounts></DisplayAccounts> */}
      <div className="w-full flex flex-col items-center my-[100px]">
        <FeedbackCard></FeedbackCard>
      </div>
    </div>
  );
}
