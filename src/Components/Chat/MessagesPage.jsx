import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Divider from "./Divider";
import { formatArabicTime } from "../../utils/dateUtils";
import { useUserType } from "../../utils/hooks/useUserType";
import axios from "axios";
import Loading from "../Loading/Loading";
import { useChat } from "../../Context/ChatContext";
const MessagesPage = () => {
  const navigate = useNavigate();
  const userType = useUserType();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (!token || !userData) {
          setError("يرجى تسجيل الدخول أولاً");
          return;
        }

        // Fetch chats
        const chatsResponse = await axios.get(
          "https://skilly.runasp.net/api/Chat/GetChatsForUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // const chatsData = chatsResponse.data.data;
        if (chatsResponse.data.status === "success") {
          const chatsData = chatsResponse.data.data;
          const processedChats = chatsData.map((chat) => {
            const isCurrentUserFirst = userData.id === chat.firstUserId;
            const otherUserName = isCurrentUserFirst
              ? chat.secondUserName
              : chat.firstUserName;
            const otherUserImg = isCurrentUserFirst
              ? chat.secondUserImg
              : chat.firstUserImg;
            const otherUserId = isCurrentUserFirst
              ? chat.secondUserId
              : chat.firstUserId;

            return {
              id: chat.id,
              username: otherUserName ?? "مستخدم غير معروف",
              message: chat.lastMessage ?? "آخر رسالة",
              avatarUrl:
                otherUserImg ||
                "https://cdn.builder.io/api/v1/image/assets/TEMP/42b4dd3567b416fa17484e87d199c4c469070f73832ca08f0c0b5da31e673ac7?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
              timestamp: formatArabicTime(new Date(chat.lastUpdatedAt)),
              otherUserId: otherUserId,
            };
          });

          setChats(processedChats);
        }
      } catch (err) {
        if (err.response.status === 404) {
          setChats([]);
        } else {
          console.error("Error fetching data:", err);
          setError("حدث خطأ أثناء تحميل المحادثات");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    const url = userType === 1 ? "/serviceprovider" : `/user`;
    navigate(url);
  };

  const handleOpenSingleChat = (chatId, otherUserId) => {
    navigate(`/messages/${chatId}?userId=${otherUserId}`);
  };

  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center p-3 w-full bg-white dark:bg-gray-800">
      <div className="w-full max-w-[1000px] mb-2 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>العودة</span>
        </button>
        <h1 className="text-2xl font-bold text-sky-500 dark:text-sky-400">
          المحادثات
        </h1>
      </div>

      <article className="p-5 w-full bg-white dark:bg-gray-700 rounded-xl border border-black dark:border-gray-600 max-w-[1000px] shadow-md">
        <div className="flex flex-col items-end mb-4">
          <h2 className="mb-2 text-xl font-bold text-black dark:text-white text-right">
            جميع المحادثات
          </h2>
          <input
            type="search"
            placeholder="ابحث عن محادثة..."
            className="p-4 w-full text-lg text-right text-black dark:text-white bg-gray-100 dark:bg-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300 dark:focus:ring-sky-500 dark:placeholder:text-gray-400"
            dir="rtl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto max-h-[600px] flex flex-col py-4 rounded-xl border border-solid border-gray-200 dark:border-gray-600">
          {filteredChats.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              لا توجد محادثات
            </div>
          ) : (
            filteredChats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <div
                  className="flex flex-row-reverse gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  onClick={() =>
                    handleOpenSingleChat(chat.id, chat.otherUserId)
                  }
                >
                  <img
                    src={chat.avatarUrl}
                    alt={`${chat.username}'s avatar`}
                    className="object-cover shrink-0 aspect-square w-[50px] h-[50px] rounded-full"
                  />
                  <div className="flex flex-col flex-grow items-end">
                    <h3 className="text-base font-bold text-black dark:text-white text-right">
                      {chat.username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-full text-right">
                      {chat.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-400 whitespace-nowrap self-center">
                    {chat.timestamp}
                  </span>
                </div>
                {index < filteredChats.length - 1 && (
                  <Divider className="my-1" />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </article>
    </main>
  );
};

export default MessagesPage;
