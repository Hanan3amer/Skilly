export function useUserType() {
  const userType = localStorage.getItem("userType") || "0";
  return +userType;
}
