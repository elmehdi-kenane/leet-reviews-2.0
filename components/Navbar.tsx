"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useContext, useCallback } from "react";
import { debounce } from "lodash";
import { UserContext } from "@/context/UserContext";
import FeedbackForm from "./feedbackForm/FeedbackForm";
import logoIcon from "@/public/logoIcon.svg";

const Navbar = () => {
  const [isSearchInputOnFocus, setIsSearchInputOnFocus] = useState(false);
  const [isSearchBarMobileOpen, setIsSearchBarMobileOpen] = useState(false);
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const DropDownRef = useRef<HTMLDivElement>(null);
  const inputDesktopRef = useRef<HTMLInputElement>(null);
  const inputMobileRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [buttonCreateFeedbackPosition, setButtonCreateFeedbackPosition] =
    useState({ top: 0, left: 0 });
  const buttonCreateFeedbackRef = useRef<HTMLButtonElement>(null);
  const [isClosingFeedbackForm, setIsClosingFeedbackForm] = useState(false);
  type searchResultType = {
    id: string;
    avatar: string;
    name: string;
    username: string;
  };
  const [searchResults, setSearchResults] = useState<
    searchResultType[] | [] | null
  >([]);

  const pathname = usePathname();
  const hiddenRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const isHidden = hiddenRoutes.includes(pathname);
  //   if (isHidden) {
  // return null;
  //   }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideSearchBarMobile);
    document.addEventListener("mousedown", handleClickOutsideSearchBar);
    document.addEventListener("mousedown", handleClickOutsideDropDown);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideSearchBarMobile,
      );
      document.removeEventListener("mousedown", handleClickOutsideSearchBar);
      document.removeEventListener("mousedown", handleClickOutsideDropDown);
    };
  }, []);

  const fetchSearchResult = async (searchTerm: string) => {
    if (searchTerm === "") return;
    const response = await fetch(`/api/search?searchTerm=${searchTerm}`);
    const responseData = await response.json();
    setSearchResults(responseData.results);
  };
  const delay = 300;
  const debouncedSearch = useCallback(debounce(fetchSearchResult, delay), []);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResults(null);
    debouncedSearch(event.target.value);
    setSearchInputValue(event.target.value);
  };

  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>user Context undefined</div>;
  }
  const { userInfo } = userContext;
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/auth/sign-in");
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
      path: `/profile`,
    },
    {
      id: 2,
      text: "Settings",
      icon: "settings.svg",
      path: "/settings",
    },
    {
      id: 3,
      text: "Logout",
      icon: "logout.svg",
      path: "/auth/sign-in",
      onClick: handleLogout, // Call logout function
    },
  ];

  const handleFocusInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClickOutsideSearchBarMobile = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsSearchBarMobileOpen(false);
    }
  };

  const handleClickOutsideSearchBar = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node) &&
      searchResultsRef.current &&
      !searchResultsRef.current.contains(event.target as Node)
    ) {
      setIsSearchInputOnFocus(false);
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

  const avatar = userInfo?.avatar || "/default.jpeg";
  const inputMaxLength = 30;
  return (
    <div
      className={`${isHidden === true ? "hidden" : ""} bg-secondary fixed flex flex-wrap justify-center w-full z-[10]`}
    >
      {(isSearchInputOnFocus === true || isSearchBarMobileOpen === true) && (
        <div className="w-full h-screen absolute bg-secondary/30 backdrop-blur-sm"></div>
      )}
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
        {/* search-desktop-screen */}
        <div
          className={`max-md:hidden relative flex rounded-xl bg-transparent flex-1 h-[50px] py-1 pl-1 border-2 ${
            isSearchInputOnFocus === true ? "border-primary" : "border-neutral"
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
                  : "/searchWhite.svg"
              }`}
              alt={`${
                isSearchInputOnFocus === true
                  ? "/searchGreen.svg"
                  : "/searchWhite.svg"
              }`}
              width={30}
              height={30}
              className=" select-none"
            ></Image>
          </button>
          <input
            maxLength={inputMaxLength}
            onFocus={() => setIsSearchInputOnFocus(true)}
            // onBlur={() => setIsSearchInputOnFocus(false)}
            ref={inputDesktopRef}
            placeholder="Search"
            onChange={handleSearchChange}
            value={searchInputValue}
            className="outline-none w-full bg-transparent text-neutral font-medium ml-2"
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
              className={`rounded-full mr-1 select-none ${searchInputValue === "" ? "hidden" : ""}`}
            ></Image>
          </button>
          {isSearchInputOnFocus === true && (
            <div
              ref={searchResultsRef}
              className="absolute font-SpaceGrotesk top-14 w-[100.7%] ml-[-2px] bg-neutral left-0 rounded-xl min-h-16 p-1 border-2 border-primary text-secondary flex"
            >
              {searchInputValue === "" ? (
                <p className="font-semibold m-auto w-max">Search For Users</p>
              ) : searchResults === null ? (
                <p className="font-semibold m-auto w-max">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="font-normal m-auto w-max text-center">
                  results with `
                  <span className="font-semibold">{searchInputValue}</span>` not
                  found
                </p>
              ) : (
                <div className="font-medium m-auto w-full flex flex-col gap-2 max-h-[300px] overflow-auto dark-scroll">
                  {searchResults.map((item) => {
                    return (
                      <div
                        key={item.username}
                        onClick={() => {
                          router.push(`/profile?userId=${item.id}`);
                          setIsSearchInputOnFocus(false);
                        }}
                        className="flex w-full hover:bg-secondary items-center hover:text-neutral p-2 rounded-lg gap-2 cursor-pointer"
                      >
                        <Image
                          src={item.avatar}
                          alt={item.avatar}
                          width={40}
                          height={40}
                          className="rounded-full max-h-[40px] border-2 border-primary"
                        ></Image>
                        <div className="flex flex-col">
                          <p className="font-semibold">{item.name}</p>
                          <p className="font-normal text-[12px]">
                            {item.username}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {/* search-mobile-screen */}
        <button
          className={`md:hidden flex justify-center items-center border-2 ${isSearchBarMobileOpen === true ? "border-primary" : "border-neutral"} w-[50px] h-[50px] rounded-xl`}
          ref={searchButtonRef}
          onClick={() => {
            setIsSearchBarMobileOpen(true);
            handleFocusInput(inputMobileRef);
          }}
        >
          <Image
            src={`${
              isSearchBarMobileOpen === true
                ? "/searchGreen.svg"
                : "/searchWhite.svg"
            }`}
            alt={`${
              isSearchBarMobileOpen === true
                ? "/searchGreen.svg"
                : "/searchWhite.svg"
            }`}
            width={30}
            height={30}
            className=" select-none"
          ></Image>
        </button>
        <button
          className={`font-SpaceGrotesk ${isFeedbackFormOpen === true ? "" : ""} select-none max-md:text-sm h-[50px] bg-primary px-4 max-md:px-2 rounded-xl font-semibold text-neutral`}
          ref={buttonCreateFeedbackRef}
          onClick={handleOpenFeedbackForm}
        >
          Create feedback
        </button>
        <div
          className="flex justify-end font-SpaceGrotesk select-none"
          ref={DropDownRef}
        >
          <button
            className={`border-[3px] ${isDropDownOpen === true ? "border-primary" : "border-neutral"} w-[53px] h-[53px] rounded-full flex justify-center items-center`}
            onClick={() => {
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
                    <button
                      key={item.id}
                      className="flex gap-1 items-center text-white hover:bg-primary rounded-lg w-full h-full py-1 px-1 pr-3"
                      onClick={() => {
                        setIsDropDownOpen(false);
                        item.onClick !== undefined && item.onClick();
                        router.push(item.path);
                      }}
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
                  );
                })}
              </div>
              <div className="w-[25px] h-[1px] bg-[white] mx-auto"></div>
              <div className="bg-secondary w-full flex flex-col p-2 items-center justify-between mt-1 rounded-md">
                <a
                  href="https://discord.gg/5BpBZ929"
                  className="w-[100%] flex items-center py-1 px-1 pr-3 hover:bg-primary mx-auto gap-2 rounded-md"
                >
                  <Image
                    src={"/discord.svg"}
                    alt={"/discord.svg"}
                    width={25}
                    height={25}
                    className=""
                  ></Image>
                  Join Us
                </a>
                {/* <div className="w-[1px] h-[25px] bg-[white]"></div>
                <a
                  className="w-[30%] h-[80%] flex items-center justify-center p-1 hover:bg-primary mx-auto rounded-md"
                  href="https://github.com/yel-aziz/Reviews-Leet"
                >
                  <Image
                    src={"/brand-github.svg"}
                    alt={"/brand-github.svg"}
                    width={20}
                    height={20}
                    className=""
                  ></Image>
                </a> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        ref={searchBarRef}
        className={`md:hidden ${isSearchBarMobileOpen === false && "hidden"} top-20 absolute w-[97%] flex flex-col gap-2`}
      >
        <div
          className={`md:hidden ${isSearchBarMobileOpen === false && "hidden"} flex rounded-xl bg-transparent pl-2 h-[60px] w-full border-2 border-primary hover:border-2 hover:border-primary`}
        >
          <input
            maxLength={inputMaxLength}
            placeholder="Search"
            onChange={handleSearchChange}
            value={searchInputValue}
            className="outline-none w-full bg-transparent text-neutral font-medium ml-2"
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
              className={`rounded-full mr-1 ${searchInputValue === "" ? "hidden" : ""}`}
            ></Image>
          </button>
        </div>
        {isSearchBarMobileOpen === true && (
          <div
            ref={searchResultsRef}
            className="font-SpaceGrotesk bg-neutral rounded-xl min-h-16 p-1 border-2 border-primary text-secondary flex"
          >
            {searchInputValue === "" ? (
              <p className="font-semibold m-auto w-max">Search For Users</p>
            ) : searchResults === null ? (
              <p className="font-semibold m-auto w-max">Searching...</p>
            ) : searchResults.length === 0 ? (
              <p className="font-normal m-auto w-max text-center">
                results with `
                <span className="font-semibold">{searchInputValue}</span>` not
                found
              </p>
            ) : (
              <div className="font-medium m-auto w-full flex flex-col gap-2 max-h-[300px] overflow-auto dark-scroll">
                {searchResults.map((item) => {
                  return (
                    <div
                      key={item.username}
                      onClick={() => {
                        router.push(`/profile?userId=${item.id}`);
                        setIsSearchInputOnFocus(false);
                      }}
                      className="flex w-full hover:bg-secondary items-center hover:text-neutral p-2 rounded-lg gap-2 cursor-pointer"
                    >
                      <Image
                        src={item.avatar}
                        alt={item.avatar}
                        width={40}
                        height={40}
                        className="rounded-full max-h-[40px] border-2 border-primary"
                      ></Image>
                      <div className="flex flex-col">
                        <p className="font-semibold">{item.name}</p>
                        <p className="font-normal text-[12px]">
                          {item.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
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
