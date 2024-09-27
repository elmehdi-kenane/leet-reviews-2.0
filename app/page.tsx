import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/signOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }
  const pfp =
    session.user?.image === null || session.user?.image === undefined
      ? "/default.jpeg"
      : session.user?.image;
  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <Image src={pfp} alt="picture profile" width={60} height={60} />
      <SignOutButton></SignOutButton>
    </div>
  );
}
