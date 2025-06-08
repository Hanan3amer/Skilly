import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
export const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("userToken");

  function getUser() {
    axios
      .get(
        "https://skilly.runasp.net/api/UserProfile/UserProfile/GetUserProfileByuserId",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };
  return (
    <UserDataContext.Provider value={{ user, updateUser }}>
      {children}
    </UserDataContext.Provider>
  );
}
UserDataProvider.propTypes = {
  children: PropTypes.node,
};
