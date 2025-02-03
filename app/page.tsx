"use client";

import Image from "next/image";
import expandedLogo from "@/public/expanded-logo.svg";
import Underline from "@/public/Underline_03.svg";
import tanger_med_logo from "@/public/tanger_med_logo.png";
import linkedInIcon from "@/public/LInkedInIcon.svg";
import CompanyCityIcon from "@/public/CompanyCityIcon.svg";
import ContractTypeIcon from "@/public/ContractTypeIcon.svg";
import WorkLocationIcon from "@/public/WorkLocationIcon.svg";
import ProgressCheckIcon from "@/public/ProgressCheckIcon.svg";
import authorAvatar from "@/public/Group 26.png";
import reactions from "@/public/reactions.svg";
import logo1 from "@/public/logo1.svg";
import lrLogo from "@/public/lr-logo.svg";
import logo2 from "@/public/logo2.svg";
import hashtag from "@/public/hashtag.svg";
import votes from "@/public/1.svg";
import trustScore from "@/public/2.svg";
import anonymous from "@/public/3.svg";

export default function landingPage() {
  return (
    <div className="w-full h-full bg-[url('/Noise&Texture.svg')] bg-cover bg-center bg-no-repeat bg-secondary p-14 overflow-auto">
      <div className="flex flex-col w-full box-border">
        <Navbar></Navbar>
        <Header></Header>
        <HowItWorksSection></HowItWorksSection>
        <WhySection></WhySection>
        {/* <div
          id="Why"
          className="bg-white h-52 w-full flex justify-center items-center text-secondary"
        >
          Why
        </div>
        <div
          id="Community"
          className="bg-white h-52 w-full flex justify-center items-center text-secondary"
        >
          Community
        </div> */}
      </div>
    </div>
  );
}

const WhySection = () => {
  //   const features = [
  //     {
  //       header: "Anonymous",
  //       description: "Give honest feedback—no names attached.",
  //       icon: anonymous,
  //     },
  //     {
  //       header: "Trust Score",
  //       description: "See credibility at a glance with our rating system.",
  //       icon: trustScore,
  //     },
  //     {
  //       header: "Votes",
  //       description: "Upvote or downvote to highlight the best ones.",
  //       icon: votes,
  //     },
  //   ];
  return (
    <div
      id="why"
      className="w-full mt-[80px] max-w-[730px] mx-auto flex flex-col items-center text-secondary"
    >
      <SectionHeader headerText="Why"></SectionHeader>
      <p className="font-SpaceGrotesk text-neutral text-center text-[12px]">
        Leet Reviews is a community-driven app designed to help employees choose
        their next job by providing insights into company cultures and
        spotlighting potential red flags to avoid toxic environments.
      </p>
    </div>
  );
};

const HowItWorksSection = () => {
  const features = [
    {
      header: "Anonymous",
      description: "Give honest feedback—no names attached.",
      icon: anonymous,
    },
    {
      header: "Trust Score",
      description: "See credibility at a glance with our rating system.",
      icon: trustScore,
    },
    {
      header: "Votes",
      description: "Upvote or downvote to highlight the best ones.",
      icon: votes,
    },
  ];
  return (
    <div
      id="how-it-works"
      className="w-full mt-[150px] flex flex-col items-center text-secondary"
    >
      <SectionHeader headerText="How It Works?"></SectionHeader>
      <div className="flex w-full max-w-[730px] justify-between">
        {features.map((feature) => {
          return (
            <div
              key={feature.header}
              className="bg-neutral max-w-[318px] w-[30%] p-3 rounded-xl flex flex-col gap-1"
            >
              <div className="w-full flex bg-secondary gap-2 text-neutral font-SpaceGrotesk p-2 rounded-md drop-shadow-xl">
                <Image
                  className="min-w-[9px] w-[20px] select-none"
                  src={feature.icon}
                  height={20}
                  width={20}
                  alt={feature.icon}
                ></Image>
                <p>{feature.header}</p>
              </div>
              <p className="font-normal italic font-SpaceGrotesk text-[12px]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-neutral font-SpaceGrotesk my-2">And more...</p>
      <button className="bg-secondary p-3 border-2 transition-transform duration-500 transform hover:scale-[1.05] border-neutral rounded-xl text-neutral font-SpaceGrotesk">
        Explore All Features
      </button>
    </div>
  );
};

const SectionHeader = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex gap-3 mb-8">
      <Image
        className="min-w-[9px] w-[20px] select-none"
        src={hashtag}
        height={20}
        width={20}
        alt={hashtag}
      ></Image>
      <div className="text-[25px] flex gap-2 text-neutral font-SpaceGrotesk">
        {headerText}
        {headerText === "Why" && (
          <div className="flex gap-2">
            <Image
              src={lrLogo}
              alt={lrLogo}
              width={130}
              height={130}
              className="max-w-[130px] select-none max-h-[130px]"
            />
            ?
          </div>
        )}
      </div>
    </div>
  );
};

const ExamplePreviewFeedbackCard = ({
  rotation,
  index,
}: {
  rotation: number;
  index: number;
}) => {
  const circleRadius = 10;
  return (
    <div
      className={`w-[300px] select-none flex flex-col gap-3 items-start ${index === 1 ? "left-[150px] z-[11]" : index === 3 ? "right-[150px] z-[12]" : "z-[13]"} justify-between relative mt-20 h-[250px] border-[3px] border-secondary bg-neutral rounded-3xl p-3`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex justify-start items-end rounded-full select-none">
          <Image
            src={tanger_med_logo}
            alt={`${tanger_med_logo}`}
            width={60}
            height={60}
            className="rounded-full bg-secondary min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]"
          />
          <div
            className={`w-[${circleRadius * 2}] h-[${
              circleRadius * 2
            }]  ml-[-20px] -mb-2`}
          >
            <Image
              src={"/Good.svg"}
              alt={"/Good.svg"}
              width={15}
              height={15}
              className="ml-[2.5px] mb-[-18px] relative z-[9]"
            />
            <svg
              width={circleRadius * 2}
              height={circleRadius * 2}
              xmlns="http://www.w3.org/2000/svg"
              // className="border border-[blue]"
            >
              <circle
                r={circleRadius}
                cx={circleRadius}
                cy={circleRadius}
                fill="#FFF5E0"
              />
            </svg>
          </div>
          <div className="flex-1 font-SpaceGrotesk ml-2 my-auto">
            <div className="flex h-max items-start gap-1 text-secondary">
              <p className="text-[10px] font-semibold">Tanger Med</p>
              <div className="w-[20px]">
                <Image
                  src={linkedInIcon}
                  alt={`${linkedInIcon}`}
                  width={17}
                  height={17}
                  className="min-w-[17px] min-h-[17px] max-w-[17px] max-h-[17px]"
                />
              </div>
            </div>
            <p className="text-[10px] font-normal text-secondary">
              Software Engineer
            </p>
          </div>
        </div>
        <div className="w-[76px] h-[76px] flex justify-between flex-wrap gap-[6px] border-2 border-secondary rounded-3xl p-[8px]">
          <div className="flex justify-center items-center p-3 bg-secondary w-[25px] h-[25px] rounded-full">
            <Image
              src={CompanyCityIcon}
              alt={CompanyCityIcon}
              width={15}
              height={15}
              className="max-w-[15px] max-h-[15px]"
            />
          </div>
          <div className="flex justify-center items-center p-3 bg-secondary w-[25px] h-[25px] rounded-full">
            <Image
              src={ContractTypeIcon}
              alt={ContractTypeIcon}
              width={15}
              height={15}
              className="max-w-[15px] max-h-[15px]"
            />
          </div>
          <div className="flex justify-center items-center p-3 bg-secondary w-[25px] h-[25px] rounded-full">
            <Image
              src={WorkLocationIcon}
              alt={WorkLocationIcon}
              width={15}
              height={15}
              className="max-w-[15px] max-h-[15px]"
            />
          </div>
          <div className="flex justify-center items-center p-3 bg-secondary w-[25px] h-[25px] rounded-full">
            <Image
              src={ProgressCheckIcon}
              alt={ProgressCheckIcon}
              width={15}
              height={15}
              className="max-w-[15px] max-h-[15px]"
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <Image
          src={authorAvatar}
          alt={`${authorAvatar}`}
          width={25}
          height={25}
          className="max-w-[25px] max-h-[25px]"
        />
        <div className="ml-auto w-[95%] h-15 border-2 border-secondary rounded-xl mt-[-10px] text-sm p-2">
          <p className="blur-sm text-secondary">
            comment comment comment xdd xdd comment comment comment xdd xdd
          </p>
        </div>
      </div>
      <div className="w-full">
        <Image
          src={reactions}
          alt={reactions}
          width={50}
          height={50}
          className="max-w-[50px] max-h-[50px] ml-auto"
        />
      </div>
      <div className="w-[101%] absolute h-[70%] bg-gradient-to-b from-neutral/15 to-secondary/90 left-[-1px] bottom-[-1px] rounded-b-[22px]"></div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="w-full flex flex-col items-center mt-24 gap-5 text-neutral">
      <p className="font-SpaceGrotesk text-[40px] font-normal flex gap-2 mb-10">
        The Truth About Tech Jobs,
        <span className="font-black flex flex-col items-center">
          Unlocked.
          <Image
            className="min-w-[9px] w-[150px] select-none h-max"
            src={Underline}
            height={30}
            width={150}
            alt={Underline}
          ></Image>
        </span>
      </p>
      <div className="relative flex justify-center flex-col items-center">
        <div className="min-w-[400px] absolute min-h-[200px] top-0 z-10 bg-primary rounded-t-full blur-md"></div>
        <div className="flex">
          <ExamplePreviewFeedbackCard
            rotation={-12}
            index={1}
          ></ExamplePreviewFeedbackCard>
          <ExamplePreviewFeedbackCard
            rotation={5}
            index={2}
          ></ExamplePreviewFeedbackCard>
          <ExamplePreviewFeedbackCard
            rotation={15}
            index={3}
          ></ExamplePreviewFeedbackCard>
        </div>
        <button className="bg-primary p-3 border-2 absolute z-[14] bottom-[-40px] transition-transform duration-500 transform hover:scale-[1.05] border-neutral rounded-xl text-neutral font-SpaceGrotesk">
          Browse Feedbacks
        </button>
        <Image
          src={logo1}
          alt={logo1}
          width={80}
          height={80}
          className="max-w-[80px] select-none max-h-[80px] mr-auto absolute left-0 bottom-0"
        />
        <Image
          src={logo2}
          alt={logo2}
          width={80}
          height={80}
          className="max-w-[80px] select-none max-h-[80px] ml-auto absolute right-0 bottom-[-100px]"
        />
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="max-w-full w-[100%] flex items-center justify-between p-14 pb-0 fixed top-0 left-0 right-0 font-SpaceGrotesk text-neutral">
      <Image
        className="min-w-[9px] w-[150px] select-none"
        src={expandedLogo}
        height={150}
        width={150}
        alt={expandedLogo}
      ></Image>
      <div className="flex gap-7 items-center">
        <a href="#how-it-works">How It Works?</a>
        <div className="w-1 h-1 rounded-full bg-neutral"></div>
        <a href="#Why">Why?</a>
        <div className="w-1 h-1 rounded-full bg-neutral"></div>
        <a href="#Community">Community</a>
      </div>
      <button className="p-2 border border-neutral rounded-md">
        Get Started
      </button>
    </div>
  );
};
