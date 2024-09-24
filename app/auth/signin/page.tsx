"use client";
import { signIn } from "next-auth/react"; // Use from 'next-auth/react'
import { providers } from "@/utils/AuthProviders";

export interface providerInterface {
  id: string;
  name: string;
}

export default function SignIn() {
  const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
      const providerData = (provider as () => { id: string; name: string })();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  });
  return (
    <>
      {providerMap.map((provider: providerInterface) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}
