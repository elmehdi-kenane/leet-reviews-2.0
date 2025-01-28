"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  bio: z.string(),
  avatar: z.string(),
  hideFeedbacks: z.boolean(),
  hideCommentsAndVotes: z.boolean(),
  accountDisplayedWithFeedbacks: z.string(),
});

const Settings = () => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataValues = Object.fromEntries(formData);
    const result = formSchema.safeParse(formDataValues);
    if (result.success) {
      console.log("result.data", result.data);
      //   console.log(result.data.email);
      //   console.log(result.data.quantity);
    } else {
      // Do what you want with result.errors
    }
  };
  return (
    <div className="text-neutral max-lg:w-[90%] w-full h-full flex flex-col max-w-[850px] mx-auto max-lg:mb-24 gap-12 md:mt-8">
      <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-12">
        <Profile></Profile>
        <Visibility></Visibility>
      </form>
      <AccountConnections></AccountConnections>
      <AccountDeletion></AccountDeletion>
    </div>
  );
};

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-[5px] h-[5px] rounded-full bg-neutral"></div>
        <p className="text-3xl font-SpaceGrotesk font-bold ">Profile</p>
      </div>
      <div className="flex max-sm:flex-col gap-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          <input
            className="p-2 bg-transparent h-[50px] font-SpaceGrotesk rounded-xl border border-neutral"
            type="text"
            placeholder="name"
            name="name"
          />
          <input
            className="p-2 bg-transparent h-[50px] font-SpaceGrotesk rounded-xl border border-neutral"
            type="text"
            placeholder="email"
            name="email"
          />
          <textarea
            className="p-2 bg-transparent font-SpaceGrotesk flex-1 rounded-xl border border-neutral"
            maxLength={80}
            placeholder="bio"
            name="bio"
          />
        </div>
        <div className="w-[150px] flex sm:flex-col max-sm:w-full gap-3 items-center border border-neutral p-3 rounded-xl">
          <Image
            src={userInfo?.avatar || "/default.jpeg"}
            alt={userInfo?.avatar || "/default.jpeg"}
            width={110}
            height={110}
            className="rounded-full select-none min-w-[110px] min-h-[110px] max-sm:min-w-[70px] max-sm:min-h-[70px] max-w-[110px] max-h-[110px] max-sm:max-w-[70px] max-sm:max-h-[70px] border-2 border-neutral"
          />
          <button className="bg-neutral relative hover:bg-primary rounded-md p-2 text-secondary font-SpaceGrotesk max-sm:ml-auto max-sm:flex-1 sm:w-full">
            <input
              type="file"
              name="avatar"
              className="opacity-0 absolute h-full bg-[red] top-0 left-0"
              onClick={() => console.log("input file clicked")}
            />
            <p className="">upload</p>
          </button>
        </div>
      </div>
      {/* <div className="flex justify-center gap-2">
        <button className="bg-transparent border-2 border-neutral rounded-md p-2 w-36 text-neutral font-SpaceGrotesk">
          reset
        </button>
        <button className="bg-gray rounded-md p-2 w-36 text-secondary font-SpaceGrotesk">
          save
        </button>
      </div> */}
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
      <div className="flex items-center gap-3">
        <div className="w-[5px] h-[5px] rounded-full bg-neutral"></div>
        <p className="text-3xl font-SpaceGrotesk font-bold ">Visibility</p>
      </div>
      <div className="border border-neutral p-3 flex flex-col rounded-xl">
        <SwitchCard text={"Hide Feedbacks"}></SwitchCard>
        <div className="h-[1px] w-[100%] my-4 mx-auto bg-neutral"></div>
        <SwitchCard text={"Hide Comments and Votes"}></SwitchCard>
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
      <div className="flex items-center gap-3">
        <div className="w-[5px] h-[5px] rounded-full bg-neutral"></div>
        <p className="text-3xl font-SpaceGrotesk font-bold ">Linked Accounts</p>
      </div>
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
      <div className="flex items-center gap-3">
        <div className="w-[5px] h-[5px] bg-neutral"></div>
        <p className="text-3xl font-SpaceGrotesk font-bold ">Danger Zone</p>
      </div>
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
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
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
