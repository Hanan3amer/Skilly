import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const UserDataContext = createContext();

export function UserDataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("userToken");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (token) {
      axios
        .get(
          "https://skilly.runasp.net/api/UserProfile/userProfile/GetUserProfileByuserId",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setUser(response.data.user);
          localStorage.setItem("userD", JSON.stringify(response.data.user));
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  return (
    <UserDataContext.Provider value={{ user }}>
      {children}
    </UserDataContext.Provider>
  );
}

UserDataProvider.propTypes = {
  children: PropTypes.node,
};
