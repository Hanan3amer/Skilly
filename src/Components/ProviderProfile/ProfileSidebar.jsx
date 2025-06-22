import { useContext, useEffect } from "react";
import UserInfo from "./UserInfo";
import PersonalInfo from "../ProviderProfile/PersonalInfo";
import { ProviderContext } from "../../Context/ProviderContext";
import Loading from "../Loading/Loading";

const ProfileSidebar = () => {
  const { providerData, getProviderData } = useContext(ProviderContext);

  useEffect(() => {
    if (!providerData) {
      getProviderData();
    }
  }, [providerData, getProviderData]);

  if (!providerData) {
    return <Loading />;
  }

  return (
    <div className="w-full max-md:mt-10 text-gray-800 dark:text-white">
      <UserInfo user={providerData} />
      <PersonalInfo user={providerData} />
    </div>
  );
};

export default ProfileSidebar;
