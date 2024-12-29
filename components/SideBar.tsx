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
    <div className="bg-neutral p-1 mr-4 mb-5 flex flex-col rounded-xl rounded-l-none border-l-0 border-2 border-secondary">
      {Buttons.map((item, index) => {
        return (
          <Link
            href={item.link}
            key={index}
            className="flex flex-col justify-center items-center rounded-xl h-[76px] gap-2 w-14"
            onClick={() => setSelected(item.text)}
          >
            <Image
              src={selected === item.text ? item.iconFilled : item.icon}
              alt={selected === item.text ? item.iconFilled : item.icon}
              width={28}
              height={28}
              className="mr-1 w-[28px] h-[28px]"
            ></Image>
            {/* <p className="text-[12px] font-semibold">{item.text}</p> */}
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
