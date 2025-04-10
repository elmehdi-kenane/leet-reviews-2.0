"use client";

import { HeaderSection } from "../settings/utils";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReceivedNotificationInterface } from "@/lib/types";

const NotificationsPage = () => {
  const userContext = useContext(UserContext);
  console.log("userContext.notifications", userContext.notifications);

  const router = useRouter();

  const handleProfileClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    receivedNotification: ReceivedNotificationInterface,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(
      `${process.env.NEXT_PUBLIC_DOMAIN_NAME}/profile?userId=${receivedNotification.notification.author.id}`,
    );
  };

  return (
    <div className="text-neutral max-lg:w-[90%] w-full h-full flex flex-col max-w-[850px] mx-auto max-lg:mb-24 gap-6 md:mt-8">
      <HeaderSection headerText="Notifications"></HeaderSection>
      userId: {userContext.userInfo?.id}
      <div className="flex flex-col w-full gap-3 max-md:text-[10px]">
        {userContext.notifications.map((receivedNotification) => {
          console.log("receivedNotification", receivedNotification);
          return (
            <Link
              href={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/home?feedbackId=${receivedNotification.notification.feedback.id}`}
              key={receivedNotification.id}
              className={`w-full text-secondary flex items-center h-14 ${receivedNotification.isRead === false ? "bg-gray" : "bg-neutral"} hover:bg-neutral rounded-2xl border p-2 border-neutral`}
            >
              <Image
                className="min-w-[40px] w-[40px] mr-2 select-none rounded-full border border-secondary"
                src={receivedNotification.notification.author.avatar}
                height={30}
                width={30}
                alt={receivedNotification.notification.author.avatar}
              ></Image>
              <span className="">
                <span
                  className="hover:text-primary hover:underline cursor-pointer font-semibold"
                  onClick={(e) => handleProfileClick(e, receivedNotification)}
                >
                  {receivedNotification.notification.author.username}
                </span>{" "}
                {receivedNotification.notification.voteIsUp === true
                  ? "agreed"
                  : "disagreed"}{" "}
                with a feedback {receivedNotification.reason}.
              </span>
              <p className="ml-auto text-[10px] mt-auto">
                {formatDistanceToNow(
                  new Date(receivedNotification.notification.createdAt),
                  {
                    addSuffix: true,
                  },
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
