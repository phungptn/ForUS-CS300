import { useEffect, useState } from "react";

export default function NotificationItem({ notification }) {
    // Calculate time difference between createdAt and now
    useEffect(() => {
        const createdAt = new Date(notification.createdAt);
        const now = new Date();
        const diff = now - createdAt;
        const diffInMinutes = Math.floor(diff / 1000 / 60);

        if (diffInMinutes < 60) {
            setDiff(diffInMinutes);
            setUnit("minute");
        } else if (diffInMinutes < 24 * 60) {
            setDiff(Math.floor(diffInMinutes / 60));
            setUnit("hour");
        } else if (diffInMinutes < 24 * 60 * 30) {
            setDiff(Math.floor(diffInMinutes / 60 / 24));
            setUnit("day");
        } else if (diffInMinutes < 24 * 60 * 30 * 12) {
            setDiff(Math.floor(diffInMinutes / 60 / 24 / 30));
            setUnit("month");
        } else {
            setDiff(Math.floor(diffInMinutes / 60 / 24 / 30 / 12));
            setUnit("year");
        }

        console.log(notification.isRead);
        const notificationItem = document.getElementById(notification._id);
        console.log(notificationItem);


        if (notification.isRead === true) {
            

                notificationItem.classList.add("read");
        
           
           
        }
    }, []);



    const [diff, setDiff] = useState(0);
    const [unit, setUnit] = useState("");


    
    return (


        <a href="#" class="dropdown-item list-group-item-action d-flex  gap-3 py-3 notificationItem  " id={notification._id} aria-current="true">
        <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0"></img>
        <div class="d-flex gap-2 w-100 justify-content-between">
          <div>
            <h6 class="mb-0">{notification.title}</h6>
            <p class="mb-0 opacity-75  ">{notification.body}.</p>
          </div>
          <small class="opacity-50 text-nowrap">{diff} {unit} ago</small>
        </div>
      </a>
    );
}