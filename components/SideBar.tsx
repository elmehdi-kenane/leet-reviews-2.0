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
import { usePathname, useSearchParams } from "next/navigation";

const SideBar = () => {
  const { userInfo, hasNewNotifications } = useContext(UserContext);
  const [fullPath, setFullPath] = useState("");

  const Buttons: button[] = [
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
      link: `/profile`,
    },
  ];

  const [buttons, setButtons] = useState<button[]>(Buttons);

  interface button {
    icon: string;
    iconFilled: string;
    text: string;
    link: string;
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const Buttons: button[] = [
      {
        icon: homeIcon,
        iconFilled: homeFilledIcon,
        text: "Home",
        link: "/home",
      },
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
        link: `/profile`,
      },
    ];
    setButtons(Buttons);
    const path = window.location.pathname + window.location.search;
    setFullPath(path);
  }, [userInfo?.id, pathname, searchParams]);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    const activeButton = buttons.find((button) => button.link === fullPath);
    if (activeButton) {
      setSelected(activeButton.text);
    } else {
      setSelected("");
    }
  }, [fullPath, userInfo?.id, buttons]);

  return (
    <div className="max-lg:hidden select-none flex flex-col items-center gap-3 fixed z-[100] w-[60px] py-2 mt-[100px] bg-neutral rounded-xl rounded-l-none border border-quaternary border-l-0">
      {buttons.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.link === "/profile" ? `/profile` : item.link}
            className={`w-full flex items-center justify-center`}
          >
            <button
              className={`flex items-center rounded-xl gap-1 relative border-2 border-transparent hover:border-secondary ${
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
              {item.text === "Notifications" && (
                <div
                  className={`p-1 ${hasNewNotifications === true ? "bg-[red]" : "bg-primary"} text-neutral absolute rounded-md text-[7px] left-5 top-5`}
                >
                  NEW
                </div>
              )}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
