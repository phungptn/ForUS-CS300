import React, {useEffect, useState} from "react";

import {instance} from "../../../api/config";

export default function NewsItem({notification}) {
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('en-US', {
          month: 'short',
        });
      }

    return (
        <div className="row mb-4 rounded-3 bg-primary ">
            {/* Time creadted month/ day */}
            <div className="col-2 d-flex flex-column bg-dark rounded-3 align-items-center justify-content-center">
                {/* Month */}
                <div className="justify-content-center">
                    <h5 className="text-white">{getMonthName(notification.createdAt.slice(5, 7))}</h5>
            </div>
            <div className="justify-content-center">
                {/* Day */}
                <h5 className="text-info">{notification.createdAt.slice(8, 10)}</h5>
            </div>
                    
            </div>

            <div className="col-10">
                <h5 className=" text-white">{notification.title}</h5>
                <p className=" text-white">{notification.body}</p>
            </div>
        </div>
    )
}