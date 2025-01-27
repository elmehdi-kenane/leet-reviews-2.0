"use client";

import Image from "next/image";
import Link from "next/link";
import notificationIcon from "@/public/bell.svg";
import profileIcon from "@/public/profile.svg";
import homeIcon from "@/public/home.svg";
import notificationFilledIcon from "@/public/notificationsFilled.svg";
import profileFilledIcon from "@/public/profileFilled.svg";
import homeFilledIcon from "@/public/homeFilled.svg";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { usePathname, useSearchParams } from "next/navigation";

const BottomBar = () => {
  const { userInfo } = useContext(UserContext);
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
      link: `/profile?userId=${userInfo?.id}`,
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
    ];
    setButtons(Buttons);
    const path = window.location.pathname + window.location.search;
    setFullPath(path);
  }, [userInfo?.id, pathname, searchParams]);

  const [selected, setSelected] = useState("");

  useEffect(() => {
    // console.log("fullPath", fullPath);
    // console.log("userInfo?.id", userInfo?.id);
    // console.log("buttons", buttons);

    const activeButton = buttons.find((button) => button.link === fullPath);
    if (activeButton) {
      setSelected(activeButton.text);
    } else {
      setSelected("");
    }
  }, [fullPath, userInfo?.id, buttons]);
  return (
    <>
      {/* <div
        className="w-full lg:hidden fixed h-[30px] bottom-[89px] bg-neutral z-[100]"
        style={{
          maskImage:
            "linear-gradient(to top, rgba(255, 0, 0, 1), rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0))",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(255, 0, 0, 1), rgba(255, 0, 0, 0.5), rgba(255, 0, 0, 0))",
        }}
      ></div> */}
      <div className="w-full lg:hidden fixed h-[97px] bottom-0 bg-white/30 backdrop-blur-sm z-[99]"></div>
      <div className="lg:hidden fixed border border-quaternary bg-neutral left-0 right-0 bottom-[1%] max-w-[250px] w-[95%] h-[75px] mx-auto flex items-center justify-between p-3 rounded-2xl z-[100]">
        {Buttons.map((item, index) => {
          return (
            // <CustomizedTooltip
            //   placement="top"
            //   title={`${item.text}`}
            //   slotProps={{
            //     popper: {
            //       modifiers: [
            //         {
            //           name: "offset",
            //           options: {
            //             offset: [0, 5],
            //           },
            //         },
            //       ],
            //     },
            //   }}
            // >
            <Link
              key={index}
              href={item.link}
              className="w-full flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-1">
                <button
                  className={`flex items-center rounded-xl gap-1 border-2 border-transparent hover:border-[#141E46] ${
                    selected === item.text
                      ? "bg-[#141E46] scale-1 self-start"
                      : "bg-neutral"
                  } p-2 w-[48px] h-[48px]`}
                  onClick={() => setSelected(item.text)}
                >
                  <Image
                    src={selected === item.text ? item.iconFilled : item.icon}
                    alt={item.text}
                    width={30}
                    height={30}
                    className="mx-auto w-full h-full"
                  ></Image>
                </button>
              </div>
            </Link>
            // </CustomizedTooltip>
          );
        })}
      </div>
    </>
  );
};

export default BottomBar;
