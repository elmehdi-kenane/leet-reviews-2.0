import localFont from "next/font/local";
import "./globals.css";
import { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
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
        url: "https://leet-reviews-2-0.vercel.app/og_tag_image.png", // Replace with actual image
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
  return (
    <html lang="en">
      <body
        style={{
          background: "linear-gradient(180deg, #141E46 55%, #314AAC 100%)",
        }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary text-neutral w-full h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
