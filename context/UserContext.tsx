"use client";

import React, { createContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
export interface User {
  username: string;
  avatar: string;
  id: string;
  email: string;
}

interface UserContextType {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

const defaultUser: User = {
  username: "default_username",
  avatar: "/default.jpeg",
  id: "default_id",
  email: "default_email",
};

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(defaultUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const hiddenRoutes = ["/auth/signin", "/auth/signup"];
    const isHidden = hiddenRoutes.includes(pathname);

    if (isHidden) {
      // Skip user fetching when the route is hidden
      return;
    }

    const fetchUser = async () => {
      console.log("inside fetchUser");
      const response = await fetch("/api/user");

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        if (response.status === 401) {
          console.log("Unauthorized access. Please log in.");
          router.push("/auth/signin");
        } else {
          console.log("An unexpected error occurred.");
          router.push("/auth/signin");
        }
        return;
      }

      const data = await response.json();
      console.log("data inside useEffect", data);
      setUserInfo(data);
    };

    fetchUser();
  }, [pathname]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
