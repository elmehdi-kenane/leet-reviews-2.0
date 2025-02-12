import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import BottomBar from "@/components/BottomBar";
import { UserProvider } from "@/context/UserContext";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Leet Reviews - Honest Workplace Feedback",
  description:
    "Discover and share honest workplace feedback with Leet Reviews.",
  openGraph: {
    type: "website",
    url: "https://leet-reviews-2-0.vercel.app/",
    title: "Leet Reviews - Honest Workplace Feedback",
    description:
      "Discover and share honest workplace feedback with Leet Reviews.",
    images: [
      {
        url: "https://leet-reviews-2-0.vercel.app/_.jpeg", // Replace with actual image
        width: 1200,
        height: 630,
        alt: "Leet Reviews",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const { user } = await validateRequest();
  //   if (!user) {
  //     console.log("redirect to sign in page");
  //     return redirect("/auth/sign-in");
  //   }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[url('/bg.svg')] bg-cover bg-center bg-no-repeat text-neutral w-full h-screen flex flex-col`}
      >
        <Suspense>
          <UserProvider>
            <Navbar />
            <div
              className={`flex overflow-y-auto overflow-x-hidden light-scroll`}
            >
              <SideBar />
              <BottomBar />
              <div className="h-max w-full mt-[100px] max-md:mt-[150px]">
                {children}
              </div>
            </div>
          </UserProvider>
          <Toaster
            toastOptions={{
              className: "",
              style: {
                color: "#FFF5E0",
                backgroundColor: "#141E46",
              },
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
