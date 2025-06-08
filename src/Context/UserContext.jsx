import axios from "axios";
import { createContext } from "react";
export const UserContext = createContext();

export default function UserContextProvider(props) {
  function addUser(formData) {
    const token = localStorage.getItem("userToken");
    return axios
      .post(
        `https://skilly.runasp.net/api/UserProfile/UserProfile/addUserProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((Response) => Response)
      .catch((err) => err);
  }

  return (
    <UserContext.Provider value={{ addUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
