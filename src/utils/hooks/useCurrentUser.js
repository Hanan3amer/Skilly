import axios from "axios";

export async function getCurrentUser() {
  const lastLogout = localStorage.getItem("lastLogout");
  const userData = localStorage.getItem("userData");
  const userToken = localStorage.getItem("userToken");

  if (!userToken) {
    throw new Error("No authentication token available");
  }

  if (userData && lastLogout) {
    const userDataObj = JSON.parse(userData);
    const lastSaved = userDataObj._lastSaved || 0;
    
    if (lastSaved < parseInt(lastLogout)) {
      console.log("User data is older than last logout, fetching fresh data");
      return fetchFreshUserData(userToken);
    }
  }

  if (userData) {
    return JSON.parse(userData);
  }

  return fetchFreshUserData(userToken);
}

async function fetchFreshUserData(userToken) {
  try {
    const { data } = await axios.get(
      "https://skilly.runasp.net/api/User/GetUserById",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    
    if (!data.user) {
      throw new Error("Invalid user data received from server");
    }
    
    const userWithTimestamp = {
      ...data.user,
      _lastSaved: Date.now()
    };
    
    localStorage.setItem("userData", JSON.stringify(userWithTimestamp));
    
    if (userWithTimestamp.userType !== undefined) {
      localStorage.setItem("userType", userWithTimestamp.userType.toString());
    }
    
    return userWithTimestamp;
  } catch (error) {
    console.error("Error fetching user data:", error);
    localStorage.removeItem("userToken");
    throw error;
  }
}
