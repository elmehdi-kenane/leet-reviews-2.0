"use client";

import { HeaderSection } from "../settings/utils";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const userContext = useContext(UserContext);
  console.log("userContext.notifications", userContext.notifications);

  return (
    <div className="text-neutral max-lg:w-[90%] w-full h-full flex flex-col max-w-[850px] mx-auto max-lg:mb-24 gap-6 md:mt-8">
      <HeaderSection headerText="Notifications"></HeaderSection>
      <div className="flex flex-col w-full gap-3">
        {userContext.notifications.map((notification) => {
          console.log("notification", notification);
          return (
            <button
              key={notification.id}
              className={`w-full text-secondary flex items-center h-14 ${notification.isRead === false ? "bg-gray" : "bg-neutral"} hover:bg-neutral rounded-2xl border p-2 border-neutral`}
            >
              {notification.id} - {notification.type} -{" "}
              {notification.feedbackId}
              <p className="ml-auto text-[10px] mt-auto">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
