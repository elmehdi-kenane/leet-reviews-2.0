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
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const SideBar = () => {
  const { userInfo } = useContext(UserContext);
  const Buttons = [
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
  const pathname = usePathname();
  console.log("pathname in sidebar", pathname);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    const activeButton = Buttons.find((button) => button.link === pathname);
    if (activeButton) {
      setSelected(activeButton.text);
    }
  }, [pathname]);

  return (
    <div className="max-lg:hidden select-none flex flex-col items-center gap-3 fixed z-[100] w-[60px] py-2 mt-[100px] bg-neutral rounded-xl rounded-l-none border border-quaternary border-l-0">
      {Buttons.map((item, index) => {
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
