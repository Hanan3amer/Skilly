export const getUserType = () => {
  const userType = localStorage.getItem("userType");
  if (!userType) {
    const userData = localStorage.getItem("userData");
    const userDataJson = userData ? JSON.parse(userData) : null;
    return userDataJson?.userType || null;
  }
  return userType;
};

