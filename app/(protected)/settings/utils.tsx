import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Image from "next/image";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { formDataType, userAccountInterface } from "./page";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Account {
  provider: string;
  icon: string;
}

export const allPossibleAccounts: Account[] = [
  {
    provider: "github",
    icon: "/brand-github-black.svg",
  },
  {
    provider: "fortyTwo",
    icon: "/42-logo-black.svg",
  },
  {
    provider: "discord",
    icon: "/discord-dark.svg",
  },
];

export enum UnSavedChangesPopUpState {
  OPENING,
  CLOSING,
  CLOSED, // only for the first render
}

export const HeaderSection = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[5px] h-[5px] rounded-full bg-neutral"></div>
      <p className="text-3xl font-SpaceGrotesk font-bold ">{headerText}</p>
    </div>
  );
};

export const UnSavedChangesPopUp = ({
  originalDetails,
  setUpdatedDetails,
  setIsDetailsChanged,
}: {
  originalDetails: formDataType;
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  setIsDetailsChanged: (value: UnSavedChangesPopUpState) => void;
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
            setIsDetailsChanged(UnSavedChangesPopUpState.CLOSING);
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

export const SwitchCard = ({
  setUpdatedDetails,
  updatedDetails,
  text,
  name,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  text: string;
  name: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-Inter text-lg max-sm:text-sm font-semibold">{text}</p>
      {/* <IOSSwitch checked={checked} onChange={handleChange}></IOSSwitch> */}
      <IOSSwitch
        setUpdatedDetails={setUpdatedDetails}
        updatedDetails={updatedDetails}
        name={name}
      ></IOSSwitch>
    </div>
  );
};

interface IOSSwitchProps extends SwitchProps {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  name: string;
}

const IOSSwitch = styled(
  ({ setUpdatedDetails, updatedDetails, name, ...props }: IOSSwitchProps) => {
    const isChecked = Boolean(updatedDetails[name]);

    return (
      <>
        <input
          type="hidden"
          name={name}
          value={updatedDetails[name] ? "true" : "false"}
        />

        <Switch
          checked={isChecked}
          onChange={() => {
            setUpdatedDetails((prev: formDataType) => {
              return { ...prev, [name]: !prev[name] };
            });
          }}
          focusVisibleClassName=".Mui-focusVisible"
          disableRipple
          {...props}
        />
      </>
    );
  },
)(({ theme }) => ({
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

export const SelectCard = ({
  setUpdatedDetails,
  updatedDetails,
  userAccounts,
  text,
  name,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  userAccounts: userAccountInterface[];
  text: string;
  name: string;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-Inter text-lg max-sm:text-sm font-semibold">{text}</p>
      <ControlledOpenSelect
        setUpdatedDetails={setUpdatedDetails}
        updatedDetails={updatedDetails}
        userAccounts={userAccounts}
        name={name}
      ></ControlledOpenSelect>
    </div>
  );
};

function ControlledOpenSelect({
  setUpdatedDetails,
  updatedDetails,
  userAccounts,
  name,
}: {
  setUpdatedDetails: React.Dispatch<React.SetStateAction<formDataType>>;
  updatedDetails: formDataType;
  userAccounts: userAccountInterface[];
  name: string;
}) {
  const [account, setAccount] = useState(updatedDetails[name] as string);

  useEffect(() => {
    setAccount(updatedDetails[name] as string);
  }, [updatedDetails]);

  const handleChange = (event: SelectChangeEvent) => {
    setAccount(event.target.value);

    setUpdatedDetails((prev: formDataType) => {
      return {
        ...prev,
        [name]: event.target.value,
      };
    });
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
          name={name}
          //   labelId="demo-select-small-label"
          id="demo-select-small"
          value={account}
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
            value={"none"}
          >
            <em>None</em>
          </MenuItem>
          {userAccounts.map((account, index) => {
            const selectedIcon =
              allPossibleAccounts.find(
                (possibleAccount) =>
                  possibleAccount.provider === account.provider,
              )?.icon || "";
            return (
              <MenuItem
                key={index}
                sx={{
                  backgroundColor: "#fff5e0",
                  color: "#141e46",
                }}
                value={account.provider}
              >
                <div className="flex items-center gap-1">
                  <Image
                    src={selectedIcon}
                    alt={selectedIcon}
                    width={15}
                    height={15}
                    className="select-none min-w-[15px] min-h-[15px] max-sm:min-w-[15px] max-sm:min-h-[15px] max-w-[15px] max-h-[15px] max-sm:max-w-[15px] max-sm:max-h-[15px]"
                  />
                  •
                  <p className="font-[500]">
                    {account.provider.charAt(0).toUpperCase() +
                      account.provider.slice(1)}
                  </p>
                </div>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

export interface linkedAccountInterface {
  provider: string;
  username?: string;
  isLinked: boolean;
  icon: string;
}

export const accountsArr = [
  {
    provider: "github",
    username: "",
    isLinked: false,
    icon: "/brand-github.svg",
  },
  {
    provider: "discord",
    username: "",
    isLinked: false,
    icon: "/discord.svg",
  },
  {
    provider: "linkedIn",
    username: "",
    isLinked: false,
    icon: "/LInkedInIconLight.svg",
  },
];

export const AccountCard = ({
  account,
  setAccounts,
}: {
  account: linkedAccountInterface;
  setAccounts: React.Dispatch<React.SetStateAction<linkedAccountInterface[]>>;
}) => {
  const handleRemoveLinkedAccount = async () => {
    const res = await fetch(`/api/auth/disconnect/${account.provider}`, {
      method: "POST",
    });
    if (res.ok) {
      console.log("res.status", res.status);
      setAccounts((prev: linkedAccountInterface[]) =>
        prev.map((item) =>
          item.provider === account.provider
            ? {
                ...item,
                icon:
                  accountsArr.find((acc) => acc.provider === item.provider)
                    ?.icon || "",
                isLinked: false,
              }
            : item,
        ),
      );
    } else console.log("error ocurred with disconnect a linked account");
  };
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full border border-neutral">
        <Image
          src={account.icon}
          alt={account.icon}
          width={40}
          height={40}
          className={`select-none min-w-[40px] ${account.isLinked ? "rounded-full" : "p-2"} min-h-[40px] max-sm:min-w-[40px] max-sm:min-h-[40px] max-w-[40px] max-h-[40px] max-sm:max-w-[40px] max-sm:max-h-[40px]`}
        />
      </div>
      {account.isLinked ? (
        <div>
          <p className="font-semibold">{account.username}</p>
          <p className="font-semibold text-[10px]">
            {account.provider.charAt(0).toUpperCase() +
              account.provider.slice(1)}
          </p>
        </div>
      ) : (
        <p className="font-semibold">
          {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
        </p>
      )}
      {account.isLinked ? (
        <button
          className={` w-20 p-2 border border-neutral rounded-md text-[12px] font-semibold ml-auto`}
          onClick={handleRemoveLinkedAccount}
        >
          remove
        </button>
      ) : (
        <a
          className="bg-primary w-20 p-2 rounded-md text-[12px] font-semibold ml-auto text-center"
          href={`/api/auth/connect/${account.provider}`}
        >
          connect
        </a>
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
