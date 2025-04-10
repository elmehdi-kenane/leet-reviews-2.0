"use client";

import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FeedbackInterface,
  NotificationInterface,
  ReceivedNotificationInterface,
} from "@/lib/types";
import pusherClient, { pusherEventTypes } from "@/lib/pusher";

export interface User {
  username: string;
  avatar: string;
  id: string;
  email: string;
}

export interface UserContextType {
  userInfo: User | null;
  feedbacks: FeedbackInterface[];
  setFeedbacks: (
    value:
      | FeedbackInterface[]
      | ((prevFeedbacks: FeedbackInterface[]) => FeedbackInterface[]),
  ) => void;
  notifications: ReceivedNotificationInterface[];
  setNotifications: (
    value:
      | ReceivedNotificationInterface[]
      | ((
          prevFeedbacks: ReceivedNotificationInterface[],
        ) => ReceivedNotificationInterface[]),
  ) => void;
  setUserInfo: (user: User | ((prevUser: User) => User)) => void;
}

const defaultUser: User = {
  username: "default_username",
  avatar: "/default_avatar.jpg",
  id: "default_id",
  email: "default_email",
};

const defaultUserContext: UserContextType = {
  userInfo: defaultUser,
  feedbacks: [],
  setFeedbacks: () => {},
  notifications: [],
  setNotifications: () => {},
  setUserInfo: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User>(defaultUser);
  const [feedbacks, setFeedbacks] = useState<FeedbackInterface[] | []>([]);
  const [notifications, setNotifications] = useState<
    ReceivedNotificationInterface[] | []
  >([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hiddenRoutes = ["/auth/sign-in", "/auth/sign-up"];
    const isHidden = hiddenRoutes.includes(pathname);

    if (isHidden) {
      // Skip user fetching when the route is hidden
      return;
    }

    interface receivedNotificationDataInterface {
      type: string;
      voteIsUp: boolean;
      authorId: string;
      feedbackId: string;
    }

    const addReceivedNotification = async (
      data: receivedNotificationDataInterface,
    ) => {
      const res = await fetch("/api/received-notification/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: data.type,
          voteIsUp: data.voteIsUp,
          authorId: data.authorId,
          feedbackId: data.feedbackId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(
          "data.newReceivedNotification",
          data.newReceivedNotification,
        );
        setNotifications([data.newReceivedNotification, ...notifications]);
        console.log("add", data.newReceivedNotification, "to", notifications);
      }
    };

    const newVoteCallback = (data: {
      voteIsUp: boolean;
      authorId: string;
      feedbackId: string;
    }) => {
      console.log(userInfo.id, "xx", data.authorId);
      console.log("data.voteIsUp", data.voteIsUp);

      if (userInfo.id !== data.authorId) {
        const receivedNotification: receivedNotificationDataInterface = {
          type: "vote",
          voteIsUp: data.voteIsUp,
          feedbackId: data.feedbackId,
          authorId: data.authorId,
        };
        addReceivedNotification(receivedNotification);
        // add the new notification to the state
      }
    };
    console.log("all subscribed channels");
    pusherClient.allChannels().forEach((channel) => console.log(channel.name));
    pusherClient.bind(pusherEventTypes.newVote, newVoteCallback);
    const fetchUser = async () => {
      const response = await fetch("/api/user/get");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        if (response.status === 401) {
          router.push("/auth/sign-in");
        }
        return;
      }

      const data = await response.json();
      console.log(data);
      setNotifications(data.notifications);
      setUserInfo(data.userInfos);
    };

    fetchUser();
    return () => {
      pusherClient.unbind_all(); // Unbind all event listeners
    };
  }, [pathname]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        feedbacks,
        setFeedbacks,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
