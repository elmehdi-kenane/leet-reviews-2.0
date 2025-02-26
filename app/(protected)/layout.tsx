import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import BottomBar from "@/components/BottomBar";
import { UserProvider } from "@/context/UserContext";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const { user } = await validateRequest();
  //   if (!user) {
  //     return redirect("/auth/sign-in");
  //   }

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
            <Navbar />
            <div
              className={`flex overflow-y-auto overflow-x-hidden light-scroll`}
            >
              <SideBar />
              <BottomBar />
              <div className="h-max w-full mt-[100px] max-md:mt-[150px] mb-[70px]">
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
