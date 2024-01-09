// ThreadHistory.js
import React, { useState, useEffect } from "react";
import ThreadCard from "../Box/ThreadCard/threadcard"; // Update with the correct path
import { getThreadHistory } from "../../api/user"; // Update with the correct API function

const ThreadHistory = () => {
  const [threadHistory, setThreadHistory] = useState([]);

  useEffect(() => {
    const fetchThreadHistory = async () => {
      try {
        const response = await getThreadHistory(); // Implement the API function to get thread history
        if (response.status === 200) {
          setThreadHistory(response.data.threadHistory);
        }
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchThreadHistory();
  }, []);

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
