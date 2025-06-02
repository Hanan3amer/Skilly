import { useEffect, useState } from "react";
import NavigationTabs from "./NavigationTabs";
import ReviewsGrid from "./ReviewsGrid";
import MyServices from "./MyServices";
import PreviousWork from "./PreviousWork";
import ProfileSidebar from "./ProfileSidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
const ProviderProfileUser = () => {
  const token = localStorage.getItem("userToken");
  const [activeTab, setActiveTab] = useState("my-services");
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  function getUser(id) {
    axios
      .get(
        `https://skilly.runasp.net/api/Provider/GetServiceProviderBy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((ApiResponse) => {
        setUser(ApiResponse.data.provider);
        console.log(ApiResponse.data.provider);
      })
      .catch((ApiResponse) => {
        console.log(ApiResponse);
      });
  }

  useEffect(() => {
    getUser(id);
  }, [id]);

  return (
    <main className="overflow-hidden px-16 py-20 bg-white dark:bg-gray-900 text-gray-800 dark:text-white max-md:px-5 w-full ">
      <div className="flex flex-col-reverse md:flex-row gap-5">
        <section className="w-full md:w-[73%]">
          <div className="flex flex-col mt-8 w-full max-md:mt-6">
            <NavigationTabs onTabChange={handleTabChange} />
            {activeTab === "reviews" && <ReviewsGrid id={id} />}
            {activeTab === "previous-work" && <PreviousWork providerId={id} />}
            {activeTab === "my-services" && <MyServices id={id} />}
          </div>
        </section>
        <aside className="w-full md:w-[27%] md:ml-5 mb-8 md:mb-0">
          <ProfileSidebar id={id} />
        </aside>
      </div>
    </main>
  );
};

export default ProviderProfileUser;
