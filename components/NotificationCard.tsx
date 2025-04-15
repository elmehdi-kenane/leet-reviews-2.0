import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  NotificationInterface,
  reaction,
  ReceivedNotificationInterface,
} from "@/lib/types";
import likeFilled from "@/public/like-filled-white.svg";
import saveFilled from "@/public/save-filled-icon-white.svg";
import dislikeFilled from "@/public/dislike-filled-white.svg";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";

const NotificationCard = ({
  receivedNotification,
}: {
  receivedNotification: ReceivedNotificationInterface;
}) => {
  const router = useRouter();
  const userContext = useContext(UserContext);
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
  const getReactionIconSize = (icon: string) => {
    if (icon === likeFilled || icon === dislikeFilled) return 30;
    else if (icon === saveFilled) return 7;
  };
  const getReactionIcon = (notification: NotificationInterface) => {
    if (notification.type === reaction.vote) {
      if (notification.voteIsUp === true) return likeFilled;
      else if (notification.voteIsUp === false) return dislikeFilled;
    } else if (notification.type === reaction.comment) return "";
    else if (notification.type === reaction.save) return saveFilled;
  };

  const getReactionVerb = (notification: NotificationInterface) => {
    if (notification.type === reaction.vote && notification.voteIsUp === true)
      return "agreed with a feedback";
    else if (
      notification.type === reaction.vote &&
      notification.voteIsUp === false
    )
      return "disagreed with a feedback";
    else if (notification.type === reaction.comment)
      return "commented on a feedback";
    else if (notification.type === reaction.save) return "saved a feedback";
  };
  const reactionIcon = getReactionIcon(receivedNotification.notification);
  const handleNotificationClick = async () => {
    userContext.setNotifications((prevNotifications) => {
      return (prevNotifications ?? []).map((notification) => {
        if (notification.id === receivedNotification.id)
          notification.isRead = true;
        return notification;
      });
    });
    await fetch(
      `api/received-notification/mark-as-read?notificationId=${receivedNotification.id}`,
      { method: "POST" },
    );
  };
  return (
    <Link
      onClick={handleNotificationClick}
      href={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/home?feedbackId=${receivedNotification.notification.feedback.id}`}
      key={receivedNotification.id}
      className={`w-full flex items-center h-14 ${receivedNotification.isRead === false ? "text-secondary bg-neutral hover:bg-gray" : " border-neutral text-neutral"} rounded-2xl border p-2 `}
    >
      <div className="flex mr-2 relative">
        <Image
          className={`min-w-[40px] w-[40px] select-none rounded-full border ${receivedNotification.isRead === false ? "border-secondary" : "border-neutral"}`}
          src={receivedNotification.notification.author.avatar}
          height={30}
          width={30}
          alt={receivedNotification.notification.author.avatar}
        ></Image>
        <div className="rounded-full w-5 h-5 bg-secondary absolute bottom-[-5px] right-[-5px] p-1 flex justify-center items-center">
          <Image
            className=""
            src={reactionIcon}
            height={getReactionIconSize(reactionIcon)}
            width={getReactionIconSize(reactionIcon)}
            alt={reactionIcon}
          ></Image>
        </div>
      </div>
      <div className="flex max-md:flex-col w-full h-full">
        <span className="my-auto">
          <span
            className="hover:text-primary hover:underline cursor-pointer font-semibold"
            onClick={(e) => handleProfileClick(e, receivedNotification)}
          >
            {receivedNotification.notification.author.name}
          </span>{" "}
          {getReactionVerb(receivedNotification.notification)}{" "}
          {receivedNotification.reason}.
        </span>
        <p className="ml-auto text-[10px] mt-auto">
          {formatDistanceToNow(
            new Date(receivedNotification.notification.createdAt),
            {
              addSuffix: true,
            },
          )}
        </p>
      </div>
    </Link>
  );
};

export default NotificationCard;
