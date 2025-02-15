"use client";

import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FeedbackInterface } from "@/lib/types";

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
  setUserInfo: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User>(defaultUser);
  const [feedbacks, setFeedbacks] = useState<FeedbackInterface[] | []>([]);
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
      setUserInfo(data);
    };

    fetchUser();
  }, [pathname]);

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, feedbacks, setFeedbacks }}
    >
      {children}
    </UserContext.Provider>
  );
};
