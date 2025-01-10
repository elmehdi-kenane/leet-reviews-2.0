import Link from "next/link";
import Image from "next/image";
import CustomizedTooltip from "./CustomizedTooltip";
import linkedInIcon from "@/public/LInkedInIcon.svg";
import DefaultCompanyLogo from "@/public/DefaultCompanyLogo.svg";
import fun_face from "@/public/fun_face.svg";
import CompanyCityIcon from "@/public/CompanyCityIcon.svg";
import ContractTypeIcon from "@/public/ContractTypeIcon.svg";
import WorkLocationIcon from "@/public/WorkLocationIcon.svg";
import ProgressCheckIcon from "@/public/ProgressCheckIcon.svg";
import { useContext } from "react";
import { useState } from "react";
import { UserContext } from "@/context/UserContext";

export const FeedbackCard = () => {
  const userInfo = useContext(UserContext);
  const feedbackDetails = {
    experienceRating: "experienceRating",
    ExperienceRate: fun_face,
    FeedbackId: "1", // will be used to redirect the user to the feedback page
    CompanyLogo: DefaultCompanyLogo,
    CompanyName: "um6p",
    LinkedInOfCompany: "linkedInUrl",
    JobStatus: "software engineer",
    feedbackSubtitle: "feedback subtitle",
    feedbackAuthorAvatar: userInfo?.userInfo?.avatar, // will be replaced by the actual feedback author avatar
    feedbackAuthorUsername: "feedbackAuthorUsername",
    creationDate: "dateTime",
    feedbackAuthorIntraLogin: "feedbackAuthorIntraLogin",
    employmentDetails: [
      { icon: WorkLocationIcon, text: "Location" },
      { icon: ContractTypeIcon, text: "Contract" },
      { icon: CompanyCityIcon, text: "City" },
      { icon: ProgressCheckIcon, text: "Progress" },
    ],
  };
  const [isHovered, setIsHovered] = useState(false);
  const circleRadius = 15;
  return (
    <div
      //   href={`/home`}
      className={`flex justify-between flex-col p-10 max-md:p-5 max-sm:px-[15px] max-sm:py-[15px] rounded-[16px] bg-white mb-[50px] w-[100%] max-w-[850px] max-md:h-max shadow-lg hover:shadow-2xl font-inter text-[#00224D] gap-[10px] transition-shadow duration-300`}
    >
      <div className="flex justify-between gap-[10px] max-md:flex-col">
        <div className="flex max-sm:flex-col justify-center items-center gap-4 h-max min-h-[110px]">
          <div className="flex justify-start items-end rounded-full">
            <Image
              src={feedbackDetails.CompanyLogo}
              alt={feedbackDetails.CompanyLogo}
              width={125}
              height={125}
              className="rounded-full"
            />
            <CustomizedTooltip
              placement="bottom"
              title={`${feedbackDetails.experienceRating} Experience`}
              arrow
            >
              <div
                className={`w-[${circleRadius * 2}] h-[${
                  circleRadius * 2
                }]  ml-[-30px]`}
              >
                <Image
                  src={feedbackDetails.ExperienceRate}
                  alt={feedbackDetails.ExperienceRate}
                  width={20}
                  height={20}
                  className="ml-[5px] mb-[-25px] relative z-[9]"
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
                    fill="#d1d5db"
                  />
                </svg>
              </div>
            </CustomizedTooltip>
          </div>
          <div className="flex flex-col h-full w-full max-sm:items-center justify-center">
            <div className="font-bold text-2xl max-lg:text-lg flex gap-1 items-center">
              {feedbackDetails.CompanyName}
              {feedbackDetails.LinkedInOfCompany !== "" && (
                <a
                  href={feedbackDetails.LinkedInOfCompany}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Image src={linkedInIcon} alt="" width={25} height={25} />
                </a>
              )}
            </div>
            <p className="font-semibold text-xl max-lg:text-base">
              {feedbackDetails.JobStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center flex-wrap max-md:justify-end max-sm:justify-center w-[310px] lg:w-[310px] max-md:min-w-full gap-[10px] max-sm:w-full max-sm:gap-[5px] h-max font-medium">
          {feedbackDetails.employmentDetails.map((employmentDetail, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-[5px] rounded-[14px] border border-[#00224D] w-[150px] max-lg:w-[48%] max-md:max-w-[140px] max-md:text-xs min-w-max h-[50px] p-[5px] max-lg:text-sm"
              >
                <div className="bg-[#00224D] rounded-full min-w-[35px] min-h-[35px] flex justify-center items-center">
                  <Image
                    src={employmentDetail.icon}
                    alt={employmentDetail.icon}
                    width={`${
                      employmentDetail.icon === ContractTypeIcon ? 17 : 20
                    }`}
                    height={`${
                      employmentDetail.icon === ContractTypeIcon ? 17 : 20
                    }`}
                  />
                </div>
                {employmentDetail.text}
              </div>
            );
          })}
          {feedbackDetails.feedbackAuthorIntraLogin !== "" && (
            <div className="w-full h-max flex justify-end z-[1]">
              <a
                href={`https://profile.intra.42.fr/users/${feedbackDetails.feedbackAuthorIntraLogin}`}
                target="_blank"
                className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  src="/42-logo.svg"
                  alt="42-logo.svg"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          )}
        </div>
      </div>
      {feedbackDetails.feedbackSubtitle !== "" ? (
        <div className="flex justify-between items-start flex-col mt-[-30px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedbackDetails.feedbackAuthorAvatar || ""}
              alt={feedbackDetails.feedbackAuthorAvatar || ""}
              width={40}
              height={40}
              className="rounded-full max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D] mb-1"
            />
            <p className="mb-[15px] font-semibold">
              {feedbackDetails.feedbackAuthorUsername}
            </p>
          </div>
          <div className="border-2 border-[#00224D] p-4 rounded-2xl w-[98%] mt-[-20px] relative self-end max-lg:text-xs max-sm:text-[9px] max-sm:leading-[12px]">
            <p className="overflow-x-auto w-full dark-scrollbar">
              {feedbackDetails.feedbackSubtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex border-2 border-[#00224D] rounded-2xl justify-between items-center p-2 gap-[5px]">
          <div className="flex items-center gap-2">
            <Image
              src={feedbackDetails.feedbackAuthorAvatar || ""}
              alt={feedbackDetails.feedbackAuthorAvatar || ""}
              width={50}
              height={50}
              className="rounded-full max-w-[40px] max-h-[40px] relative z-[9] border-2 border-[#00224D]"
            />
            <p className="font-semibold">
              {feedbackDetails.feedbackAuthorUsername}
            </p>
          </div>
          <div className="w-max h-max flex">
            <a
              href={`https://profile.intra.42.fr/users/${feedbackDetails.feedbackAuthorIntraLogin}`}
              target="_blank"
              className="bg-[#00224D] rounded-full w-[35px] h-[35px] flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image
                src="/42-logo.svg"
                alt="42-logo.svg"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-col max-sm:ml-[7px]">
          {feedbackDetails.creationDate}
        </div>
        <Link
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          href={`/Engagement?commentAreaSelected=${true}`}
          className="text-[#41B06E] flex item hover:bg-[#41B06E] hover:text-white s-center gap-[3px] border-[2px] border-[#41B06E] rounded-xl p-2 h-max"
        >
          <Image
            src={`${isHovered ? "/CommentIconLight.svg" : "/CommentIcon.svg"}`}
            alt="CommentIcon.svg"
            width={20}
            height={20}
          />
          <p className="max-sm:hidden">Comment</p>
        </Link>
      </div>
    </div>
  );
};
