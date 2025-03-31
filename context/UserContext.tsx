"use client";

import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FeedbackInterface, NotificationInterface } from "@/lib/types";
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
      | ((prevFeedbacks: FeedbackInterface[]) => FeedbackInterface[])
  ) => void;
  notifications: NotificationInterface[];
  setNotifications: (
    value:
      | NotificationInterface[]
      | ((prevFeedbacks: NotificationInterface[]) => NotificationInterface[])
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
    NotificationInterface[] | []
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
    const createNotification = async (data: {
      type: string;
      voteIsUp: boolean;
      authorId: string;
      feedbackId: string;
    }) => {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "vote",
          voteIsUp: data.voteIsUp,
          authorId: data.authorId,
          feedbackId: data.feedbackId,
          isRead: false,
        }),
      });
    };
    const newVoteCallback = (data: string) => {
      console.log("data", data);
    };
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

      setUserInfo(data.userInfos);
    };

    fetchUser();
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
