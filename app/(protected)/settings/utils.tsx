import { styled } from "@mui/material/styles";
import { useState } from "react";
import Image from "next/image";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { UnSavedChangesPopUpState } from "./page";
import { formDataType } from "./page";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
  ({ setUpdatedDetails, updatedDetails, ...props }: IOSSwitchProps) => (
    <Switch
      checked={updatedDetails[props.name] as boolean}
      onChange={() => {
        setUpdatedDetails((prev: formDataType) => {
          return { ...prev, [props.name]: !prev[props.name] };
        });
      }}
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ),
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

export const SelectCard = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="font-Inter text-lg max-sm:text-sm font-semibold">{text}</p>
      <ControlledOpenSelect></ControlledOpenSelect>
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

export const AccountCard = ({ isLinked }: { isLinked: boolean }) => {
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
