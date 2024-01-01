import { getNotification } from "../../../api/user";
import { useEffect, useState } from "react";
import NotificationItem from "./notificationItem";
import "./notification.css";

import "./notification.css";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getNotification();
      console.log(response.data.notifications);
      setNotifications(response.data.notifications);

      setLoading(false);
    };

    fetchNotifications();
  }, []);

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
          {notifications.length > 0? (
                      <p className="position-absolute top-0 end-0 bg-danger text-white rounded-circle fw-bold f-13 w-24 h-24">
                      {notifications.length}
                    </p>
          ):(
            <></>
          ) }



        </button>

        {loading ? (
          <div className="list-group notification__loading dropdown" >

          </div>
        ) : (
          <ul className="dropdown-menu dropdown-menu-end notification__content bg-white">
            {notifications.map((notification) => (
              <li key={notification._id}>
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
