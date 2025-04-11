"use client";

// import { HeaderSection } from "../settings/utils";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReceivedNotificationInterface } from "@/lib/types";
import bellOff from "@/public/bell-off.svg";
import seenChecks from "@/public/seen-checks.svg";
import trash from "@/public/trash.svg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import toast from "react-hot-toast";
import likeFilled from "@/public/like-filled-white.svg";
import dislikeFilled from "@/public/dislike-filled-white.svg";

const NotificationsPage = () => {
  const userContext = useContext(UserContext);
  console.log("userContext.notifications", userContext.notifications);

  const handleClearAllNotifications = async () => {
    if (userContext.notifications?.length === 0) return;
    try {
      toast.loading("Deleting notifications…", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
      await fetch(`api/received-notification/delete-all`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error", error);
    } finally {
      userContext.setNotifications([]);
      toast.dismiss();
      toast.success("All notifications have been deleted.", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
    }
  };
  const handleMarkAllAsRead = async () => {
    if (userContext.notifications?.length === 0) return;
    const hasUnReadNotifications = userContext.notifications?.some(
      (notification) => (notification.isRead === false ? true : false),
    );
    if (!hasUnReadNotifications) {
      toast.dismiss();
      toast("No unread notifications.", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
      return;
    }
    try {
      toast.loading("Updating notifications…", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
      await fetch(`api/received-notification/mark-all-as-read`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error", error);
    } finally {
      userContext.setNotifications((prevNotifications) => {
        if (!prevNotifications) return [];
        const updatedNotifications = prevNotifications?.map(
          (notification: ReceivedNotificationInterface) => {
            return { ...notification, isRead: true };
          },
        );
        return updatedNotifications;
      });
      toast.dismiss();
      toast.success("Marked all as read.", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
    }
  };

  const actionButtons = [
    {
      text: "Clear All Notifications",
      shortText: "Clear All",
      icon: trash,
      iconSize: 15,
      handler: handleClearAllNotifications,
    },
    {
      text: "Mark All as Read",
      shortText: "Mark Read",
      icon: seenChecks,
      iconSize: 20,
      handler: handleMarkAllAsRead,
    },
  ];

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
      {/* <HeaderSection headerText="Notifications"></HeaderSection> */}
      {userContext.notifications === null ? (
        <SkeletonTheme baseColor="#D9D9D9" highlightColor="#FFFFFF">
          <div className="flex flex-col gap-3">
            <div className="flex justify-end gap-3">
              <Skeleton
                containerClassName=""
                style={{
                  width: "212px",
                  borderRadius: "12px",
                  minHeight: "52px",
                }}
              />
              <Skeleton
                containerClassName=""
                style={{
                  width: "177px",
                  borderRadius: "12px",
                  minHeight: "52px",
                }}
              />
            </div>
            {Array.from({ length: 5 }).map((_, index) => {
              const opacity = 1 - index * 0.15;
              return (
                <Skeleton
                  key={index}
                  containerClassName="flex-1"
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    minHeight: "56px",
                    opacity: opacity > 0 ? opacity : 0.2,
                  }}
                />
              );
            })}
          </div>
        </SkeletonTheme>
      ) : (
        <>
          <div className="flex justify-end gap-3 font-SpaceGrotesk flex-wrap font-semibold">
            {actionButtons.map((button) => {
              return (
                <button
                  onClick={button.handler}
                  className={`p-3 border-2 flex items-center gap-1 rounded-xl ${userContext.notifications?.length === 0 ? "cursor-not-allowed border-[gray]" : "border-primary hover:bg-primary"}`}
                  key={button.text}
                >
                  <Image
                    className={` select-none`}
                    src={button.icon}
                    height={button.iconSize}
                    width={button.iconSize}
                    alt={button.icon}
                  ></Image>
                  <span className="max-md:hidden">{button.text}</span>
                  <span className="md:hidden">{button.shortText}</span>
                </button>
              );
            })}
          </div>
          {userContext.notifications.length === 0 ? (
            <div className="flex w-full flex-col items-center font-SpaceGrotesk mt-16 text-center">
              <Image
                className="min-w-[40px] w-[40px] select-none mb-7"
                src={bellOff}
                height={30}
                width={30}
                alt={bellOff}
              ></Image>
              <span className="font-semibold text-xl">
                No notifications yet.
              </span>
              <span>Stay tuned — updates will show up here.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-3 max-md:text-[10px]">
                {userContext.notifications.map((receivedNotification) => {
                  console.log("receivedNotification", receivedNotification);
                  let reactionIcon = undefined;
                  if (
                    receivedNotification.notification.type === "vote" &&
                    receivedNotification.notification.voteIsUp === true
                  )
                    reactionIcon = likeFilled;
                  else if (
                    receivedNotification.notification.type === "vote" &&
                    receivedNotification.notification.voteIsUp === false
                  )
                    reactionIcon = dislikeFilled;
                  else if (receivedNotification.notification.type === "comment")
                    reactionIcon = "";
                  else if (receivedNotification.notification.type === "save")
                    reactionIcon = "";
                  return (
                    <Link
                      href={`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/home?feedbackId=${receivedNotification.notification.feedback.id}`}
                      key={receivedNotification.id}
                      className={`w-full text-secondary flex items-center h-14 ${receivedNotification.isRead === false ? "bg-gray" : "bg-neutral"} hover:bg-neutral rounded-2xl border p-2 border-neutral`}
                    >
                      <div className="flex mr-2 relative">
                        <Image
                          className="min-w-[40px] w-[40px] select-none rounded-full border border-secondary"
                          src={receivedNotification.notification.author.avatar}
                          height={30}
                          width={30}
                          alt={receivedNotification.notification.author.avatar}
                        ></Image>
                        <div className="rounded-full w-5 h-5 bg-secondary absolute bottom-[-5px] right-[-5px] p-1 flex justify-center items-center">
                          <Image
                            className=""
                            src={reactionIcon}
                            height={30}
                            width={30}
                            alt={reactionIcon}
                          ></Image>
                        </div>
                      </div>
                      <div className="flex max-md:flex-col w-full h-full">
                        <span className="my-auto">
                          <span
                            className="hover:text-primary hover:underline cursor-pointer font-semibold"
                            onClick={(e) =>
                              handleProfileClick(e, receivedNotification)
                            }
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
                            new Date(
                              receivedNotification.notification.createdAt,
                            ),
                            {
                              addSuffix: true,
                            },
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
