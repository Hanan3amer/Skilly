import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatCount, setChatCount] = useState(0);

  return (
    <ChatContext.Provider value={{ chatCount, setChatCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
