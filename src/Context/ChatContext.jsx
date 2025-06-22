import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatCount, setChatCount] = useState(0);

  async function unreadMessagesCount() {
    const token = localStorage.getItem("userToken");
    return (
      (
        await axios.get(
          `https://skilly.runasp.net/api/Chat/GetUnreadMessagesCount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      )?.data?.unreadMessages ?? 0
    );
  }

  useEffect(() => {
    unreadMessagesCount().then((count) => setChatCount(count));
  }, []);

  return (
    <ChatContext.Provider value={{ chatCount, setChatCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
