import axios from "axios";
import { createContext } from "react";
export const UserContext = createContext();

export default function UserContextProvider(props) {
  const token = localStorage.getItem("userToken");
  function addUser(formData) {
    return axios
      .post(
        `https://skilly.runasp.net/api/UserProfile/userProfile/addUserProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
