"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import FeedbackForm from "./feedbackForm/FeedbackForm";
import logoIcon from "@/public/logoIcon.svg";

const Navbar = () => {
  const [isSearchInputOnFocus, setIsSearchInputOnFocus] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const DropDownRef = useRef<HTMLDivElement>(null);
  const inputDesktopRef = useRef<HTMLInputElement>(null);
  const inputMobileRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [buttonCreateFeedbackPosition, setButtonCreateFeedbackPosition] =
    useState({ top: 0, left: 0 });
  const buttonCreateFeedbackRef = useRef<HTMLButtonElement>(null);
  const [isClosingFeedbackForm, setIsClosingFeedbackForm] = useState(false);

  const pathname = usePathname();
  const hiddenRoutes = ["/auth/signin", "/auth/signup"];
  const isHidden = hiddenRoutes.includes(pathname);
  //   if (isHidden) {
  // console.log("path name is an auth path so hide navbar");
  // return null;
  //   }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideSearchBar);
    document.addEventListener("mousedown", handleClickOutsideDropDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearchBar);
      document.removeEventListener("mousedown", handleClickOutsideDropDown);
    };
  }, []);
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) {
    console.log("user Context undefined");
    return <div>user Context undefined</div>;
  }
  const { userInfo } = userContext;
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/auth/signin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOpenFeedbackForm = () => {
    if (buttonCreateFeedbackRef.current) {
      const rect = buttonCreateFeedbackRef.current.getBoundingClientRect();

      setButtonCreateFeedbackPosition({
        top: rect.top,
        left: rect.left - 100,
      });
    }
    setIsFeedbackFormOpen(true);
  };

  const dropDownButtons = [
    {
      id: 1,
      text: "Profile",
      icon: "user-circle.svg",
      path: "/PageUnderConstruction",
    },
    {
      id: 2,
      text: "Settings",
      icon: "settings.svg",
      path: "/PageUnderConstruction",
    },
    {
      id: 3,
      text: "Logout",
      icon: "logout.svg",
      path: "/auth/signin",
      onClick: handleLogout, // Call logout function
    },
  ];

  const handleFocusInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      console.log("ref valid so activate focus");
      console.log(inputRef.current);
      inputRef.current.focus();
    } else console.log("inputRef.current invalid");
  };

  const handleClickOutsideSearchBar = (event: MouseEvent) => {
    if (
      searchBarRef &&
      searchButtonRef.current &&
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node) &&
      !searchButtonRef.current.contains(event.target as Node)
    ) {
      setIsSearchBarOpen(false);
    }
  };

  const handleClickOutsideDropDown = (event: MouseEvent) => {
    if (
      DropDownRef &&
      DropDownRef.current &&
      !DropDownRef.current.contains(event.target as Node)
    ) {
      setIsDropDownOpen(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);

    // Trigger a custom event when the search term changes
    // window.dispatchEvent(
    //   new CustomEvent("searchTermChange", { detail: event.target.value })
    // );
  };

  const avatar = userInfo?.avatar || "/default.jpeg";
  const inputMaxLength = 30;
  return (
    <div
      className={`${isHidden === true ? "hidden" : ""} bg-neutral fixed flex flex-wrap justify-center w-full z-[150]`}
    >
      <div className="w-full max-w-[850px] max-md:mx-2 flex items-center gap-3 max-md:gap-1 min-w-max my-3">
        <Link href={"/home"} className="mr-11 max-md:mr-auto">
          <Image
            className="min-w-[9px] w-[50px] h-[50px] select-none"
            src={logoIcon}
            height={50}
            width={50}
            alt={logoIcon}
          ></Image>
        </Link>
        {/* <p className="mr-11 max-md:mr-auto border border-secondary w-[50px] h-[50px] text-center rounded-xl">
          LOGO
        </p> */}
        <div
          className={`max-md:hidden flex rounded-xl bg-transparent flex-1 h-[50px] py-1 pl-1 border-2 ${
            isSearchInputOnFocus === true
              ? "border-primary"
              : "border-secondary"
          } hover:border-2 hover:border-primary`}
          ref={searchBarRef}
        >
          <button
            onClick={() => {
              handleFocusInput(inputDesktopRef);
            }}
          >
            <Image
              src={`${
                isSearchInputOnFocus === true
                  ? "/searchGreen.svg"
                  : "/searchBlue.svg"
              }`}
              alt={`${
                isSearchInputOnFocus === true
                  ? "/searchGreen.svg"
                  : "/searchBlue.svg"
              }`}
              width={30}
              height={30}
              className=" select-none"
            ></Image>
          </button>
          <input
            maxLength={inputMaxLength}
            onFocus={() => setIsSearchInputOnFocus(true)}
            onBlur={() => setIsSearchInputOnFocus(false)}
            ref={inputDesktopRef}
            placeholder="Search"
            onChange={handleSearchChange}
            value={searchInputValue}
            className="outline-none w-full bg-transparent text-secondary font-medium ml-2"
          />
          <button
            onClick={() => {
              setSearchInputValue("");
              handleFocusInput(inputDesktopRef);
            }}
          >
            <Image
              src={"/circleCross.svg"}
              alt="circleCross.svg"
              width={35}
              height={35}
              className="rounded-full mr-1 select-none"
            ></Image>
          </button>
        </div>
        <button
          className={`md:hidden flex justify-center items-center border-2 ${isSearchBarOpen === true ? "border-primary" : "border-secondary"} w-[50px] h-[50px] rounded-xl`}
          ref={searchButtonRef}
          onClick={() => {
            setIsSearchBarOpen(!isSearchBarOpen);
            handleFocusInput(inputMobileRef);
          }}
        >
          <Image
            src={`${
              isSearchBarOpen === true ? "/searchGreen.svg" : "/searchBlue.svg"
            }`}
            alt={`${
              isSearchBarOpen === true ? "/searchGreen.svg" : "/searchBlue.svg"
            }`}
            width={30}
            height={30}
            className=" select-none"
          ></Image>
        </button>
        <button
          className="font-SpaceGrotesk select-none max-md:text-sm h-[50px] bg-primary px-4 max-md:px-2 rounded-xl font-semibold text-neutral"
          ref={buttonCreateFeedbackRef}
          onClick={handleOpenFeedbackForm}
        >
          Create feedback
        </button>
        <div className="flex justify-end  select-none" ref={DropDownRef}>
          <button
            className={`border-[3px] ${isDropDownOpen === true ? "border-primary" : "border-secondary"} w-[53px] h-[53px] rounded-full flex justify-center items-center`}
            onClick={() => {
              console.log("setIsDropDownOpen", isDropDownOpen);
              setIsDropDownOpen(!isDropDownOpen);
            }}
          >
            <Image
              src={avatar as string}
              alt="profile"
              width={60}
              height={60}
              className="rounded-full max-h-[47px] max-w-[47px]"
            ></Image>
          </button>
          {isDropDownOpen && (
            <div className="border border-neutral bg-secondary w-max h-max p-1 rounded-xl absolute mt-[60px] z-[110]">
              <div className="flex flex-col justify-start bg-secondary w-[120px] min-w-max rounded-xl gap-1 py-2 px-2">
                {dropDownButtons.map((item) => {
                  return (
                    <Link
                      href={item.path}
                      className="w-full flex items-center justify-center"
                      key={item.id}
                    >
                      <button
                        key={item.id}
                        className="flex gap-1 items-center text-white hover:bg-primary rounded-lg w-full h-full py-1 px-1 pr-3"
                        onClick={item.onClick}
                      >
                        <Image
                          src={item.icon}
                          alt={item.icon}
                          width={30}
                          height={30}
                          className="rounded-full"
                        ></Image>
                        {item.text}
                      </button>
                    </Link>
                  );
                })}
              </div>
              <div className="bg-secondary w-full h-[37px] flex items-center justify-between mt-1 rounded-md">
                <button className="w-[30%] h-[80%] flex items-center justify-center p-1 hover:bg-primary mx-auto rounded-md">
                  <Image
                    src={"/discord.svg"}
                    alt={"/discord.svg"}
                    width={20}
                    height={20}
                    className=""
                  ></Image>
                </button>
                <div className="w-[1px] h-[25px] bg-[white]"></div>
                <a
                  className="w-[30%] h-[80%] flex items-center justify-center p-1 hover:bg-primary mx-auto rounded-md"
                  href="https://github.com/yel-aziz/Reviews-Leet"
                  target="_blank"
                >
                  <Image
                    src={"/brand-github.svg"}
                    alt={"/brand-github.svg"}
                    width={20}
                    height={20}
                    className=""
                  ></Image>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        ref={searchBarRef}
        className={`md:hidden ${isSearchBarOpen === false && "hidden"} mt-2 flex rounded-xl bg-transparent mx-2 pl-2 flex-1 w-full h-[50px] border-2 border-primary hover:border-2 hover:border-primary`}
      >
        <input
          maxLength={inputMaxLength}
          placeholder="Search"
          onChange={handleSearchChange}
          value={searchInputValue}
          className="outline-none w-full bg-transparent text-secondary font-medium ml-2"
          ref={inputMobileRef}
        />
        <button
          onClick={() => {
            setSearchInputValue("");
            handleFocusInput(inputMobileRef);
          }}
        >
          <Image
            src={"/circleCross.svg"}
            alt="circleCross.svg"
            width={35}
            height={35}
            className="rounded-full mr-1"
          ></Image>
        </button>
      </div>
      {isFeedbackFormOpen && (
        <div className="absolute w-full h-screen flex bg-white/30 backdrop-blur-sm justify-center py-5">
          <div
            className={`absolute ${isClosingFeedbackForm === true ? "close-feedback-form" : ""} open-feedback-form w-[100%] max-w-[700px] h-full my-auto flex flex-col items-center pt-5 pb-10 overflow-auto`}
            style={{
              transformOrigin: `${buttonCreateFeedbackPosition.left / 2}px ${buttonCreateFeedbackPosition.top}px`,
            }}
          >
            <FeedbackForm
              buttonCreateFeedbackPosition={buttonCreateFeedbackPosition}
              setIsFeedbackFormOpen={setIsFeedbackFormOpen}
              setIsClosingFeedbackForm={setIsClosingFeedbackForm}
            ></FeedbackForm>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
