import { useState, useEffect, useRef } from "react";
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

    connection.on("ReceiveMessage", (senderId, content, imageUrl) => {
      console.log("Received message:", senderId, content, imageUrl);

      const newMessage = {
        id: Date.now(),
        content: content,
        timestamp: formatArabicTime(new Date()),
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
      };

      setMessages((prev) => [...prev, newMessage]);
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
  }, [chatId, contact.username]);

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
          }));

          setMessages(processedMessages);

          const otherUser =
            messagesData[0]?.senderId === userData.id
              ? { name: messagesData[0]?.receiverName }
              : { name: messagesData[0]?.senderName };
          const otherUserAvatar =
            messagesData[0]?.senderId === userData.id
              ? messagesData[0]?.receiverImg
              : messagesData[0]?.senderImg;

          setContact((prev) => ({
            ...prev,
            avatarUrl: otherUserAvatar,
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

      await axios.post(
        "https://skilly.runasp.net/api/Chat/SendMessage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    <main className="flex flex-col items-center p-3 w-full bg-white  min-h-screen">
      <div className="w-full max-w-[1000px] mb-2 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 text-sky-500 hover:text-sky-600  transition-colors"
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
      </div>

      <article
        className="p-5 w-full bg-white  rounded-xl border border-black  max-w-[1000px] shadow-md flex flex-col"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div className="flex gap-3 items-center justify-end border-b border-gray-200  pb-3 mb-3">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-bold text-black  text-right">
              {contact.username}
            </h2>
            <img
              src={contact.avatarUrl}
              alt={`${contact.username} profile`}
              className="object-cover w-12 h-12 rounded-full"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto mb-4 p-2">
          {messages.length === 0 ? (
            <div className="text-center py-4 text-gray-500 ">لا توجد رسائل</div>
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
                      message.isCurrentUser ? "bg-sky-100" : "bg-gray-100 "
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
                            className="block mt-2 text-sky-500 hover:text-sky-600 transition-colors"
                          >
                            فتح ملف PDF
                          </a>
                        ) : (
                          <img
                            src={message.img}
                            alt="Attached image"
                            className="rounded-lg max-h-[200px] object-contain"
                            onClick={() => window.open(message.img, "_blank")}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </div>
                    )}

                    <span className="text-xs text-gray-500  block mt-1 text-right">
                      {message.timestamp}
                    </span>
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
