import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserInfo from "./UserInfo";
import PersonalInfo from "./PersonalInfo";
import { ProviderContext } from "../../Context/ProviderContext";
import Loading from "../Loading/Loading";

const ProfileSidebar = ({ id }) => {
  const { getProviderDataById } = useContext(ProviderContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const cached = JSON.parse(localStorage.getItem("providerData"));
    if (cached && cached.id === id) {
      setUser(cached);
      setLoading(false);
    } else {
      getProviderDataById(id)
        .then((res) => {
          if (res?.provider) {
            setUser(res.provider);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [id, getProviderDataById]);

  if (loading) return <Loading />;

  return (
    <div className="w-full max-md:mt-10 text-gray-800 dark:text-white">
      <UserInfo user={user} />
      <PersonalInfo user={user} />
    </div>
  );
};

ProfileSidebar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProfileSidebar;
