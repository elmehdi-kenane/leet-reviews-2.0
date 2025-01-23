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

interface UserContextType {
  userInfo: User | null;
  feedbacks: FeedbackInterface[];
  setFeedbacks: (
    value:
      | FeedbackInterface[]
      | ((prevFeedbacks: FeedbackInterface[]) => FeedbackInterface[]),
  ) => void;
  setUserInfo: (user: User | null) => void;
}

const defaultUser: User = {
  username: "default_username",
  avatar: "/default.jpeg",
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
  const [userInfo, setUserInfo] = useState<User | null>(defaultUser);
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
      const response = await fetch("/api/user");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        if (response.status === 401) {
          console.log("Unauthorized access. Please log in.");
          router.push("/auth/sign-in");
        } else {
          console.log("An unexpected error occurred.");
          router.push("/auth/sign-in");
        }
        return;
      }

      const data = await response.json();
      //   console.log("data inside useEffect", data);
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
