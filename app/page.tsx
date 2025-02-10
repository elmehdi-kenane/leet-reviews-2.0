"use client";

import Image from "next/image";
import expandedLogo from "@/public/expanded-logo.svg";
import Underline from "@/public/Underline_03.svg";
import cross_menu from "@/public/cross-menu.svg";
import menu from "@/public/menu.svg";
import logo1 from "@/public/logo1.svg";
import logo2 from "@/public/logo2.svg";
import example_1 from "@/public/example_1.svg";
import example_2 from "@/public/example_2.svg";
import example_3 from "@/public/example_3.svg";
import logo3 from "@/public/logo3.svg";
import elmehdiKen3aneExpanded from "@/public/elmehdiKen3aneExpanded.svg";
import elmehdiKen3ane from "@/public/elmehdiKen3ane.svg";
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
    if (navbarSectionsRef.current) {
      setNavbarSectionsWidth(
        navbarSectionsRef.current.getBoundingClientRect().width,
      );
    }
    const handleResize = () => {
      if (navbarSectionsRef.current) {
        setNavbarSectionsWidth(
          navbarSectionsRef.current.getBoundingClientRect().width,
        );
        console.log(
          "current width",
          navbarSectionsRef.current.getBoundingClientRect().width,
        );
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[url('/Noise&Texture.svg')] bg-cover bg-center bg-no-repeat p-14 max-md:p-6 overflow-y-auto overflow-x-hidden box-border"
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
  const [isMobileNavbarSectionsOpen, setIsMobileNavbarSectionsOpen] =
    useState(false);

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

  //   useEffect(() => {
  //     const handleClickOutside = (e: MouseEvent) => {
  //       if (
  //         isMobileNavbarSectionsOpen === true &&
  //         navbarSectionsRef.current &&
  //         !navbarSectionsRef.current.contains(e.target as Node)
  //       ) {
  //         console.log("close the navbar from handleClickOutside");
  //         console.log("navbarSectionsRef.current", navbarSectionsRef.current);
  //         console.log("e.target", e.target);
  //         setTimeout(() => {
  //             setIsMobileNavbarSectionsOpen(false);
  //         }, 500);
  //       }
  //     };
  //     window.addEventListener("mousedown", handleClickOutside);
  //     return () => {
  //       window.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [navbarSectionsRef.current, ]);

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
    <>
      <div
        ref={navbarSectionsRef}
        className={`max-w-full rounded-b-3xl bg-secondary/30 backdrop-blur-3xl w-[100%] justify-between md:hidden p-12 max-md:p-6 flex-col fixed top-0 z-[300] left-0 right-0 font-SpaceGrotesk text-neutral transition-all duration-300 ease-in-out ${
          isMobileNavbarSectionsOpen
            ? "h-[320px]"
            : "h-[70px] items-center bg-transparent"
        }`}
      >
        <div className="flex w-full justify-between">
          <Image
            className="w-[117px] h-[20px] min-w-[117px] select-none"
            src={expandedLogo}
            height={20}
            width={117}
            alt={expandedLogo}
          ></Image>
          <Image
            className="w-[20px] min-w-[20px] select-none"
            src={isMobileNavbarSectionsOpen === true ? cross_menu : menu}
            height={20}
            width={20}
            alt={isMobileNavbarSectionsOpen === true ? cross_menu : menu}
            onClick={() => {
              setIsMobileNavbarSectionsOpen((prev) => !prev);
              if (isMobileNavbarSectionsOpen === true)
                console.log("close the navbar");
            }}
          ></Image>
        </div>
        {isMobileNavbarSectionsOpen === true && (
          <div className="flex flex-col justify-center">
            <div
              className={`flex flex-col my-4 justify-center h-[160px] items-center w-full gap-5`}
            >
              <Link
                onClick={() => {
                  setIsMobileNavbarSectionsOpen(false);
                  handleSectionClick(sections[0]);
                }}
                className={`${currentSection === "HowItWorks" ? "underline" : ""}`}
                href="#HowItWorks"
              >
                How It Works?
              </Link>
              <div className="w-[10%] h-[1px] rounded-full bg-neutral"></div>
              <Link
                onClick={() => {
                  setIsMobileNavbarSectionsOpen(false);
                  handleSectionClick(sections[1]);
                }}
                className={`${currentSection === "Why" ? "underline" : ""}`}
                href="#Why"
              >
                Why?
              </Link>
              <div className="w-[10%] h-[1px] rounded-full bg-neutral"></div>
              <Link
                onClick={() => {
                  setIsMobileNavbarSectionsOpen(false);
                  handleSectionClick(sections[2]);
                }}
                className={`${currentSection === "Community" ? "underline" : ""}`}
                href="#Community"
              >
                Community
              </Link>
            </div>
            <Link
              href={"/auth/sign-up"}
              className="p-2 border border-neutral text-center w-full rounded-md hover:bg-primary"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
      <div
        className={`max-w-full w-[100%] max-md:hidden flex rounded-b-3xl h-[120px] items-center bg-secondary/30 backdrop-blur-md justify-between px-12 pb-0 fixed top-0 z-[300] left-0 right-0 font-SpaceGrotesk text-neutral`}
        ref={navbarSectionsRef}
      >
        <Image
          className="w-[117px] min-w-[117px] select-none"
          src={expandedLogo}
          height={150}
          width={117}
          alt={expandedLogo}
        ></Image>
        <div className="flex gap-7 mx-5 items-center justify-center max-w-[730px] flex-1 rounded-lg relative z-[200]">
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
          className="p-2 border max-md:hidden border-neutral rounded-md hover:bg-primary"
        >
          Get Started
        </Link>
      </div>
    </>
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
          <div className="bg-secondary md:w-max h-[10px] flex min-w-max mt-[7px]">
            <p className="mt-[-7px]">Leet Reviews</p>
          </div>
          <p className="md:w-max w-full max-w-full text-center">
            is a community-driven app designed to help employees choose their
            next job by
          </p>
          <div className="bg-secondary md:w-max h-[10px] flex min-w-max mt-[7px]">
            <p className="mt-[-7px]">providing insights</p>
          </div>
          <p className="md:w-max w-full max-w-full text-center">
            into company cultures and spotlighting potential red flags to avoid
            toxic environments.
          </p>
        </div>
        <div className="w-full max-w-[600px] bg-secondary min-h-[160px] sm:min-w-[409px] rounded-xl flex max-md:flex-col p-3 shadow-[0px_0px_69px_-13px_#141e46]">
          <div className="md:w-[50%] max-md:h-[160px] max-md:w-full flex items-center gap-3 flex-col">
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
            <p className="text-neutral max-md:text-center px-3 text-sm w-[90%]">
              {comparisons[comparisonIndex].without}
            </p>
          </div>
          <div className="md:min-h-[50%] md:h-[50px] max-md:hidden my-auto mb-[20px] bg-neutral min-w-[1px] max-md:h-[1px] max-md:w-[50%] w-[1px] max-md:my-5 mx-auto"></div>
          <div className="md:w-[50%] max-md:h-[160px] max-md:w-full flex items-center gap-3 flex-col">
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
            <p className="text-neutral max-md:text-center px-3 text-sm w-[90%]">
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
      style={{ width: navbarSectionsWidth - 112 }}
      //   id="Community"
      className="w-full mt-[150px] flex flex-col items-center justify-center text-secondary mx-auto"
    >
      <SectionHeader headerText="Community"></SectionHeader>
      <div className="font-SpaceGrotesk text-neutral text-[12px] flex flex-col gap-1 flex-wrap justify-center items-center max-md:text-center">
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
      <div className="flex justify-center w-max flex-col max-sm:w-full">
        <Image
          className="min-w-[9px] w-[20px] select-none ml-auto"
          src={asset3}
          height={20}
          width={20}
          alt={asset3}
        ></Image>
        <div className="w-max max-md:w-full max-md:bg-transparent max-md:min-w-full h-[10px] flex min-w-max mt-[24px] bg-gradient-to-t md:from-[#141e46] md:to-transparent">
          <p className="text-neutral font-SpaceGrotesk font-semibold text-[30px] mt-[-24px] w-full text-center">
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
          className="min-w-[9px] w-[45px] select-none ml-auto mt-[10px] max-md:mt-[80px] mr-[-45px]"
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
        <div className="w-full flex justify-between items-end max-md:items-center mt-auto">
          <Link
            href={"https://github.com/elmehdi-kenane"}
            className="flex max-md:min-w-[75px] md:min-w-[120px]"
          >
            <Image
              src={elmehdiKen3aneExpanded}
              alt={elmehdiKen3aneExpanded}
              width={120}
              height={30}
              className="max-md:hidden select-none max-h-[120px] h-[30px]"
            />
            <Image
              src={elmehdiKen3ane}
              alt={elmehdiKen3ane}
              width={75}
              height={30}
              className="md:hidden select-none max-h-[120px] h-[30px]"
            />
          </Link>
          <Image
            src={lrLogoWhite}
            alt={lrLogoWhite}
            width={120}
            height={80}
            className="max-md:min-w-[75px] md:min-w-[120px] select-none max-h-[80px]"
          />
          <div className="max-md:min-w-[30px] md:min-w-[120px] flex justify-end">
            <Image
              src={goToTop}
              alt={goToTop}
              onClick={handleScrollToTop}
              width={30}
              height={30}
              className="cursor-pointer select-none max-h-[30px]"
            />
          </div>
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

const Header = ({ navbarSectionsWidth }: { navbarSectionsWidth: number }) => {
  const [isExampleHovered, setIsExampleHovered] = useState(false);
  return (
    <div
      className="w-full flex flex-col justify-center max-md:items-start items-center mt-24 gap-5 text-neutral mx-auto"
      style={{ width: navbarSectionsWidth - 112 }}
    >
      <div className="font-SpaceGrotesk text-[40px] max-lg:text-[22px] max-md:text-[18px] max-w-full font-normal flex mx-auto max-md:flex-col max-md:justify-center items-center mb-10">
        <p className="min-w-max mr-2">The Truth About Tech Jobs,</p>
        <div className="flex w-max flex-col gap-[6px] max-md:gap-1 flex-wrap mt-3 max-md:mt-3">
          <span className="font-black flex flex-col items-center self-center">
            Unlocked.
          </span>
          <Image
            className="min-w-[9px] w-[150px] max-lg:w-[105px] select-none h-max self-end lg:mr-7"
            src={Underline}
            height={30}
            width={150}
            alt={Underline}
          ></Image>
        </div>
      </div>
      <div className="relative flex justify-center flex-col items-center mx-auto">
        <div className="w-[400px] max-md:w-[200px] min-h-[200px] max-md:min-h-[100px] top-0 left-0 right-0 z-[10] bg-primary rounded-t-full blur-md"></div>
        <div className="flex mt-[-70px] md:hidden">
          <Image
            src={example_1}
            alt={example_1}
            width={100}
            height={100}
            style={{
              transform: `${isExampleHovered === true ? "rotate(3deg)" : "rotate(-12deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[100px] z-[11] select-none max-md:max-h-[100px] mr-[-50px]"
          />
          <Image
            src={example_2}
            alt={example_2}
            width={100}
            height={100}
            style={{
              transform: `${isExampleHovered === true ? "rotate(4deg)" : "rotate(-5deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[100px] z-[13] select-none max-md:max-h-[100px]"
          />
          <Image
            src={example_3}
            alt={example_3}
            width={100}
            height={100}
            style={{
              transform: `${isExampleHovered === true ? "rotate(-5deg)" : "rotate(15deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[100px] z-[12] select-none max-md:max-h-[100px] ml-[-50px]"
          />
        </div>
        <div className="flex mt-[-130px] max-md:hidden">
          <Image
            src={example_1}
            alt={example_1}
            width={400}
            height={400}
            style={{
              transform: `${isExampleHovered === true ? "rotate(3deg)" : "rotate(-12deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[400px] z-[11] select-none max-md:max-h-[400px] ml-[0px]"
          />
          <Image
            src={example_2}
            alt={example_2}
            width={400}
            height={400}
            style={{
              transform: `${isExampleHovered === true ? "rotate(4deg)" : "rotate(-5deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[400px] z-[13] select-none max-md:max-h-[400px] ml-[-150px]"
          />
          <Image
            src={example_3}
            alt={example_3}
            width={400}
            height={400}
            style={{
              transform: `${isExampleHovered === true ? "rotate(-5deg)" : "rotate(15deg)"}`,
              transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={() => setIsExampleHovered(true)}
            onMouseLeave={() => setIsExampleHovered(false)}
            className="md:rounded-[35px] max-md:max-w-[400px] z-[12] select-none max-md:max-h-[400px] ml-[-180px]"
          />
        </div>
        <Link
          href={"/auth/sign-up"}
          className="bg-primary p-3 border-2 absolute z-[14] bottom-[-40px] left-0 right-0 mx-auto max-md:min-w-max w-max transition-transform duration-500 transform hover:scale-[1.05] border-neutral rounded-xl text-neutral font-SpaceGrotesk"
        >
          Browse Feedbacks
        </Link>
        <div className="flex w-[70%] min-w-[300px] lg:min-w-[715px] top-[500px] max-md:top-[400px] z-[300] fixed justify-between">
          <Image
            src={logo1}
            alt={logo1}
            width={80}
            height={80}
            className="max-w-[80px] select-none mt-[70px] max-h-[80px] absolute z-[500]"
          />
          <Image
            src={logo2}
            alt={logo2}
            width={80}
            height={80}
            className="max-w-[80px] select-none max-h-[80px] absolute right-0 z-[1]"
          />
        </div>
      </div>
    </div>
  );
};
