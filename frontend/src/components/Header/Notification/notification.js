import { getNotification } from "../../../api/user";
import { infoUser } from "../../../api/user";
import { useEffect, useState } from "react";
import NotificationItem from "./notificationItem";
import { updateAllNotificationIsRead } from "../../../api/user";
import "./notification.css";

import "./notification.css";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getNotification();
      const userResponse = await infoUser();
      response.data.notifications.forEach((notification) => {
        let temp = userResponse.data.user.notifications.find(
          (n) => n.notification === notification._id
        );

        notification.isRead = temp.isRead;
      });

      setNotifications(response.data.notifications);

      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const response = await updateAllNotificationIsRead();
    console.log(response);
    if (response.data.success) {
      const updatedNotifications = notifications.map((notification) => {
        notification.isRead = true;
        return notification;
      });

      console.log(updatedNotifications);
      setNotifications(updatedNotifications);
    }
  };

  return (
    <>
      <div class="btn-group dropdown-center">
        <button
          type="button"
          className="btn btn-dark rounded-3"
          data-bs-toggle="dropdown"
          data-bs-display="static"
          aria-expanded="false"
        >
          <i className="bi bi-bell-fill me-2"></i>
          {notifications.length > 0 ? (
            <p className="position-absolute top-0 end-0 bg-danger text-white rounded-circle fw-bold f-13 w-24 h-24">
              {notifications.length}
            </p>
          ) : (
            <></>
          )}
        </button>

        {
          <ul className="dropdown-menu  dropdown-menu-md-end notification__content bg-white width-250"
          style={{minWidth: '20.5vw', maxHeight: '70vh', overflowY: 'auto'}}
          >
            <li>
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="dropdown-header">Notification</h1>
                <a href="/notification" className="pe-2">
                  See all notifications
                </a>
              </div>
            </li>

            {notifications.slice(0, 5).map((notification) => (
              <li key={notification._id}>
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                />
              </li>
            ))}

            {notifications.length === 0 ? (
              <li>
                <p className="text-center text-muted ">No notifications</p>
              </li>
            ) : (
              <li>
                <a
                  href="#"
                  className="dropdown-item   py-1 text-center notificationItem"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </a>
              </li>
            )}
          </ul>
        }
      </div>
    </>
  );
}
