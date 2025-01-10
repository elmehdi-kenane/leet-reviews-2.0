import Image from "next/image";

const Page = () => {
  return (
    <div className="mt-[60px] h-screen flex justify-center items-center">
      <Image
        src="https://looktrailers.com/wp-content/uploads/2022/05/UnderConstruction.png"
        alt="https://looktrailers.com/wp-content/uploads/2022/05/UnderConstruction.png"
        width={100}
        height={100}
        className="mx-auto w-[500px]"
      ></Image>
    </div>
  );
};

export default Page;
