import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProviderContext } from "../../Context/ProviderContext";
import defaultUserImg from "../../assets/userpic.jpg";
import { useChat } from "../../Context/ChatContext";
const ProfileHeader = () => {
  const navigate = useNavigate();
  const { providerData, loading } = useContext(ProviderContext);
  const { chatCount } = useChat();
  const handleOpenMessages = () => {
    navigate("/messages");
  };

  const profileImage = (() => {
    if (providerData?.img) {
      if (
        typeof providerData.img === "string" &&
        providerData.img.indexOf("/") === 0 &&
        providerData.img.indexOf("//") !== 0
      ) {
        return `https://skilly.runasp.net${providerData.img}`;
      }
      return providerData.img;
    }
    return defaultUserImg;
  })();

  const providerName = providerData
    ? `${providerData.firstName} ${providerData.lastName}`
    : "اسم المستخدم";

  const profession = providerData?.profession || "موفر خدمة";

  const rating = providerData?.review ? providerData.review.toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="flex gap-9 justify-end max-sm:gap-5 self-stretch my-auto max-md:mt-6 max-sm:mt-4 animate-pulse">
        <div className="self-start mt-2.5">
          <div className="flex gap-1 text-base leading-none text-black">
            <div className="w-[25px] h-[25px] bg-gray-200 rounded-full"></div>
            <div className="w-24 h-5 bg-gray-200 rounded mt-1"></div>
          </div>
          <div className="flex flex-col items-end pl-5 mt-1.5 w-full">
            <div className="flex gap-1.5 text-sm">
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <div className="w-[18px] h-[18px] bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-[30px] h-[30px] bg-gray-200 rounded-full mt-2"></div>
            <div className="mt-3 w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-[130px] h-[130px] bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-9 justify-end max-sm:gap-5 self-stretch my-auto max-md:mt-6 max-sm:mt-4">
      <div className="self-start mt-2.5">
        <div className="flex gap-1 text-base leading-none text-black dark:text-white max-md:mr-0.5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4f86bb2033be9c80b877253d9f2e3a40de7095b640900d01bb6acf81fb0a808?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
            alt="Profile icon"
            className="object-contain shrink-0 aspect-square w-[25px]"
          />
          <h1 className="font-bold text-right mt-1">{providerName}</h1>
        </div>
        <div className="flex flex-col items-end pl-5 mt-1.5 w-full whitespace-nowrap">
          <div className="flex gap-1.5 text-sm text-blue-950 dark:text-blue-200 my-1">
            <span>{rating}</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a335dbe69d831e0f85bef418a397e68b909260f13074c0caea1e32513668493?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
              alt="Rating star"
              className="object-contain shrink-0 self-start aspect-square w-[18px] relative"
            />
          </div>
          <div className="relative">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/32baaa7284732c65dfbe9e008f7cb3949a3883f745d238bef60ede1319f186e1?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c"
              alt="Badge"
              className="object-contain aspect-square w-[30px] cursor-pointer hover:opacity-80 transition-opacity my-3"
              onClick={handleOpenMessages}
            />
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#a4d7f5] border-2 border-white rounded-full -top-0 -end-3">
              {chatCount}
            </div>
          </div>
          <h2 className="mt-3 text-base leading-none text-right text-black dark:text-white max-md:mr-1.5">
            {profession}
          </h2>
        </div>
      </div>
      <img
        src={profileImage}
        alt="Profile picture"
        className="object-cover shrink-0 max-w-full aspect-square w-[130px] rounded-full"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultUserImg;
        }}
      />
    </div>
  );
};

export default ProfileHeader;
