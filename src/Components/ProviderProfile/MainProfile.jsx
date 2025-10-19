import { useEffect, useState } from "react";
import NavigationTabs from "./NavigationTabs";
import ReviewsGrid from "../ProviderProfile/ReviewsGrid";
import MyServices from "../ProviderProfile/MyServices";
import PreviousWork from "../ProviderProfile/PreviousWork";
import ProfileSidebar from "../ProviderProfile/ProfileSidebar";
import axios from "axios";
import CurrentWork from "./CurrentWork";
import Transactions from "./Transactions";
const MainProfile = () => {
  const token = localStorage.getItem("userToken");
  const [activeTab, setActiveTab] = useState("my-services");
  const [user, setUser] = useState(null);
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  function getUser() {
    axios
      .get(
        `https://skilly.runasp.net/api/Provider/GetServiceProviderByUserId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((ApiResponse) => {
        setUser(ApiResponse.data.provider);
        console.log(ApiResponse);
      })
      .catch((ApiResponse) => {
        console.log(ApiResponse);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="overflow-hidden px-16 pb-20 md:py-20 bg-white  text-gray-800  max-md:px-5 w-full ">
      <div className="flex flex-col-reverse md:flex-row gap-5">
        <section className="w-full md:w-[73%]">
          <div className="flex flex-col mt-8 w-full max-md:mt-6">
            <NavigationTabs onTabChange={handleTabChange} />

            {activeTab === "reviews" && <ReviewsGrid />}
            {activeTab === "previous-work" && <PreviousWork />}
            {activeTab === "my-services" && <MyServices />}
            {activeTab === "current-work" && <CurrentWork />}
            {activeTab === "transactions" && <Transactions />}
          </div>
        </section>
        <aside className="w-full md:w-[27%] md:ml-5 mb-8 md:mb-0">
          <ProfileSidebar />
        </aside>
      </div>
    </main>
  );
};

export default MainProfile;
