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
  notifications: ReceivedNotificationInterface[] | null;
  pusherSubscriptions: string[];
  setPusherSubscriptions: (
    value: string[] | ((prevNotifications: string[] | null) => string[]),
  ) => void;
  setNotifications: (
    value:
      | null
      | ReceivedNotificationInterface[]
      | ((
          prevNotifications: ReceivedNotificationInterface[] | null,
        ) => ReceivedNotificationInterface[]),
  ) => void;
  hasNewNotifications: boolean;
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
  hasNewNotifications: false,
  pusherSubscriptions: [],
  setPusherSubscriptions: () => {},
  setUserInfo: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User>(defaultUser);
  const [feedbacks, setFeedbacks] = useState<FeedbackInterface[] | []>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    ReceivedNotificationInterface[] | [] | null
  >(null);
  const [pusherSubscriptions, setPusherSubscriptions] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hiddenRoutes = ["/auth/sign-in", "/auth/sign-up"];
    const isHidden = hiddenRoutes.includes(pathname);

    if (isHidden) {
      // Skip user fetching when the route is hidden
      return;
    }

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
      //   console.log(data);
      setNotifications(data.notifications);
      setHasNewNotifications(data.hasNewNotifications);
      setUserInfo((_prev) => data.userInfos);
      data.subscribedPusherChannelNames.forEach((channelName: string) => {
        // console.log("subscribe to", channelName);
        pusherClient.subscribe(channelName);
      });
      setPusherSubscriptions(data.subscribedPusherChannelNames);
    };
    fetchUser();
    return () => {
      pusherClient.unbind_all(); // Unbind all event listeners
    };
  }, [pathname]);

  useEffect(() => {
    const updateHasNewNotifications = async () => {
      const isOnNotificationsPage = pathname === "/notifications";

      if (isOnNotificationsPage) {
        setHasNewNotifications(false);
        await fetch("/api/user/update/notifications-counter", {
          method: "POST",
        });
      } else if (notifications && notifications.length === 0) {
        setHasNewNotifications(false);
        await fetch("/api/user/update/notifications-counter", {
          method: "POST",
        });
      }
    };
    updateHasNewNotifications();
  }, [pathname, notifications]);

  useEffect(() => {
    if (userInfo.id === "default_id") return;

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
        // console.log(
        //   "data.newReceivedNotification",
        //   data.newReceivedNotification
        // );
        setNotifications((prevNotifications) => {
          const updatedList = (prevNotifications ?? []).filter(
            (notification) =>
              notification.id !== data.newReceivedNotification.id,
          );
          return [data.newReceivedNotification, ...updatedList];
        });
        // console.log("add", data.newReceivedNotification, "to", notifications);
      }
    };
    const newVoteCallback = (data: {
      voteIsUp: boolean;
      authorId: string;
      feedbackId: string;
    }) => {
      if (userInfo.id !== data.authorId && userInfo.id !== "default_id") {
        // console.log("add new received notification");
        setHasNewNotifications(true);
        const receivedNotification: receivedNotificationDataInterface = {
          type: "vote",
          voteIsUp: data.voteIsUp,
          feedbackId: data.feedbackId,
          authorId: data.authorId,
        };
        addReceivedNotification(receivedNotification);
      }
    };

    const deleteNotificationCallback = (data: { notificationId: string }) => {
      //   console.log(
      //     "deleteNotificationCallback notificationId",
      //     data.notificationId
      //   );
      //   console.log("deleteNotificationCallback notifications", notifications);
      setNotifications((prevNotifications) => {
        const updatedList = (prevNotifications ?? []).filter(
          (notification) =>
            notification.notification.id !== data.notificationId,
        );
        return updatedList;
      });
    };
    pusherClient.bind(pusherEventTypes.newVote, newVoteCallback);
    pusherClient.bind(
      pusherEventTypes.deleteNotification,
      deleteNotificationCallback,
    );
    return () => {
      pusherClient.unbind(pusherEventTypes.newVote, newVoteCallback);
      pusherClient.unbind(
        pusherEventTypes.deleteNotification,
        deleteNotificationCallback,
      );
    };
  }, [userInfo, notifications]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        feedbacks,
        setFeedbacks,
        notifications,
        setNotifications,
        hasNewNotifications,
        pusherSubscriptions,
        setPusherSubscriptions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
