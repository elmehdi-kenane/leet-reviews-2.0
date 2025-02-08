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
import logo2 from "@/public/logo2.svg";
import logo3 from "@/public/logo3.svg";
import elmehdiken3ane from "@/public/elmehdiken3ane.svg";
import lrLogoWhite from "@/public/lrLogoWhite.svg";
import goToTop from "@/public/goToTop.svg";
import logo4 from "@/public/logo4.svg";
import logo5 from "@/public/logo5.svg";
import discordAvatar from "@/public/discordAvatar.svg";
import asset from "@/public/asset.svg";
import asset2 from "@/public/asset2.svg";
import asset3 from "@/public/asset3.svg";
import asset4 from "@/public/asset4.svg";
import asset5 from "@/public/asset5.svg";
import lrLogo from "@/public/lr-logo.svg";
import checkMarkEmoji from "@/public/checkMarkEmoji.png";
import crossEmoji from "@/public/crossEmoji.png";
import hashtag from "@/public/hashtag.svg";
import lrLogoGreen from "@/public/lr-logo-green.svg";
import lrLogoBlue from "@/public/lr-logo-blue.svg";
import votes from "@/public/1.svg";
import trustScore from "@/public/2.svg";
import anonymous from "@/public/3.svg";
import { useEffect, useRef, MutableRefObject, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarSectionsRef = useRef<HTMLDivElement>(null);
  const [navbarSectionsWidth, setNavbarSectionsWidth] = useState(0);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);
  const whySectionRef = useRef<HTMLDivElement>(null);
  const communitySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navbarSectionsRef.current)
      setNavbarSectionsWidth(
        navbarSectionsRef.current.getBoundingClientRect().width,
      );
    const handleResize = () => {
      if (navbarSectionsRef.current)
        setNavbarSectionsWidth(
          navbarSectionsRef.current.getBoundingClientRect().width,
        );
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[url('/Noise&Texture.svg')] bg-cover bg-center bg-no-repeat p-14 overflow-auto box-border"
    >
      <div className="flex flex-col w-full">
        <Navbar
          containerRef={containerRef}
          navbarSectionsRef={navbarSectionsRef}
          howItWorksSectionRef={howItWorksSectionRef}
          whySectionRef={whySectionRef}
          communitySectionRef={communitySectionRef}
        ></Navbar>
        <Header navbarSectionsWidth={navbarSectionsWidth}></Header>
        <HowItWorksSection
          navbarSectionsWidth={navbarSectionsWidth}
          howItWorksSectionRef={howItWorksSectionRef}
        ></HowItWorksSection>
        <WhySection
          whySectionRef={whySectionRef}
          navbarSectionsWidth={navbarSectionsWidth}
        ></WhySection>
        <CommunitySection
          navbarSectionsWidth={navbarSectionsWidth}
          communitySectionRef={communitySectionRef}
        ></CommunitySection>
        <FooterSection containerRef={containerRef}></FooterSection>
      </div>
    </div>
  );
}

const Navbar = ({
  containerRef,
  navbarSectionsRef,
  howItWorksSectionRef,
  whySectionRef,
  communitySectionRef,
}: {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  navbarSectionsRef: MutableRefObject<HTMLDivElement | null>;
  howItWorksSectionRef: MutableRefObject<HTMLDivElement | null>;
  whySectionRef: MutableRefObject<HTMLDivElement | null>;
  communitySectionRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const [currentSection, setCurrentSection] = useState("");

  const offset = 150;

  const sections = [
    { name: "HowItWorks", ref: howItWorksSectionRef },
    { name: "Why", ref: whySectionRef },
    { name: "Community", ref: communitySectionRef },
  ];

  useEffect(() => {
    const handleHashChange = (event: HashChangeEvent) => {
      setCurrentSection(event.newURL.split("#")[1]);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      let visibleSection = "";
      sections.forEach((section) => {
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          const sectionHeight = section.ref.current.offsetHeight;
          // Check if the section is in view
          if (
            visibleSection === "" &&
            scrollTop >= sectionTop - containerHeight / 2 &&
            scrollTop < sectionTop + sectionHeight - containerHeight / 2
          ) {
            visibleSection = section.name;
          }
        }
      });
      if (currentSection !== visibleSection) {
        setCurrentSection(visibleSection);
      }
    };
    const initializeCurrentHashtag = () => {
      const hash = window.location.hash;
      setCurrentSection(hash ? hash.substring(1) : "");
    };
    initializeCurrentHashtag();
    window.addEventListener("hashchange", handleHashChange);
    if (containerRef.current)
      containerRef.current.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (containerRef.current)
        containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSectionClick = (section: {
    name: string;
    ref: MutableRefObject<HTMLDivElement | null>;
  }) => {
    const container = containerRef.current;
    if (!section.ref.current || !container) return;
    setCurrentSection(section.name);
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    let topOfSection = section.ref.current.getBoundingClientRect().top;
    console.log(
      `before: topOfSection ${topOfSection} scrollTop ${scrollTop} containerHeight ${containerHeight}`,
    );
    if (topOfSection < 0) {
      topOfSection *= -1;
      topOfSection = scrollTop - topOfSection;
    } else if (topOfSection < scrollTop) topOfSection += scrollTop;
    else if (topOfSection > scrollTop) topOfSection += scrollTop;
    else if (topOfSection > containerHeight) topOfSection -= scrollTop;
    console.log(
      `after: topOfSection ${topOfSection} scrollTop ${scrollTop} containerHeight ${containerHeight}`,
    );
    container.scrollTo({
      top: topOfSection - offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-full w-[99.4%] flex h-[100px] items-center justify-between p-12 pb-0 fixed top-0 z-[300] left-0 right-0 font-SpaceGrotesk text-neutral">
      <Image
        className="w-[117px] min-w-[117px] select-none"
        src={expandedLogo}
        height={150}
        width={117}
        alt={expandedLogo}
      ></Image>
      <div
        ref={navbarSectionsRef}
        className="flex gap-7 mx-5 items-center justify-center max-w-[730px] flex-1 bg-secondary/30 backdrop-blur-md h-[150%] rounded-lg relative z-[200]"
      >
        <Link
          onClick={() => handleSectionClick(sections[0])}
          className={`${currentSection === "HowItWorks" ? "underline" : ""}`}
          href="#HowItWorks"
        >
          How It Works?
        </Link>
        <div className="w-1 h-1 rounded-full bg-neutral"></div>
        <Link
          onClick={() => handleSectionClick(sections[1])}
          className={`${currentSection === "Why" ? "underline" : ""}`}
          href="#Why"
        >
          Why?
        </Link>
        <div className="w-1 h-1 rounded-full bg-neutral"></div>
        <Link
          onClick={() => handleSectionClick(sections[2])}
          className={`${currentSection === "Community" ? "underline" : ""}`}
          href="#Community"
        >
          Community
        </Link>
      </div>
      <Link
        href={"/auth/sign-up"}
        className="p-2 border border-neutral rounded-md hover:bg-primary"
      >
        Get Started
      </Link>
    </div>
  );
};

const WhySection = ({
  whySectionRef,
  navbarSectionsWidth,
}: {
  whySectionRef: MutableRefObject<HTMLDivElement | null>;
  navbarSectionsWidth: number;
}) => {
  const [comparisonIndex, setComparisonIndex] = useState(0);
  const comparisons = [
    {
      name: "Transparency & Trust",
      with: "Candidates get real, verified feedback from developers who have actually worked or interned at a company, improving transparency.",
      without:
        "Job seekers rely on unverified or scattered sources, leading to potential misinformation.",
    },
    {
      name: "Company Culture Insights",
      with: "Developers can anonymously share honest feedback about work culture, leadership, and growth opportunities.",
      without:
        "Companies control the narrative, making it hard for candidates to gauge real experiences before joining.",
    },
    {
      name: "Better Career Decisions",
      with: "Candidates can compare companies based on actual developer experiences, helping them choose wisely.",
      without:
        "Many end up in toxic workplaces or misleading roles due to lack of firsthand insights.",
    },
  ];
  return (
    <div
      ref={whySectionRef}
      //   id="Why"
      className="mt-[150px] max-w-[730px] mx-auto flex flex-col items-center text-secondary"
      style={{ width: navbarSectionsWidth - 3 }}
    >
      <SectionHeader headerText="Why"></SectionHeader>
      <div className="flex justify-center w-full items-center flex-col gap-5 relative">
        <div className="font-SpaceGrotesk w-full text-neutral text-[12px] flex gap-1 flex-wrap justify-center">
          <div className="bg-secondary w-max h-[10px] flex min-w-max mt-[7px]">
            <p className="mt-[-7px]">Leet Reviews</p>
          </div>
          <p className="w-max max-w-full text-center">
            is a community-driven app designed to help employees choose their
            next job by
          </p>
          <div className="bg-secondary w-max h-[10px] flex min-w-max mt-[7px]">
            <p className="mt-[-7px]">providing insights</p>
          </div>
          <p className="w-max max-w-full text-center">
            into company cultures and spotlighting potential red flags to avoid
            toxic environments.
          </p>
        </div>
        <div className="w-full max-w-[600px] bg-secondary min-h-[160px] min-w-[409px] rounded-xl flex p-3 shadow-[0px_0px_69px_-13px_#141e46]">
          <div className="w-[50%] flex items-center gap-3 flex-col">
            <div className="bg-neutral flex w-[90%] min-w-[152px] p-3 items-center justify-between gap-2 font-SpaceGrotesk rounded-xl">
              <Image
                className="min-w-[20px] min-h-[20px] w-[20px] h-[20px] select-none"
                src={crossEmoji}
                height={20}
                width={20}
                alt={`${crossEmoji}`}
              ></Image>
              <p className="font-semibold">Without</p>
              <Image
                className="min-w-[30px] w-[30px] select-none"
                src={lrLogoBlue}
                height={30}
                width={30}
                alt={lrLogoBlue}
              ></Image>
            </div>
            <p className="text-neutral px-3 text-sm w-[90%]">
              {comparisons[comparisonIndex].without}
            </p>
          </div>
          <div className="min-h-[50%] h-[50px] my-auto mb-[20px] bg-neutral min-w-[1px] w-[1px]"></div>
          <div className="w-[50%] flex items-center gap-3 flex-col">
            <div className="bg-neutral flex w-[90%] min-w-[152px] p-3 items-center justify-between gap-2 font-SpaceGrotesk rounded-xl">
              <Image
                className="min-w-[20px] min-h-[20px] w-[20px] h-[20px] select-none"
                src={checkMarkEmoji}
                height={20}
                width={20}
                alt={`${checkMarkEmoji}`}
              ></Image>
              <p className="font-semibold">With</p>
              <Image
                className="min-w-[30px] w-[30px] select-none"
                src={lrLogoGreen}
                height={30}
                width={30}
                alt={lrLogoGreen}
              ></Image>
            </div>
            <p className="text-neutral px-3 text-sm w-[90%]">
              {comparisons[comparisonIndex].with}
            </p>
          </div>
          <Image
            src={logo3}
            alt={logo3}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px] absolute z-10 bottom-[0px] right-[-0px]"
          />
        </div>
        <div className="w-full flex justify-center gap-5">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setComparisonIndex(index)}
              className={`w-3 h-3 border-2 border-neutral rounded-full transition-all duration-500 ${
                comparisonIndex === index
                  ? "bg-neutral scale-125"
                  : "bg-transparent"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommunitySection = ({
  communitySectionRef,
  navbarSectionsWidth,
}: {
  communitySectionRef: MutableRefObject<HTMLDivElement | null>;
  navbarSectionsWidth: number;
}) => {
  return (
    <div
      ref={communitySectionRef}
      style={{ width: navbarSectionsWidth - 3 }}
      //   id="Community"
      className="w-full mt-[150px] flex flex-col items-center justify-center text-secondary"
    >
      <SectionHeader headerText="Community"></SectionHeader>
      <div className="font-SpaceGrotesk text-neutral text-[12px] flex flex-col gap-1 flex-wrap justify-center items-center">
        <p>
          Connect with like-minded professionals, share insights, and stay
          ahead.
        </p>
        <div className="mt-7 flex justify-center items-end flex-col w-max ml-[30px]">
          <Image
            className="min-w-[9px] w-[20px] select-none"
            src={asset}
            height={20}
            width={20}
            alt={asset}
          ></Image>
          <div className="bg-neutral p-2 flex w-max rounded-lg gap-3 mx-auto mt-[-10px] mr-[20px]">
            <Image
              className="min-w-[9px] w-[50px] select-none"
              src={discordAvatar}
              height={50}
              width={50}
              alt={discordAvatar}
            ></Image>
            <button className="bg-primary p-2 rounded-md font-semibold text-lg select-none">
              Join Us on Discord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterSection = ({
  containerRef,
}: {
  containerRef: MutableRefObject<HTMLElement | null>;
}) => {
  const handleScrollToTop = () => {
    console.log("handleScrollToTop call");

    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    else console.log("containerRef.current is null");
  };

  return (
    <div className="flex justify-center flex-col mx-auto items-center mt-[300px] w-full">
      <div className="flex justify-center w-max flex-col ">
        <Image
          className="min-w-[9px] w-[20px] select-none ml-auto"
          src={asset3}
          height={20}
          width={20}
          alt={asset3}
        ></Image>
        <div className="w-max h-[10px] flex min-w-max mt-[24px] bg-gradient-to-t from-[#141e46] to-transparent">
          <p className="text-neutral font-SpaceGrotesk font-semibold text-[30px] mt-[-24px]">
            Ready to make smarter career moves?
          </p>
        </div>
        <Image
          className="min-w-[9px] w-[20px] select-none mr-auto mt-[10px]"
          src={asset2}
          height={20}
          width={20}
          alt={asset2}
        ></Image>
      </div>
      <div>
        <Image
          className="min-w-[9px] w-[45px] select-none ml-auto mt-[10px] mr-[-45px]"
          src={asset5}
          height={45}
          width={45}
          alt={asset5}
        ></Image>
        <Link
          href={"/auth/sign-up"}
          className="bg-primary border-2 border-neutral p-3 rounded-xl select-none font-SpaceGrotesk font-semibold"
        >
          JOIN THE COMMUNITY
        </Link>
        <Image
          className="min-w-[9px] w-[35px] select-none mr-auto ml-[-30px]"
          src={asset4}
          height={35}
          width={35}
          alt={asset4}
        ></Image>
      </div>
      <div className="w-full flex flex-col justify-center items-center h-72">
        <div className="flex w-[70%] min-w-[300px] justify-between max-sm:hidden my-auto">
          <Image
            src={logo4}
            alt={logo4}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px]"
          />
          <Image
            src={logo5}
            alt={logo5}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px]"
          />
        </div>
        <div className="w-full flex justify-between items-end mt-auto">
          <Link href={"https://github.com/elmehdi-kenane"}>
            <Image
              src={elmehdiken3ane}
              alt={elmehdiken3ane}
              width={120}
              height={120}
              className="max-w-[120px] select-none max-h-[120px]"
            />
          </Link>
          <Image
            src={lrLogoWhite}
            alt={lrLogoWhite}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px]"
          />
          <Image
            src={goToTop}
            alt={goToTop}
            onClick={handleScrollToTop}
            width={30}
            height={30}
            className="max-w-[30px] cursor-pointer select-none max-h-[30px]"
          />
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection = ({
  howItWorksSectionRef,
  navbarSectionsWidth,
}: {
  howItWorksSectionRef: MutableRefObject<HTMLDivElement | null>;
  navbarSectionsWidth: number;
}) => {
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
      ref={howItWorksSectionRef}
      //   id="HowItWorks"
      className="w-full mt-[150px] flex flex-col items-center text-secondary"
    >
      <SectionHeader headerText="How It Works?"></SectionHeader>
      <div
        className="flex w-full max-w-[730px] gap-3 justify-center flex-wrap"
        style={{ width: navbarSectionsWidth - 3 }}
      >
        {features.map((feature) => {
          return (
            <div
              key={feature.header}
              className="bg-neutral max-w-[318px] min-w-[157px] w-[30%] p-3 rounded-xl flex flex-col gap-1"
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
      <Link
        href={"/auth/sign-up"}
        className="p-3 border-2 transition-transform duration-500 transform hover:scale-[1.05] border-neutral rounded-xl text-neutral font-SpaceGrotesk"
      >
        Explore All Features
      </Link>
    </div>
  );
};

const SectionHeader = ({ headerText }: { headerText: string }) => {
  return (
    <div className="flex gap-3 mb-4">
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

const Header = ({ navbarSectionsWidth }: { navbarSectionsWidth: number }) => {
  return (
    <div
      className="w-full flex flex-col justify-center items-center mt-24 gap-5 text-neutral mx-auto"
      style={{ width: navbarSectionsWidth - 3 }}
    >
      <div className="font-SpaceGrotesk text-[40px] max-lg:text-[22px] max-w-full min-w-max font-normal flex flex-col items-center mb-10">
        <div className="flex gap-2">
          <p>The Truth About Tech Jobs,</p>
          <span className="font-black flex flex-col items-center">
            Unlocked.
          </span>
        </div>
        <Image
          className="min-w-[9px] w-[150px] select-none h-max self-end lg:mr-7"
          src={Underline}
          height={30}
          width={150}
          alt={Underline}
        ></Image>
      </div>
      <div className="relative flex justify-center flex-col items-center">
        <div className="min-w-[400px] absolute min-h-[200px] top-0 z-[10] bg-primary rounded-t-full blur-md"></div>
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
        <Link
          href={"/auth/sign-up"}
          className="bg-primary p-3 border-2 absolute z-[14] bottom-[-40px] transition-transform duration-500 transform hover:scale-[1.05] border-neutral rounded-xl text-neutral font-SpaceGrotesk"
        >
          Browse Feedbacks
        </Link>
        <div className="flex w-[70%] min-w-[300px] max-lg:min-w-[715px] top-[500px] fixed justify-between">
          <Image
            src={logo1}
            alt={logo1}
            width={80}
            height={80}
            className="max-w-[80px] select-none mt-[70px] max-h-[80px]"
          />
          <Image
            src={logo2}
            alt={logo2}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};
