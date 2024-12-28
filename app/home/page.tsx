"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import Link from "next/link";
import { DisplayAccounts } from "@/components/accounts";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function Home() {
  //   const { user } = await validateRequest();
  //   if (!user) return redirect("/auth/signin");
  const userContext = useContext(UserContext);
  if (!userContext) {
    console.log("user Context undefined");
    return <div>user Context undefined</div>;
  }
  const { userInfo } = userContext;
  return (
    <div>
      <h1>Welcome, {userInfo?.username}</h1>
      <Link href={"/api/auth/connect/discord"}>
        <button>connect with discord</button>
      </Link>
      <DisplayAccounts></DisplayAccounts>
    </div>
  );
}
