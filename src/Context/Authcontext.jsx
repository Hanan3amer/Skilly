import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../utils/hooks/useCurrentUser";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userLogin, setUserLogin] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("userToken");
      const lastLogout = localStorage.getItem("lastLogout");
      
      if (token) {
        try {
          const userData = localStorage.getItem("userData");
          let user;
          
          if (userData) {
            const parsedUser = JSON.parse(userData);
            const lastSaved = parsedUser._lastSaved || 0;
            
            if (!lastLogout || lastSaved > parseInt(lastLogout)) {
              user = parsedUser;
              setUserLogin({ id: user.id });
            } else {
              try {
                user = await getCurrentUser();
                setUserLogin({ id: user.id });
              } catch (error) {
                console.error("Failed to get current user:", error);
                clearAuthData();
              }
            }
          } else {
            try {
              user = await getCurrentUser();
              setUserLogin({ id: user.id });
            } catch (error) {
              console.error("Failed to get current user:", error);
              clearAuthData();
            }
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          clearAuthData();
        }
      }
      
      setIsInitializing(false);
    };
    
    initializeAuth();
  }, []);
  
  const clearAuthData = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    localStorage.removeItem("providerData");
    setUserLogin(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userLogin, 
      setUserLogin, 
      isInitializing,
      clearAuth: clearAuthData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
