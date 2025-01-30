"use client";

import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  SwitchCard,
  UnSavedChangesPopUp,
  HeaderSection,
  SelectCard,
  AccountCard,
} from "@/app/(protected)/settings/utils";
import { UserContext, User } from "@/context/UserContext";

export type formDataType = {
  name: string;
  email: string;
  bio: string;
  avatar: string | File;
  hideFeedbacks: boolean;
  hideCommentsAndVotes: boolean;
  accountDisplayedWithFeedbacks: string;
  [key: string]: boolean | string | File | undefined;
};

export enum UnSavedChangesPopUpState {
  OPENING,
  CLOSING,
  CLOSED, // only for the first render
}

export interface userAccountInterface {
  provider: string;
  account_type: string;
  username: string;
  avatar: string;
}

export const allPossibleAccounts = [
  {
    provider: "github",
    icon: "/brand-github-black.svg",
  },
  {
    provider: "fortyTwo",
    icon: "/42-logo-black.svg",
  },
];

const Settings = () => {
  const defaultDetails: formDataType = {
    name: "",
    email: "",
    bio: "",
    avatar: "",
    hideFeedbacks: false,
    hideCommentsAndVotes: false,
    accountDisplayedWithFeedbacks: "",
  };

  const defaultUserAccounts: userAccountInterface[] = [
    {
      provider: "",
      account_type: "",
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
    const fetchUser = async () => {
      const response = await fetch("/api/user/settings");
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user:", errorData.error);
        if (response.status === 401) {
          console.log("Unauthorized access. Please log in.");
          router.push("/auth/sign-in");
        } else {
          console.log("An unexpected error occurred.");
          router.push("/auth/sign-in");
        }
        return;
      }
      const data = await response.json();
      console.log("data settings", data);

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
      style: { background: "#fff5e0", color: "#141e46" },
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
        console.log("delete", key, "from the form");
        formData.delete(key); // Remove unchanged fields from FormData
      } else
        console.log(
          "keep",
          key,
          "in the form",
          formDataValues[key],
          originalDetails[key],
        );
    });
    console.log("onSubmit formDataValues", Object.fromEntries(formData));
    const res = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      console.log("data", data);
      toast.dismiss();
      toast.success("informations updated successfully 👍", {
        style: { background: "#fff5e0", color: "#141e46" },
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
          <AccountConnections></AccountConnections>
          <AccountDeletion></AccountDeletion>
        </>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export const SignedAsCard = ({
  authAccount,
  top,
  //   left,
}: {
  authAccount: userAccountInterface | undefined;
  top: number;
  //   left: number;
}) => {
  const selectedIcon =
    allPossibleAccounts.find(
      (possibleAccount) => possibleAccount.provider === authAccount?.provider,
    )?.icon || "";
  return (
    <div
      className={`absolute right-[0px] top-[${top}px] bg-neutral flex gap-1 p-[6px] rounded-lg font-SpaceGrotesk font-medium items-center text-secondary`}
    >
      <p className="italic text-[12px] max-sm:hidden">Signed</p>
      <p className="italic text-[12px] max-sm:hidden">As</p>
      <div className="border-2 border-primary rounded-full">
        <Image
          src={authAccount?.avatar || ""}
          alt={authAccount?.avatar || ""}
          width={20}
          height={20}
          className="select-none min-w-[20px] min-h-[20px] max-sm:min-w-[20px] max-sm:min-h-[20px] max-w-[20px] max-h-[20px] rounded-full max-sm:max-w-[20px] max-sm:max-h-[20px]"
        />
      </div>
      <p className="italic font-bold text-[12px]">{authAccount?.username}</p>•
      <div className="border-2 border-secondary rounded-full p-2 w-[24px] h-[24px] flex justify-center items-center">
        <Image
          src={selectedIcon}
          alt={selectedIcon}
          width={15}
          height={15}
          className="select-none min-w-[15px] min-h-[15px] max-sm:min-w-[15px] max-sm:min-h-[15px] max-w-[15px] max-h-[15px] max-sm:max-w-[15px] max-sm:max-h-[15px]"
        />
      </div>
    </div>
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
      console.log("originalDetails.avatar", originalDetails.avatar);
      return originalDetails.avatar as string;
    }
    if (typeof avatar === "string") return avatar;
    else return URL.createObjectURL(avatar);
  };

  const authAccount = userAccounts.find(
    (account) => account.account_type === "AUTH",
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
            className="bg-neutral hover:bg-primary rounded-md p-2 text-secondary font-SpaceGrotesk max-sm:ml-auto max-sm:flex-1 sm:w-full relative"
            onClick={() => console.log("file input button clicked")}
          >
            <input
              type="file"
              name="avatar"
              accept="image/png, image/jpeg"
              className="opacity-0 absolute h-full bg-[red] w-full top-0 left-0"
              onClick={() => console.log("file input clicked")}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  console.log("files[0]", files[0]);
                  console.log("uploading...");

                  setUpdatedDetails((prev) => ({
                    ...prev!,
                    avatar: files[0],
                  }));
                }
                e.target.value = "";
                console.log("nothing");
                // Reset input value so selecting the same file triggers onChange again
              }}
            />
            <p className="">upload</p>
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
          name="hideFeedbacks"
          updatedDetails={updatedDetails}
          setUpdatedDetails={setUpdatedDetails}
          text={"Hide Feedbacks From Profile"}
        ></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SwitchCard
          name="hideCommentsAndVotes"
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

const AccountConnections = () => {
  return (
    <div className="flex flex-col gap-5">
      <HeaderSection headerText="Linked Accounts"></HeaderSection>
      <div className="border border-neutral p-3 flex flex-col rounded-xl">
        <AccountCard isLinked={true}></AccountCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <AccountCard isLinked={false}></AccountCard>
      </div>
    </div>
  );
};

const AccountDeletion = () => {
  return (
    <div className="flex flex-col gap-5 mb-5">
      <HeaderSection headerText="Danger Zone"></HeaderSection>
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
          className={`w-20 p-2 bg-red-400 rounded-md text-[12px] font-semibold ml-auto`}
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default Settings;
