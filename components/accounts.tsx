"use client";

import { useEffect, useState } from "react";
import { Account } from "@/app/api/account/route";
import Image from "next/image";

export const DisplayAccounts = () => {
  const [authAccounts, setAuthAccounts] = useState<Account[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/account");
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        const data = await response.json();
        setAuthAccounts(data.authAccounts);
        setConnectedAccounts(data.connectedAccounts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Accounts</h2>

      <div className="mb-6">
        <h3 className="text-md font-bold">Authenticated Accounts</h3>
        {authAccounts.length === 0 ? (
          <p>No authenticated accounts found.</p>
        ) : (
          <ul className="list-disc ml-5">
            {authAccounts.map((account, index) => (
              <li key={index}>
                {account.provider}: {account.account_type}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-md font-bold">Connected Accounts</h3>
        {connectedAccounts.length === 0 ? (
          <p>No connected accounts found.</p>
        ) : (
          <ul className="list-disc ml-5">
            {connectedAccounts.map((account, index) => {
              return (
                <li key={index}>
                  {account.avatar !== undefined && (
                    <Image
                      src={account.avatar}
                      alt={account.avatar}
                      width={50}
                      height={50}
                    ></Image>
                  )}
                  {account.provider}: {account.account_type}: {account.username}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
