"use client";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export interface providerInterface {
  id: string;
  name: string;
}

export default function SignIn() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const error = searchParams.get("error");
    console.log("error", error);
    if (error === "auth-cancelled") {
      setTimeout(() => {
        toast.error("Authentication was cancelled or invalid.", {
          id: "Authentication was cancelled or invalid.",
          style: { background: "#fff5e0", color: "#141e46" },
        });
      }, 300);
    } else console.log("unknown error");
  }, [searchParams]);

  return (
    <>
      <div>
        <Link href={"/api/auth/login/github"}>
          <button>Sign in with github</button>
        </Link>
      </div>
      <div>
        <Link href={"/api/auth/login/forty-two"}>
          <button>Sign in with 42</button>
        </Link>
      </div>
    </>
  );
}
