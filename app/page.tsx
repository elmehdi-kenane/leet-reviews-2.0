import { validateRequest } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DisplayAccounts } from "@/components/accounts";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) return redirect("/auth/signin");
  const avatar = user && user?.avatar !== null ? user?.avatar : "/default.jpeg";
  return (
    <div>
      {user?.username}
      <Image src={avatar} width={50} height={50} alt={"avatar"}></Image>
      <Link href={"/api/auth/connect/discord"}>
        <button>connect with discord</button>
      </Link>
      <DisplayAccounts></DisplayAccounts>
    </div>
  );
}
