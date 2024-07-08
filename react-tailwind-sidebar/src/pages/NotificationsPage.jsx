import React, { useState } from "react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Service Reminder",
      message:
        "Kindly remind you that your car must be sent to the service center at 52000 kilometers on 20 May, 2024",
      status: "current",
    },
    {
      id: 2,
      title: "The All New E-Class",
      message:
        "Test the luxury and the power of the all new E-Class at out nearest store",
      status: "unread",
    },
    {
      id: 3,
      title: "Receipt",
      message:
        "Thanks for your payment. Here is your receipt for your last maintenance",
      status: "unread",
    },
    {
      id: 4,
      title: "Feedback",
      message:
        "Thanks for your feedback on the mechanic mentioned, we have undergone investigations on him",
      status: "unread",
    },
    {
      id: 5,
      title: "Policy Updates",
      message:
        "Latest policy updates for the website will be users need to enter their password in order to log in",
      status: "unread",
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(
    notifications[0]
  );

  const handleNotificationClick = (id) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) {
        return { ...notification, status: "current" };
      } else {
        return { ...notification, status: "unread" };
      }
    });
    setNotifications(updatedNotifications);

    const selected = notifications.find(
      (notification) => notification.id === id
    );
    setSelectedNotification(selected);
  };

  return (
    <>
      <div className="px-20 py-16 w-full h-full font-alata">
        <div className="font-bold text-4xl">Notifications</div>
        <div className="flex flex-row mt-8 gap-4">
          <div className="bg-white shadow-md bg-clip-border rounded-xl w-[33%] h-[32rem] overflow-y-auto no-scrollbar">
            {notifications.map((notification) => {
              let bgColor = "";
              switch (notification.status) {
                case "current":
                  bgColor = "#2dd4bf";
                  break;
                case "unread":
                  bgColor = "#F7F7F7";
                  break;
                default:
                  bgColor = "#F7F7F7";
              }

              return (
                <div
                  key={notification.id}
                  className="flex flex-col shadow-md bg-clip-border rounded-xl  my-3 mx-5 cursor-pointer"
                  style={{ backgroundColor: bgColor }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="p-3 mt-1">
                    <h5 className="block mb-1 text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                      {notification.title}
                    </h5>
                    <p
                      className={`w-full text-base antialiased${
                        notification.status === "unread"
                          ? "text-black"
                          : "text-white"
                      } leading-relaxed line-clamp-2 `}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white shadow-md bg-clip-border rounded-xl w-[56%] h-[32rem]">
            <div className="p-6">
              <h5 className="block mb-1 text-4xl antialiased font-semibold leading-snug tracking-normal">
                {selectedNotification.title}
              </h5>
              <p className={`block text-lg antialiased leading-relaxed w-full`}>
                {selectedNotification.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
