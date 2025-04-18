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

      if (
        (isOnNotificationsPage && hasNewNotifications === true) ||
        (notifications && notifications.length === 0)
      ) {
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
      authorAvatar: string;
      createdAt: string;
      authorName: string;
      feedbackId: string;
    }
    const addReceivedNotification = async (
      receivedNotificationData: receivedNotificationDataInterface,
    ) => {
      const res = await fetch("/api/received-notification/get-reason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackId: receivedNotificationData.feedbackId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const receivedNotificationWithReason: ReceivedNotificationInterface = {
          reason: data.reason,
          id: "xd",
          isRead: false,
          notification: {
            id: "xd",
            type: receivedNotificationData.type,
            feedbackId: receivedNotificationData.feedbackId,
            authorId: receivedNotificationData.authorId,
            voteIsUp: receivedNotificationData.voteIsUp,
            author: {
              id: receivedNotificationData.authorId,
              avatar: receivedNotificationData.authorAvatar,
              name: receivedNotificationData.authorName,
            },
            createdAt: receivedNotificationData.createdAt,
          },
        };
        setNotifications([
          receivedNotificationWithReason,
          ...(notifications ?? []),
        ]);
        // console.log("add", data.newReceivedNotification, "to", notifications);
      }
    };
    const newReactionCallback = (data: {
      voteIsUp: boolean;
      authorId: string;
      authorAvatar: string;
      createdAt: string;
      authorName: string;
      feedbackId: string;
      type: string;
    }) => {
      if (userInfo.id !== data.authorId && userInfo.id !== "default_id") {
        setHasNewNotifications(true);
        const receivedNotification: receivedNotificationDataInterface = {
          type: data.type,
          voteIsUp: data.voteIsUp,
          feedbackId: data.feedbackId,
          authorId: data.authorId,
          createdAt: data.createdAt,
          authorAvatar: data.authorAvatar,
          authorName: data.authorName,
        };
        addReceivedNotification(receivedNotification);
      }
    };

    /** the author of the notification has (unlike - delete comment - un save) the feedback */
    const deleteNotificationCallback = (data: { notificationId: string }) => {
      setNotifications((prevNotifications) => {
        const updatedList = (prevNotifications ?? []).filter(
          (notification) =>
            notification.notification.id !== data.notificationId,
        );
        return updatedList;
      });
    };
    pusherClient.bind(pusherEventTypes.newReaction, newReactionCallback);
    pusherClient.bind(
      pusherEventTypes.deleteNotification,
      deleteNotificationCallback,
    );
    return () => {
      pusherClient.unbind(pusherEventTypes.newReaction, newReactionCallback);
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
