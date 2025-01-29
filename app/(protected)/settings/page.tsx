"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type formDataType = {
  name: string;
  email: string;
  bio: string;
  avatar: string | File;
  //   hideFeedbacks: boolean;
  //   hideCommentsAndVotes: boolean;
  //   accountDisplayedWithFeedbacks: string;
  [key: string]: string | File | undefined; // Index signature
};

const UnSavedChangesPopUp = ({
  originalDetails,
  setUpdatedDetails,
  setIsDetailsChanged,
}: {
  originalDetails: formDataType;
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  setIsDetailsChanged: (value: boolean) => void;
}) => {
  return (
    <div
      className={`bg-neutral p-4 z-[300] rounded-xl font-semibold font-SpaceGrotesk text-secondary absolute flex flex-col mx-auto top-[5px] left-0 right-0 w-max`}
    >
      You have unsaved changes
      <div className="flex w-full gap-2 justify-center mt-3">
        <button
          className="w-[45%] border-2 border-secondary rounded-lg p-1"
          type="button"
          onClick={() => {
            setUpdatedDetails(originalDetails);
            setIsDetailsChanged(false);
          }}
        >
          reset
        </button>
        <button
          className="w-[45%] border-2 border-primary bg-primary rounded-lg p-1 text-neutral"
          type="submit"
        >
          save
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const defaultDetails: formDataType = {
    name: "",
    email: "",
    bio: "",
    avatar: "",
  };
  const [originalDetails, setOriginalDetails] =
    useState<formDataType>(defaultDetails);
  const [updatedDetails, setUpdatedDetails] =
    useState<formDataType>(defaultDetails);
  const [isDetailsChanged, setIsDetailsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (JSON.stringify(updatedDetails) !== JSON.stringify(originalDetails)) {
      setIsDetailsChanged(true);
    } else setIsDetailsChanged(false);
  }, [updatedDetails]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDetailsChanged(false);
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
      formData.append("avatar", updatedDetails.avatar);
    }
    // set unchanged details to undefined will be used in the backend
    Object.keys(formDataValues).forEach((key) => {
      if (formDataValues[key] === originalDetails[key]) {
        formData.delete(key); // Remove unchanged fields from FormData
      }
    });
    console.log("onSubmit formDataValues", Object.fromEntries(formData));
    const res = await fetch("/api/user/update", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("data", data);
  };
  return (
    <div className="text-neutral max-lg:w-[90%] w-full h-full flex flex-col max-w-[850px] mx-auto max-lg:mb-24 gap-12 md:mt-8">
      {!isLoading ? (
        <>
          <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-12">
            <Profile
              originalDetails={originalDetails}
              updatedDetails={updatedDetails}
              setUpdatedDetails={setUpdatedDetails}
            ></Profile>
            <div
              className={`w-full absolute top-0 right-0 left-0 flex ${isDetailsChanged ? "display-unsaved-changes-pop-up" : "un-display-unsaved-changes-pop-up"}`}
            >
              <UnSavedChangesPopUp
                originalDetails={originalDetails}
                setUpdatedDetails={setUpdatedDetails}
                setIsDetailsChanged={setIsDetailsChanged}
              ></UnSavedChangesPopUp>
            </div>
          </form>
          <Visibility></Visibility>
          <AccountConnections></AccountConnections>
          <AccountDeletion></AccountDeletion>
        </>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

const HeaderSection = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[5px] h-[5px] rounded-full bg-neutral"></div>
      <p className="text-3xl font-SpaceGrotesk font-bold ">{headerText}</p>
    </div>
  );
};

const Profile = ({
  setUpdatedDetails,
  updatedDetails,
  originalDetails,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
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

  return (
    <div className="flex flex-col gap-5">
      <HeaderSection headerText="Profile"></HeaderSection>
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
            className="bg-neutral hover:bg-primary rounded-md p-2 text-secondary font-SpaceGrotesk max-sm:ml-auto max-sm:flex-1 sm:w-full"
            onClick={() => console.log("file input button clicked")}
          >
            <input
              type="file"
              name="avatar"
              accept="image/png, image/jpeg"
              className="opacity-0 absolute h-full bg-[red] top-0 left-0"
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

const SelectCard = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-Inter text-lg max-sm:text-sm font-semibold">{text}</p>
      {/* <IOSSwitch checked={checked} onChange={handleChange}></IOSSwitch> */}
      <ControlledOpenSelect></ControlledOpenSelect>
    </div>
  );
};

const SwitchCard = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-Inter text-lg max-sm:text-sm font-semibold">{text}</p>
      {/* <IOSSwitch checked={checked} onChange={handleChange}></IOSSwitch> */}
      <IOSSwitch></IOSSwitch>
    </div>
  );
};

function ControlledOpenSelect() {
  const [age, setAge] = useState("github");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div className="h-[28px] ControlledOpenSelect">
      <FormControl
        sx={{
          m: 0,
          minWidth: 120,
          maxHeight: 20,
          padding: 0,
          //   border: "1px solid red",
        }}
        size="small"
      >
        <Select
          //   labelId="demo-select-small-label"
          id="demo-select-small"
          value={age}
          onChange={handleChange}
          sx={{
            m: 0,
            minWidth: 120,
            maxHeight: 28,
            padding: 0,
            backgroundColor: "#fff5e0",
            color: "#141e46",
          }}
        >
          <MenuItem
            sx={{
              backgroundColor: "#fff5e0",
              color: "#141e46",
            }}
            value={0}
          >
            <em>None</em>
          </MenuItem>
          <MenuItem
            sx={{
              backgroundColor: "#fff5e0",
              color: "#141e46",
            }}
            value={"github"}
          >
            <div className="flex items-center">
              <Image
                src={"/brand-github.svg"}
                alt={"/brand-github.svg"}
                width={20}
                height={20}
                className="bg-[red] select-none min-w-[20px] min-h-[20px] max-sm:min-w-[20px] max-sm:min-h-[20px] max-w-[20px] max-h-[20px] max-sm:max-w-[20px] max-sm:max-h-[20px] border border-neutral"
              />
              <p className="font-[600]">Github</p>
            </div>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const Visibility = () => {
  return (
    <div className="flex flex-col gap-5">
      <HeaderSection headerText="Visibility"></HeaderSection>
      <div className="border border-neutral p-3 flex flex-col rounded-xl">
        <SwitchCard text={"Hide Feedbacks From Profile"}></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SwitchCard text={"Hide Comments and Votes From Profile"}></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SelectCard
          text={"The account appears with your feedbacks"}
        ></SelectCard>
      </div>
    </div>
  );
};

const Account = ({ isLinked }: { isLinked: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={"/brand-github.svg"}
        alt={"/brand-github.svg"}
        width={40}
        height={40}
        className="rounded-full select-none min-w-[40px] p-2 min-h-[40px] max-sm:min-w-[40px] max-sm:min-h-[40px] max-w-[40px] max-h-[40px] max-sm:max-w-[40px] max-sm:max-h-[40px] border border-neutral"
      />
      <p className="font-semibold">Github</p>
      <button
        className={`${isLinked === true ? "border border-neutral" : "bg-primary"} w-20 p-2 rounded-md text-[12px] font-semibold ml-auto`}
      >
        {isLinked === true ? "remove" : "connect"}
      </button>
    </div>
  );
};

const AccountConnections = () => {
  return (
    <div className="flex flex-col gap-5">
      <HeaderSection headerText="Linked Accounts"></HeaderSection>
      <div className="border border-neutral p-3 flex flex-col rounded-xl">
        <Account isLinked={true}></Account>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <Account isLinked={false}></Account>
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

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    name=""
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#41b06e",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

export default Settings;
