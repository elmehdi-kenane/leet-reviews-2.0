import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
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
        url: "https://leet-reviews-2-0.vercel.app/og_image.png", // Replace with actual image
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
              color: "#FFF5E0",
              backgroundColor: "#141E46",
            },
          }}
        />
      </Suspense>
    </div>
    // </html>
  );
}
