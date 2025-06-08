import { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";
import EmptyNotifications from "./EmptyNotifications";
import PropTypes from "prop-types";
import axios from "axios";
import SingleOffer from "../Offers/SingleOffer";
import { getUserType } from "../../utils/hooks/getUserType";

const NotificationsModal = ({ isOpen, onClose, onCountChange }) => {
  const token = localStorage.getItem("userToken");
  const userType = getUserType();
  const [notifications, setNotifications] = useState([]);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const getallNotifications = () => {
    axios
      .get("https://skilly.runasp.net/api/Notification/GetUserNotifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data.notifications);
        setNotifications(res.data.notifications);
        updateUnreadCount(res.data.notifications);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
      });
  };

  const updateUnreadCount = (notificationsList) => {
    const unreadCount = notificationsList.filter((n) => !n.isRead).length;
    onCountChange?.(unreadCount);
  };

  const handleMarkAsRead = (id) => {
    axios
      .put(
        `https://skilly.runasp.net/api/Notification/mark-as-read-By/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        updateUnreadCount(
          notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((err) => {
        console.error("Failed to mark notification as read:", err);
      });
  };

  useEffect(() => {
    if (isOpen) getallNotifications();

    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  const handleDeleteNotification = (id) => {
    axios
      .delete(
        `https://skilly.runasp.net/api/Notification/Delete-Notification-By/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        const updatedNotifications = notifications.filter(
          (notification) => notification.id !== id
        );
        setNotifications(updatedNotifications);
        updateUnreadCount(updatedNotifications);
      })
      .catch((err) => {
        console.error("Failed to delete notification:", err);
      });
  };

  const handleModalClick = (e) => e.stopPropagation();

  const handleViewOffer = (offerId) => {
    setSelectedOfferId(offerId);
    setIsOffersModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#0000009d] bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] max-w-xl flex flex-col transition-all transform animate-fadeIn"
        style={{ minHeight: "350px", maxHeight: "70vh" }}
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-b-gray-300">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-sky-500 mx-auto">
            الاشعارات
          </h1>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {notifications.length > 0 ? (
            <div className="flex flex-col gap-4">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  content={notification.body}
                  offerId={notification.serviceId}
                  isRead={notification.isRead}
                  onDelete={handleDeleteNotification}
                  onViewOffer={handleViewOffer}
                  onMarkAsRead={handleMarkAsRead}
                  userType={userType}
                />
              ))}
            </div>
          ) : (
            <EmptyNotifications />
          )}
        </div>
      </div>

      {isOffersModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsOffersModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOffersModalOpen(false)}
              className="absolute top-2 right-5 text-gray-500 text-xl"
            >
              &times;
            </button>

            <SingleOffer offerId={selectedOfferId} />
          </div>
        </div>
      )}
    </div>
  );
};

NotificationsModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCountChange: PropTypes.func,
};

export default NotificationsModal;
