"use client";
import Link from "next/link";

export interface providerInterface {
  id: string;
  name: string;
}

export default function SignIn() {
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
