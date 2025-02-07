"use client";

import lrLogoWhite from "@/public/lrLogoWhite.svg";
import fortyTwoLogo from "@/public/42-logo-black.svg";
import githubLogo from "@/public/brand-github-black.svg";
import asset6 from "@/public/asset6.svg";
import asset7 from "@/public/asset7.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const options = [
    {
      href: "/api/auth/login/forty-two",
      provider: "Intra",
      icon: fortyTwoLogo,
    },
    {
      href: "/api/auth/login/github",
      provider: "Github",
      icon: githubLogo,
    },
  ];

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
    <div className="w-full h-full bg-[url('/Noise&Texture.svg')] bg-cover bg-center bg-no-repeat flex items-center flex-col overflow-y-auto">
      <Link href={"/"}>
        <Image
          src={lrLogoWhite}
          alt={lrLogoWhite}
          width={150}
          height={150}
          className="max-w-[150px] select-none max-h-[150px] mt-20 mb-32"
        />
      </Link>
      <div className="flex relative mb-10">
        <Image
          src={asset7}
          alt={asset7}
          width={80}
          height={80}
          className="max-w-[80px] select-none max-h-[80px]  absolute ml-[-40px] bottom-[-20px]"
        />
        <div className="p-10 bg-neutral rounded-3xl text-secondary flex gap-10 flex-col w-[400px] select-none">
          <p className="font-SpaceGrotesk font-bold text-[35px] text-center">
            Welcome Back!
          </p>
          <div className="flex flex-col gap-3 items-center w-full">
            {options.map((option) => {
              return (
                <Link
                  key={option.provider}
                  href={option.href}
                  className="flex gap-3 shadow-[0_5px_20px_5px_rgba(0,0,0,0.25)] justify-center items-center w-full bg-secondary border-2 border-secondary hover:bg-neutral hover:text-secondary text-neutral rounded-xl p-2 font-SpaceGrotesk font-semibold"
                >
                  <p>Login with {option.provider}</p>
                  <div className="bg-neutral w-[40px] p-2 h-[40px] flex justify-center items-center rounded-full">
                    <Image
                      src={option.icon}
                      alt={option.icon}
                      width={32}
                      height={32}
                    />
                  </div>
                </Link>
              );
            })}
            <p className="font-SpaceGrotesk text-sm">
              Don&apos;t have an account?{" "}
              <Link href={"/auth/sign-up"} className="underline font-semibold">
                {" "}
                Register here
              </Link>
            </p>
          </div>
        </div>
        <Image
          src={asset6}
          alt={asset6}
          width={80}
          height={80}
          className="max-w-[80px] select-none max-h-[80px] absolute right-[-40px] mt-8"
        />
      </div>
    </div>
  );
}
