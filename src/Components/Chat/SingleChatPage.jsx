import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ChatInput from "./ChatInput";
import axios from "axios";
import Loading from "../Loading/Loading";
import { formatArabicTime } from "../../utils/dateUtils";
import * as signalR from "@microsoft/signalr";

const SingleChatPage = () => {
  const { id: chatId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const connectionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("غير متصل");
  const [contact, setContact] = useState({
    id: searchParams.get("userId"),
    username: "جاري التحميل...",
    avatarUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/42b4dd3567b416fa17484e87d199c4c469070f73832ca08f0c0b5da31e673ac7?placeholderIfAbsent=true&apiKey=d8a8fe7915e44c6c92bb9b107a5f642c",
  });

  const markMessagesAsRead = useCallback(async (messageIds) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const idsToProcess = Array.isArray(messageIds)
        ? messageIds
        : [messageIds];
      for (const messageId of idsToProcess) {
        await axios.post(
          "https://skilly.runasp.net/api/Chat/MarkMessageAsRead",
          {
            MessageId: messageId.toString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      setMessages((prev) =>
        prev.map((msg) =>
          idsToProcess.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const unreadMessages = messages.filter(
      (msg) => !msg.isCurrentUser && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map((msg) => msg.id);
      markMessagesAsRead(unreadIds);
    }
  }, [messages, markMessagesAsRead]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (!token || !userData.id) {
      setError("يرجى تسجيل الدخول أولاً");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://skilly.runasp.net/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on(
      "ReceiveMessage",
      (senderId, content, imageUrl, messageId, timestamp) => {
        console.log(
          "Received message:",
          senderId,
          content,
          imageUrl,
          messageId
        );

        const newMessage = {
          id: messageId,
          content: content,
          timestamp: formatArabicTime(new Date(timestamp)),
          isCurrentUser: senderId === userData.id,
          senderName:
            senderId === userData.id
              ? userData.firstName + " " + userData.lastName
              : contact.username,
          receiverName:
            senderId === userData.id
              ? contact.username
              : userData.firstName + " " + userData.lastName,
          img: imageUrl || null,
          isRead: senderId === userData.id,
        };

        setMessages((prev) => [...prev, newMessage]);
        if (senderId !== userData.id) {
          markMessagesAsRead([messageId]);
        }
      }
    );

    // إضافة حدث لتحديث حالة القراءة
    connection.on("MessageRead", (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    connection.onreconnecting(() => {
      console.log("SignalR reconnecting");
      setConnectionStatus("جاري إعادة الاتصال...");
    });

    connection.onreconnected(() => {
      console.log("SignalR reconnected");
      setConnectionStatus("متصل");
    });

    connection.onclose(() => {
      console.log("SignalR connection closed");
      setConnectionStatus("غير متصل");
    });

    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
        setConnectionStatus("متصل");

        if (chatId) {
          console.log("Joining chat:", chatId);
          connection
            .invoke("JoinChat", chatId)
            .then(() => console.log("Joined chat:", chatId))
            .catch((err) => console.error("Error joining chat:", err));
        }
      })
      .catch((err) => {
        console.error("SignalR Connection Error:", err);
        setConnectionStatus("فشل الاتصال");
      });

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [chatId, contact.username, markMessagesAsRead]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const userData = JSON.parse(localStorage.getItem("userData"));

        if (!token || !userData) {
          setError("يرجى تسجيل الدخول أولاً");
          return;
        }

        const response = await axios.get(
          `https://skilly.runasp.net/api/Chat/GetMessagesForChatOfUser/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          const messagesData = response.data.data;

          const processedMessages = messagesData.map((message) => ({
            id: message.id,
            content: message.content,
            timestamp: formatArabicTime(new Date(message.timestamp)),
            isCurrentUser: message.senderId === userData.id,
            senderName: message.senderName,
            receiverName: message.receiverName,
            img: message.imageUrl || null,
            isRead: message.isRead,
          }));

          setMessages(processedMessages);

          const otherUser =
            messagesData[0]?.senderId === userData.id
              ? {
                  name: messagesData[0]?.receiverName,
                  id: messagesData[0]?.receiverId,
                  avatar: messagesData[0]?.receiverImg,
                }
              : {
                  name: messagesData[0]?.senderName,
                  id: messagesData[0]?.senderId,
                  avatar: messagesData[0]?.senderImg,
                };

          setContact((prev) => ({
            ...prev,
            id: otherUser.id || prev.id,
            avatarUrl: otherUser.avatar || prev.avatarUrl,
            username: otherUser.name || "مستخدم غير معروف",
          }));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("حدث خطأ أثناء تحميل الرسائل");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async (content, file = null) => {
    try {
      const token = localStorage.getItem("userToken");
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!token || !userData) {
        setError("يرجى تسجيل الدخول أولاً");
        return;
      }

      const formData = new FormData();
      formData.append("ChatId", chatId);
      formData.append("ReceiverId", contact.id);
      if (content) formData.append("Content", content);

      if (file) {
        console.log("Appending file:", file.name, file.type, file.size);
        formData.append("Img", file);
      }

      const response = await axios.post(
        "https://skilly.runasp.net/api/Chat/SendMessage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.id) {
        const newMessage = {
          id: response.data.id,
          content: content,
          timestamp: formatArabicTime(new Date()),
          isCurrentUser: true,
          senderName: userData.firstName + " " + userData.lastName,
          receiverName: contact.username,
          img: file ? URL.createObjectURL(file) : null,
          isRead: false,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("حدث خطأ أثناء إرسال الرسالة");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    navigate("/messages");
  };

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
    <main className="flex flex-col items-center p-3 w-full bg-white dark:bg-gray-800 min-h-screen">
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

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          {connectionStatus}
        </div>
      </div>

      <article
        className="p-5 w-full bg-white dark:bg-gray-700 rounded-xl border border-black dark:border-gray-600 max-w-[1000px] shadow-md flex flex-col"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="flex gap-3 items-center justify-end border-b border-gray-200 dark:border-gray-500 pb-3 mb-3">
          <div className="flex gap-3 items-center">
            <div className="text-right">
              <h2 className="text-xl font-bold text-black dark:text-white">
                {contact.username}
              </h2>
              <div className="text-xs text-green-500 dark:text-green-400 mt-1">
                متصل الآن
              </div>
            </div>
            <img
              src={contact.avatarUrl}
              alt={`${contact.username} profile`}
              className="object-cover w-12 h-12 rounded-full border-2 border-green-500"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 p-2">
          {messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              لا توجد رسائل
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.isCurrentUser
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[70%] ${
                    message.isCurrentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3 ${
                      message.isCurrentUser
                        ? "bg-sky-100 dark:bg-sky-800 dark:text-white"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  >
                    {message.content && (
                      <p className="text-sm text-right" dir="rtl">
                        {message.content}
                      </p>
                    )}

                    {message.img && (
                      <div className="mt-2 max-w-full">
                        {message.img.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={message.img}
                            className="rounded-lg max-h-[200px] object-contain"
                            controls
                          />
                        ) : message.img.match(/\.pdf$/i) ? (
                          <a
                            href={message.img}
                            target="_blank"
                            rel="noreferrer"
                            className="block mt-2 text-sky-500 hover:text-sky-600 transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            فتح ملف PDF
                          </a>
                        ) : (
                          <img
                            src={message.img}
                            alt="Attached image"
                            className="rounded-lg max-h-[200px] object-contain cursor-pointer"
                            onClick={() => window.open(message.img, "_blank")}
                          />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {message.timestamp}
                      </span>

                      {message.isCurrentUser && (
                        <div className="flex items-center gap-1">
                          {message.isRead ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              مقروءة
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">مرسلة</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSubmit={handleSendMessage} allowImages={true} />
      </article>
    </main>
  );
};

export default SingleChatPage;
