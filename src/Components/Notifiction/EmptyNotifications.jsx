"use client";
import emptyNotification from "../../assets/notification.png";
const EmptyNotifications = () => {
  return (
    <section className="flex flex-col justify-center items-center py-8">
      <img
        src={emptyNotification}
        alt="No notifications"
        className="w-[50%] max-w-md h-auto"
      />
    </section>
  );
};

export default EmptyNotifications;
