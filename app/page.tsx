"use client";

// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import Link from "next/link";
import { DisplayAccounts } from "@/components/accounts";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

export default function Home() {
  //   const { user } = await validateRequest();
  //   if (!user) return redirect("/auth/signin");
  useEffect(() => {
    const getLocation = async () => {
      console.log(
        "process.env.NEXT_PUBLIC_OPENCAGEDATA_KEY",
        process.env.NEXT_PUBLIC_OPENCAGEDATA_KEY,
      );
      console.log(
        "process.env.DISCORD_CLIENT_ID",
        process.env.DISCORD_CLIENT_ID,
      );
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=rabat&key=${process.env.NEXT_PUBLIC_OPENCAGEDATA_KEY}`,
      );
      const data = await response.json();
      console.log("getLocation", data.results);
    };
    getLocation();
  }, []);
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
