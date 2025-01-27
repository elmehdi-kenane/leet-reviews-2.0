"use client";

import Image from "next/image";
import notificationIcon from "@/public/bell.svg";
import profileIcon from "@/public/profile.svg";
import homeIcon from "@/public/home.svg";
import notificationFilledIcon from "@/public/notificationsFilled.svg";
import profileFilledIcon from "@/public/profileFilled.svg";
import homeFilledIcon from "@/public/homeFilled.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const SideBar = () => {
  const { userInfo } = useContext(UserContext);
  const [fullPath, setFullPath] = useState("");
  const [buttons, setButtons] = useState<button[] | []>([]);

  interface button {
    icon: string;
    iconFilled: string;
    text: string;
    link: string;
  }

  useEffect(() => {
    setButtons([
      {
        icon: homeIcon,
        iconFilled: homeFilledIcon,
        text: "Home",
        link: "/home",
      },
      // {
      //   icon: heartIcon,
      //   iconFilled: heartFilledIcon,
      //   text: "Favorites",
      //   link: "/favorites",
      // },
      {
        icon: notificationIcon,
        iconFilled: notificationFilledIcon,
        text: "Notifications",
        link: "/notifications",
      },
      {
        icon: profileIcon,
        iconFilled: profileFilledIcon,
        text: "Profile",
        link: `/profile?userId=${userInfo?.id}`,
      },
    ]);
    const path = window.location.pathname + window.location.search;
    setFullPath(path);
  }, [userInfo?.id]);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    console.log("fullPath", fullPath);
    console.log("userInfo?.id", userInfo?.id);
    console.log("buttons", buttons);

    const activeButton = buttons.find((button) => button.link === fullPath);
    if (activeButton) {
      console.log("activeButton", activeButton);
      setSelected(activeButton.text);
    } else console.log("button not found");
  }, [fullPath, userInfo?.id, buttons]);

  return (
    <div className="max-lg:hidden select-none flex flex-col items-center gap-3 fixed z-[100] w-[60px] py-2 mt-[100px] bg-neutral rounded-xl rounded-l-none border border-quaternary border-l-0">
      {buttons.map((item, index) => {
        return (
          <Link
            key={index}
            href={
              item.link === "/profile"
                ? `/profile?userId=${userInfo?.id}`
                : item.link
            }
            className="w-full flex items-center justify-center"
          >
            <button
              className={`flex items-center rounded-xl gap-1 border-2 border-transparent hover:border-secondary ${
                selected === item.text && "bg-secondary"
              } w-[80%] h-[48px] p-2`}
              onClick={() => {
                setSelected(item.text);
              }}
            >
              <Image
                src={selected === item.text ? item.iconFilled : item.icon}
                alt={item.text}
                width={30}
                height={30}
                className="mx-auto w-full h-full"
              ></Image>
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
