import { getNotification } from "../../../api/user";
import { useEffect, useState } from "react";
import NotificationItem from "./notificationItem";
import Dropdown from "react-bootstrap/Dropdown";

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
  <button type="button" class="btn btn-dark  dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
  <i className="bi bi-bell-fill me-2"></i>
  </button>

  {loading ? (
          <div className="list-group notification__loading dropdown">
            {/* <CircularProgress /> */}
            <p>Loading...</p>
          </div>
        ) : (
          <ul className="dropdown-menu dropdown-menu-end notification__content bg-white">
            {notifications.map((notification) => (
              <li>
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

//     <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
//   <div class="list-group">
//     <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
//       <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
//       <div class="d-flex gap-2 w-100 justify-content-between">
//         <div>
//           <h6 class="mb-0">List group item heading</h6>
//           <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
//         </div>
//         <small class="opacity-50 text-nowrap">now</small>
//       </div>
//     </a>
//     <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
//       <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
//       <div class="d-flex gap-2 w-100 justify-content-between">
//         <div>
//           <h6 class="mb-0">Another title here</h6>
//           <p class="mb-0 opacity-75">Some placeholder content in a paragraph that goes a little longer so it wraps to a new line.</p>
//         </div>
//         <small class="opacity-50 text-nowrap">3d</small>
//       </div>
//     </a>
//     <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
//       <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
//       <div class="d-flex gap-2 w-100 justify-content-between">
//         <div>
//           <h6 class="mb-0">Third heading</h6>
//           <p class="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
//         </div>
//         <small class="opacity-50 text-nowrap">1w</small>
//       </div>
//     </a>
//   </div>
// </div>
