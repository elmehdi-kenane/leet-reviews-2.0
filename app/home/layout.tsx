import localFont from "next/font/local";
import "../globals.css";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import BottomBar from "@/components/BottomBar";
// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

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

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const { user } = await validateRequest();
  //   if (!user) {
  //     console.log("redirect to sign in page");
  //     return redirect("/auth/signin");
  //   }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral text-secondary w-full h-screen flex flex-col`}
      >
        <UserProvider>
          <Navbar />
          <div className={`flex overflow-y-auto overflow-x-hidden home-scroll`}>
            <SideBar />
            <BottomBar />
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
