import React from 'react';
import { useState } from "react";
import { instance } from "../../../api/config";

const CommentForm = ({ thread, replyTo }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event) => {
      setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
      if(newComment) {
          console.log('Submitting comment:', newComment);
          console.log('Thread ID:', thread._id);
          const response = await instance.post(`/thread/${thread._id}/comment`, { body: newComment, replyTo: replyTo });
          if (response.status === 201) {
              window.location.reload();
          }
          setNewComment(''); // Clear the input after submission
      }
  };
    return (
      <div className="d-flex flex-column align-items-end mt-2">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
        />
        <button
            type="button"
            className="btn mt-2 btn-warning text-primary"
            style={{ fontWeight: 'bold' }}
            onClick={handleCommentSubmit}
        >
            Post reply 
            <span className="ms-2"><i className="bi bi-reply"></i></span>
        </button>
      </div>
    );
  };
  

export default CommentForm;