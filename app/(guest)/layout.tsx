import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

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
    // <html lang="en">
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased text-neutral relative w-full min-h-screen h-screen overflow-hidden flex flex-col`}
      style={{
        background: "#141e46",
      }}
    >
      <div className="bg-[#314AAC] w-44 h-44 rounded-full blur-3xl absolute -right-20 -top-20"></div>
      <div className="bg-[#314AAC] w-44 h-44 rounded-full blur-3xl absolute mx-auto right-56 left-0 top-52"></div>
      <Suspense>
        {children}
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
    </div>
    // </html>
  );
}
