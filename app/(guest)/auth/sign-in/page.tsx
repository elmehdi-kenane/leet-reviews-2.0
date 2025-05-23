"use client";

import Cookies from "js-cookie";
import lrLogoWhite from "@/public/lrLogoWhite.svg";
import fortyTwoLogo from "@/public/42-logo.svg";
import githubLogo from "@/public/brand-github.svg";
import fortyTwoLogoBlack from "@/public/42-logo-black.svg";
import githubLogoBlack from "@/public/brand-github-black.svg";
import googleLogo from "@/public/brand-google.svg";
import googleLogoBlack from "@/public/brand-google-black.svg";
import asset6 from "@/public/asset6.svg";
import asset7 from "@/public/asset7.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const options = [
    {
      href: "/api/auth/sign-in/forty-two",
      provider: "Intra",
      icon: fortyTwoLogo,
      iconHovered: fortyTwoLogoBlack,
    },
    {
      href: "/api/auth/sign-in/github",
      provider: "Github",
      icon: githubLogo,
      iconHovered: githubLogoBlack,
    },
    {
      href: "/api/auth/sign-in/google",
      provider: "Google",
      icon: googleLogo,
      iconHovered: googleLogoBlack,
    },
  ];

  const searchParams = useSearchParams();
  useEffect(() => {
    const authStatusCookie = Cookies.get("auth_status");
    const error = authStatusCookie ? authStatusCookie.valueOf() : null;
    if (error === "failure") {
      setTimeout(() => {
        toast.error("Authentication was cancelled or invalid.", {
          id: "Authentication was cancelled or invalid.",
          style: { background: "#FFFFFF", color: "#141e46" },
        });
      }, 300);
    } else if (error === "email_already_used") {
      setTimeout(() => {
        toast.error("This email is already in use.", {
          id: "This email is already in use.",
          style: { background: "#FFFFFF", color: "#141e46" },
        });
      }, 300);
    } else if (error === "account_no_exist") {
      setTimeout(() => {
        toast.error("No account found. Please sign up first.", {
          id: "No account found. Please sign up first.",
          style: { background: "#FFFFFF", color: "#141e46" },
        });
      }, 300);
    }
    Cookies.remove("auth_status");
  }, [searchParams]);

  return (
    <div className="w-full h-full bg-[url('/Noise&Texture.svg')] bg-cover bg-center bg-no-repeat flex items-center flex-col overflow-y-auto">
      <Link
        href={"/"}
        className=" flex-1 flex items-center justify-center max-h-[250px] min-h-[70px]"
      >
        <Image
          src={lrLogoWhite}
          alt={lrLogoWhite}
          width={150}
          height={150}
          className="max-w-[150px] select-none max-h-[150px]"
        />
      </Link>
      <div className="flex relative mb-10 max-sm:w-full">
        <Image
          src={asset7}
          alt={asset7}
          width={80}
          height={80}
          className="max-w-[80px] select-none max-h-[80px]  absolute ml-[-40px] max-sm:ml-[0px] bottom-[-20px]"
        />
        <div className="p-10 bg-neutral rounded-3xl text-secondary flex max-sm:gap-5 gap-10 flex-col max-sm:w-[90%] w-[400px] mx-auto select-none">
          <p className="font-SpaceGrotesk font-bold text-[35px] max-sm:text-[25px] text-center">
            Welcome Back!
          </p>
          <div className="flex flex-col gap-3 items-center w-full">
            {options.map((option, index) => {
              return (
                <Link
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  key={option.provider}
                  href={option.href}
                  className="flex gap-3 max-sm:text-[12px] shadow-[0_5px_20px_5px_rgba(0,0,0,0.25)] justify-center items-center w-full bg-secondary border-2 border-secondary hover:bg-neutral hover:text-secondary text-neutral rounded-xl p-2 font-SpaceGrotesk font-semibold transition-colors duration-300"
                  prefetch={false}
                >
                  <p>Login with {option.provider}</p>
                  <div className="w-[40px] p-2 h-[40px] flex justify-center items-center rounded-full">
                    <Image
                      src={
                        hoveredIndex === index
                          ? option.iconHovered
                          : option.icon
                      }
                      alt={
                        hoveredIndex === index
                          ? option.iconHovered
                          : option.icon
                      }
                      width={32}
                      height={32}
                    />
                  </div>
                </Link>
              );
            })}
            <p className="font-SpaceGrotesk text-sm max-sm:text-[10px]">
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
          className="max-w-[80px] select-none max-h-[80px] absolute right-[-40px] max-sm:right-[0px] mt-8"
        />
      </div>
      <Link
        href={"/"}
        className="border-2 border-neutral max-sm:w-[90%] rounded-xl py-3 text-neutral flex gap-10 font-SpaceGrotesk justify-center items-center flex-col w-[400px] select-none mb-10"
      >
        Back Home
      </Link>
    </div>
  );
}
