"use client";

import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import BottomBar from "@/components/BottomBar";
import { UserProvider } from "@/context/UserContext";
import { ScrollContext } from "@/context/ScrollContext";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import React, { useRef } from "react";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const scrollableRef = useRef<HTMLDivElement>(null);

  return (
    <html lang="en">
      <body
        style={{
          background: "linear-gradient(180deg, #141E46 55%, #314AAC 100%)",
        }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary text-neutral w-full h-screen flex flex-col`}
      >
        <Suspense>
          <UserProvider>
            <ScrollContext.Provider value={{ scrollableRef }}>
              <Navbar />
              <div
                ref={scrollableRef}
                className={`flex overflow-y-scroll overflow-x-hidden light-scroll`}
              >
                <SideBar />
                <BottomBar />
                <div className="h-max w-full mt-[100px] max-md:mt-[150px] mb-[70px]">
                  {React.isValidElement(children)
                    ? React.cloneElement(children as React.ReactElement, {
                        scrollableRef,
                      })
                    : children}
                </div>
              </div>
            </ScrollContext.Provider>
          </UserProvider>
          <Toaster
            toastOptions={{
              className: "",
              style: {
                color: "#FFFFFF",
                backgroundColor: "#141E46",
              },
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
