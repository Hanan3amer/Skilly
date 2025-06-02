import { useState, createContext, useContext } from "react";

const TypeContext = createContext();

export const TypeContextProvider = ({ children }) => {
  const [Value, setValue] = useState(() => {
    const storedValue = localStorage.getItem("userType");
    return storedValue === "1" ? "provider" : storedValue === "0" ? "user" : "";
  });

  return (
    <TypeContext.Provider value={{ Value, setValue }}>
      {children}
    </TypeContext.Provider>
  );
};

export const useTypeContext = () => useContext(TypeContext);
