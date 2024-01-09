// ThreadHistory.js
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ThreadCard from "../Box/ThreadCard/threadcard"; // Update with the correct path
import { getThreadHistory } from "../../api/user"; // Update with the correct API function

const ThreadHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [threadHistory, setThreadHistory] = useState([]);

  useEffect(() => {
    const fetchThreadHistory = async () => {
      try {
        // Replace with your actual API function and parameters
        const response = await getThreadHistory(user_id);

        if (response.status === 200) {
          setThreadHistory(response.data.threadHistory);
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchThreadHistory();
  }, [user_id, location.key]); // Include user_id in the dependency array

  return (
    <div>
      <h1 className="mb-3 text-white">Thread History</h1>
      {threadHistory.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} search={false} />
      ))}
    </div>
  );
};

const CommentHitory = () => {};

export default ThreadHistory;
