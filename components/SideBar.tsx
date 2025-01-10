"use client";

import Image from "next/image";
import heartIcon from "@/public/heart.svg";
import notificationIcon from "@/public/bell.svg";
import profileIcon from "@/public/profile.svg";
import homeIcon from "@/public/home.svg";
import heartFilledIcon from "@/public/heartFilled.svg";
import notificationFilledIcon from "@/public/notificationsFilled.svg";
import profileFilledIcon from "@/public/profileFilled.svg";
import homeFilledIcon from "@/public/homeFilled.svg";
import Link from "next/link";
import { useState } from "react";

const SideBar = () => {
  const Buttons = [
    {
      icon: homeIcon,
      iconFilled: homeFilledIcon,
      text: "Home",
      link: "/home",
    },
    {
      icon: heartIcon,
      iconFilled: heartFilledIcon,
      text: "Favorites",
      link: "/favorites",
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
      link: "/profile",
    },
  ];
  const [selected, setSelected] = useState(Buttons[0].text);
  return (
    <div className="max-lg:hidden flex flex-col items-center gap-3 fixed z-[100] w-[60px] py-2 mt-[100px] bg-neutral rounded-xl rounded-l-none border border-quaternary border-l-0">
      {Buttons.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.link}
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
