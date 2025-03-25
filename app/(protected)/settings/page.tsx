"use client";

import { useEffect, useState, useContext, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  SwitchCard,
  UnSavedChangesPopUp,
  HeaderSection,
  SelectCard,
  //   AccountCard,
  SignedAsCard,
  //   accountsArr,
} from "@/app/(protected)/settings/utils";
import { UserContext, User } from "@/context/UserContext";
import { UnSavedChangesPopUpState } from "./utils";
// import { linkedAccountInterface } from "@/app/(protected)/settings/utils";
import Cookies from "js-cookie";
import { isValidImageFile } from "@/utils";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export type formDataType = {
  name: string;
  email: string;
  bio: string;
  avatar: string | File;
  isFeedbacksHidden: boolean;
  isCommentsAndVotesHidden: boolean;
  accountDisplayedWithFeedbacks: string;
  [key: string]: boolean | string | File | undefined;
};

export interface userAccountInterface {
  provider: string;
  accountType: string;
  username: string;
  avatar: string;
}

const Settings = () => {
  const defaultDetails: formDataType = {
    name: "",
    email: "",
    bio: "",
    avatar: "",
    isFeedbacksHidden: false,
    isCommentsAndVotesHidden: false,
    accountDisplayedWithFeedbacks: "",
  };

  const defaultUserAccounts: userAccountInterface[] = [
    {
      provider: "",
      accountType: "",
      username: "",
      avatar: "",
    },
  ];

  const [userAccounts, setUserAccounts] =
    useState<userAccountInterface[]>(defaultUserAccounts);
  const [originalDetails, setOriginalDetails] =
    useState<formDataType>(defaultDetails);
  const [updatedDetails, setUpdatedDetails] =
    useState<formDataType>(defaultDetails);
  const [isDetailsChanged, setIsDetailsChanged] = useState(
    UnSavedChangesPopUpState.CLOSED,
  );
  const [isLoading, setIsLoading] = useState(true);
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const connectionStatus = Cookies.get("connection_status");
    const provider = Cookies.get("provider");
    if (connectionStatus === "success" || connectionStatus === "failure") {
      setTimeout(() => {
        toast.dismiss();
        if (connectionStatus === "success")
          toast.success(`${provider} account connected successfully!`, {
            style: { background: "#FFFFFF", color: "#141e46" },
          });
        else
          toast.error("Connection was cancelled or invalid.", {
            id: "Connection was cancelled or invalid.",
            style: { background: "#FFFFFF", color: "#141e46" },
          });
        Cookies.remove("connection_status");
        Cookies.remove("provider");
      }, 300);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/user/settings");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        if (response.status === 401) {
          router.push("/auth/sign-in");
        } else {
          router.push("/auth/sign-in");
        }
        return;
      }
      const data = await response.json();

      setOriginalDetails(data);
      setUpdatedDetails(data);
      setUserAccounts(data.accounts);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (JSON.stringify(updatedDetails) !== JSON.stringify(originalDetails)) {
      setIsDetailsChanged(UnSavedChangesPopUpState.OPENING);
    } else if (isDetailsChanged === UnSavedChangesPopUpState.OPENING) {
      setIsDetailsChanged(UnSavedChangesPopUpState.CLOSING);
    }
  }, [updatedDetails]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDetailsChanged(UnSavedChangesPopUpState.CLOSING);
    toast.loading("update informations...", {
      style: { background: "#FFFFFF", color: "#141e46" },
    });
    const formData = new FormData(event.currentTarget);
    const formDataValues = Object.fromEntries(formData);

    if (formDataValues.name === "") {
      toast.error("Name cannot be empty");
      return;
    }
    // Check for file input and remove empty avatar files from FormData
    const avatarFile = formData.get("avatar");
    if (avatarFile && avatarFile instanceof File && avatarFile.size === 0) {
      formData.delete("avatar"); // Remove empty file from FormData
    }
    if (updatedDetails.avatar !== originalDetails.avatar) {
      userContext.setUserInfo((prev: User) => {
        return {
          ...prev,
          ["avatar"]: URL.createObjectURL(updatedDetails.avatar as File),
        };
      }); // updated the user context so the avatar in the navbar looks updated
      formData.append("avatar", updatedDetails.avatar);
    }
    // set unchanged details to undefined will be used in the backend
    Object.keys(formDataValues).forEach((key) => {
      if (updatedDetails[key] === originalDetails[key]) {
        formData.delete(key); // Remove unchanged fields from FormData
      }
    });
    const res = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      toast.dismiss();
      toast.success("Preferences updated successfully 👍", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
      setOriginalDetails(updatedDetails);
    }
  };

  return (
    <div className="text-neutral max-lg:w-[90%] w-full h-full flex flex-col max-w-[850px] mx-auto max-lg:mb-24 gap-12 md:mt-8">
      {!isLoading ? (
        <>
          <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-12">
            <Profile
              userAccounts={userAccounts}
              originalDetails={originalDetails}
              updatedDetails={updatedDetails}
              setUpdatedDetails={setUpdatedDetails}
            ></Profile>
            <Visibility
              updatedDetails={updatedDetails}
              userAccounts={userAccounts}
              setUpdatedDetails={setUpdatedDetails}
            ></Visibility>
            <div
              className={`w-full absolute top-0 right-0 left-0 flex ${isDetailsChanged === UnSavedChangesPopUpState.OPENING ? "display-unsaved-changes-pop-up" : isDetailsChanged === UnSavedChangesPopUpState.CLOSING ? "un-display-unsaved-changes-pop-up" : "hidden"}`}
            >
              <UnSavedChangesPopUp
                originalDetails={originalDetails}
                setUpdatedDetails={setUpdatedDetails}
                setIsDetailsChanged={setIsDetailsChanged}
              ></UnSavedChangesPopUp>
            </div>
          </form>
          {/* <AccountConnections userAccounts={userAccounts}></AccountConnections> */}
          <AccountDeletion></AccountDeletion>
        </>
      ) : (
        <LoadingState></LoadingState>
      )}
    </div>
  );
};

const LoadingState = () => {
  return (
    <SkeletonTheme baseColor="#D9D9D9" highlightColor="#FFFFFF">
      <div className="flex gap-3 flex-col">
        <Skeleton
          containerClassName="flex-1"
          style={{
            width: "25%",
            borderRadius: "8px",
            minHeight: "50px",
          }}
        />
        <Skeleton
          containerClassName="flex-1"
          style={{
            width: "100%",
            borderRadius: "24px",
            minHeight: "227px",
          }}
        />
      </div>
      <div className="flex gap-3 flex-col">
        <Skeleton
          containerClassName="flex-1"
          style={{
            width: "25%",
            borderRadius: "8px",
            minHeight: "50px",
          }}
        />
        <Skeleton
          containerClassName="flex-1"
          style={{
            width: "100%",
            borderRadius: "24px",
            minHeight: "227px",
          }}
        />
      </div>
      <Skeleton
        containerClassName="flex-1"
        style={{
          width: "100%",
          borderRadius: "12px",
          minHeight: "90px",
        }}
      />
      <Skeleton
        containerClassName="flex-1"
        style={{
          width: "100%",
          borderRadius: "12px",
          minHeight: "90px",
        }}
      />
    </SkeletonTheme>
  );
};

const Profile = ({
  setUpdatedDetails,
  updatedDetails,
  userAccounts,
  originalDetails,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  userAccounts: userAccountInterface[];
  originalDetails: formDataType;
}) => {
  const inputs = [
    { type: "text", placeholder: "name", name: "name" },
    { type: "email", placeholder: "email", name: "email" },
    { type: "textarea", placeholder: "bio", name: "bio" },
  ];
  const getInputValue = (name: keyof formDataType) =>
    (updatedDetails?.[name] || "") as string;

  const getAvatar = (avatar: string | File | undefined) => {
    if (avatar === undefined) {
      return originalDetails.avatar as string;
    }
    if (typeof avatar === "string") return avatar;
    else return URL.createObjectURL(avatar);
  };

  const authAccount = userAccounts.find(
    (account) => account.accountType === "AUTH",
  );

  return (
    <div className="flex flex-col gap-5 relative">
      <HeaderSection headerText="Profile"></HeaderSection>
      <SignedAsCard top={-10} authAccount={authAccount}></SignedAsCard>
      <div className="flex max-sm:flex-col gap-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          {inputs.map((item, index) => {
            return item.type === "textarea" ? (
              <textarea
                key={index}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setUpdatedDetails((prev: formDataType) => {
                    return {
                      ...prev,
                      [name]: value,
                    };
                  });
                }}
                className="p-2 outline-primary bg-transparent font-SpaceGrotesk flex-1 rounded-xl border border-neutral"
                maxLength={80}
                placeholder={item.placeholder}
                value={getInputValue(item.name as keyof formDataType)}
                name={item.name}
              />
            ) : (
              <input
                key={index}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setUpdatedDetails((prev: formDataType) => {
                    return {
                      ...prev,
                      [name]: value,
                    };
                  });
                }}
                className="p-2 outline-primary bg-transparent h-[50px] font-SpaceGrotesk rounded-xl border border-neutral"
                type={item.type}
                placeholder={item.placeholder}
                value={getInputValue(item.name as keyof formDataType)}
                name={item.name}
              />
            );
          })}
        </div>
        <div className="w-[150px] flex sm:flex-col max-sm:w-full gap-3 items-center border border-neutral p-3 rounded-xl">
          <Image
            src={getAvatar(updatedDetails.avatar)}
            alt={getAvatar(updatedDetails.avatar)}
            width={110}
            height={110}
            className="rounded-full select-none min-w-[110px] min-h-[110px] max-sm:min-w-[70px] max-sm:min-h-[70px] max-w-[110px] max-h-[110px] max-sm:max-w-[70px] max-sm:max-h-[70px] border-2 border-neutral"
          />
          <button
            type="button"
            className="bg-neutral hover:bg-primary hover:text-neutral rounded-md p-2 text-secondary font-SpaceGrotesk max-sm:ml-auto max-sm:flex-1 sm:w-full relative"
          >
            <input
              type="file"
              name="avatar"
              accept="image/png, image/jpeg"
              className="opacity-0 absolute h-full w-full top-0 left-0"
              onChange={(e) => {
                const files = e.target.files;
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (files && files[0].size > maxSize) {
                  toast.error("File size is too large. Maximum size is 5MB.", {
                    duration: 7000,
                  });
                  e.preventDefault();
                  return;
                } else if (files && !isValidImageFile(files[0])) {
                  e.target.value = "";
                  e.preventDefault();
                  return;
                }
                if (files && files[0]) {
                  setUpdatedDetails((prev) => ({
                    ...prev!,
                    avatar: files[0],
                  }));
                }
                e.target.value = "";
                // Reset input value so selecting the same file triggers onChange again
              }}
            />
            <p className="select-none">upload</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const Visibility = ({
  setUpdatedDetails,
  updatedDetails,
  userAccounts,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  userAccounts: userAccountInterface[];
}) => {
  return (
    <div className="flex flex-col gap-5">
      <HeaderSection headerText="Visibility"></HeaderSection>
      <div className="border border-neutral p-3 flex flex-col rounded-xl">
        <SwitchCard
          name="isFeedbacksHidden"
          updatedDetails={updatedDetails}
          setUpdatedDetails={setUpdatedDetails}
          text={"Hide Feedbacks From Profile"}
        ></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SwitchCard
          name="isCommentsAndVotesHidden"
          updatedDetails={updatedDetails}
          setUpdatedDetails={setUpdatedDetails}
          text={"Hide Comments and Votes From Profile"}
        ></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SelectCard
          name="accountDisplayedWithFeedbacks"
          updatedDetails={updatedDetails}
          userAccounts={userAccounts}
          setUpdatedDetails={setUpdatedDetails}
          text={"The account appears with your feedbacks"}
        ></SelectCard>
      </div>
    </div>
  );
};

// const AccountConnections = ({
//   userAccounts,
// }: {
//   userAccounts: userAccountInterface[];
// }) => {
//   const [accounts, setAccounts] =
//     useState<linkedAccountInterface[]>(userAccounts);
//   useEffect(() => {
//     // Find missing items from accountsArr that are not in the current state
//     setAccounts((prev) => {
//       const missingItems = accountsArr.filter(
//         (item) =>
//           !prev.some((acc) => {
//             if (acc.provider === item.provider) return { ...item };
//           }),
//       );
//       return missingItems.length > 0 ? [...prev, ...missingItems] : prev;
//     });
//     // remove the auth account from the list
//     setAccounts((prev) => {
//       const updatedAccounts = prev.filter((account) => {
//         const userAccount = userAccounts.find(
//           (userAccount) =>
//             userAccount.provider === account.provider &&
//             userAccount.accountType === "AUTH",
//         );
//         return (
//           userAccount === undefined || account.provider !== userAccount.provider
//         );
//       });
//       return updatedAccounts;
//     });
//     // remove the 42 and github account from the list *will be added later
//     // remove the linkedIn account also (linkedin doesn't provide the username)
//     setAccounts((prev) => {
//       const updatedAccounts = prev.filter((account) => {
//         return (
//           account.provider !== "fortyTwo" &&
//           account.provider !== "github" &&
//           account.provider !== "linkedIn"
//         );
//       });
//       return updatedAccounts;
//     });
//     // update with already linked accounts
//     setAccounts((prev) => {
//       const updatedAccounts = prev.map((account) => {
//         const userAccount = userAccounts.find(
//           (userAccount) =>
//             userAccount.provider === account.provider &&
//             userAccount.accountType === "CONNECTED",
//         );
//         if (userAccount) {
//           account.isLinked = true;
//           account.username = userAccount.username;
//           account.avatar = userAccount.avatar;
//         }
//         return account;
//       });
//       return updatedAccounts;
//     });
//   }, [userAccounts]);

//   return (
//     <div className="flex flex-col gap-5">
//       <HeaderSection headerText="Linked Accounts"></HeaderSection>
//       <div className="border border-neutral p-3 flex flex-col rounded-xl min-h-[66px]">
//         {accounts.map((account, index) => {
//           return (
//             <div key={account.provider}>
//               <AccountCard
//                 setAccounts={setAccounts}
//                 account={account}
//               ></AccountCard>
//               {index + 1 < accounts.length && (
//                 <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

const AccountDeletion = () => {
  const router = useRouter();
  enum popUpDeleteAccountState {
    none,
    confirmDeletion,
    deletionConfirmed,
  }
  const [isPopUpDeleteAccount, setIsPopUpDeleteAccount] = useState(
    popUpDeleteAccountState.none,
  );
  const [confirmationText, setConfirmationText] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const handleDeleteAccount = async () => {
    if (confirmationText !== "DELETE") {
      toast.dismiss();
      toast.error("invalid confirmation text.", {
        style: { background: "#FFFFFF", color: "#141e46" },
      });
      return;
    }
    toast.dismiss();
    toast.loading("account deletion...", {
      style: { background: "#FFFFFF", color: "#141e46" },
      position: "bottom-center",
    });
    setIsPopUpDeleteAccount(popUpDeleteAccountState.deletionConfirmed);
    setTimeout(async () => {
      const res = await fetch("/api/user/delete", { method: "POST" });
      toast.dismiss();
      if (res.ok)
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/sign-in`);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsPopUpDeleteAccount(popUpDeleteAccountState.none);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 mb-5">
      <HeaderSection headerText="Danger Zone"></HeaderSection>
      {isPopUpDeleteAccount !== popUpDeleteAccountState.none && (
        <div className="absolute h-full w-full left-0 top-0 z-[111] flex justify-center items-center bg-white/30 backdrop-blur-lg">
          <div
            ref={cardRef}
            className="bg-neutral rounded-lg text-secondary w-[300px] h-[430px] flex flex-col items-center justify-center gap-6 p-6"
          >
            {isPopUpDeleteAccount ===
            popUpDeleteAccountState.confirmDeletion ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full flex justify-center items-center border border-neutral bg-red-400 mb-3">
                    <Image
                      src={"/warning.svg"}
                      alt={"/warning.svg"}
                      width={35}
                      height={35}
                      className="select-none min-w-[35px] min-h-[35px] max-sm:min-w-[35px] max-sm:min-h-[35px] max-w-[35px] max-h-[35px] max-sm:max-w-[35px] max-sm:max-h-[35px]"
                    />
                  </div>
                  <p className=" w-max font-bold text-center font-SpaceGrotesk text-2xl">
                    Delete Account
                  </p>
                  <p className="text-center font-medium font-SpaceGrotesk text-md">
                    <span className="text-red-500 font-semibold">WARNING</span>{" "}
                    this is permanent and cannot be undone!
                  </p>
                </div>
                <p className="text-center font-semibold font-SpaceGrotesk text-[12px]">
                  All your feedbacks, comments, votes, and saved feedbacks will
                  be permanently deleted.
                </p>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="delete-confirmation"
                    className="block font-medium text-sm font-SpaceGrotesk"
                  >
                    Type <span className="font-bold">&quot;DELETE&quot;</span>{" "}
                    to confirm:
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    id="delete-confirmation"
                    className="p-2 w-full border border-secondary outline-primary bg-neutral rounded-md mt-2"
                    placeholder='Type "DELETE"'
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                  />
                </div>
                <div className="flex justify-between w-full gap-3 font-SpaceGrotesk">
                  <button
                    onClick={() =>
                      setIsPopUpDeleteAccount(popUpDeleteAccountState.none)
                    }
                    className="flex justify-center h-[40px] items-center w-[49.5%] text-sm p-1 rounded-md border border-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex justify-center h-[40px] items-center w-[49.5%] text-sm p-1 rounded-md text-neutral bg-red-500 border border-transparent"
                  >
                    Delete Account
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-full flex justify-center items-center border-3 border-secondary">
                <Image
                  src={"/_.jpeg"}
                  alt={"/_.jpeg"}
                  width={150}
                  height={150}
                  className="select-none rounded-full min-w-[150px] min-h-[150px] max-sm:min-w-[150px] max-sm:min-h-[150px] max-w-[150px] max-h-[150px] max-sm:max-w-[150px] max-sm:max-h-[150px]"
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="border border-neutral p-3 flex items-center rounded-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full flex justify-center items-center w-[40px] h-[40px] border border-neutral">
            <Image
              src={"/trash.svg"}
              alt={"/trash.svg"}
              width={20}
              height={20}
              className="select-none min-w-[20px] min-h-[20px] max-sm:min-w-[20px] max-sm:min-h-[20px] max-w-[20px] max-h-[20px] max-sm:max-w-[20px] max-sm:max-h-[20px]"
            />
          </div>
          <p className="font-semibold max-sm:text-sm">
            Permanently delete your account
          </p>
        </div>
        <button
          onClick={() =>
            setIsPopUpDeleteAccount(popUpDeleteAccountState.confirmDeletion)
          }
          className={`w-20 select-none p-2 bg-red-500 hover:bg-neutral hover:text-red-500 rounded-md text-[12px] font-semibold ml-auto`}
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default Settings;
