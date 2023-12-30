import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// Import CommentForm at the top of your CommentSection file
import CommentForm from './CommentForm'; // Update the path based on your file structure

// Inside your CommentSection component
const CommentSection = ({ thread, page }) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    // Add logic to submit the new comment (e.g., make an API request)
    // After successful submission, you may want to update the thread state
    // and clear the new comment input.
    console.log('Submitting comment:', newComment);
    setNewComment(''); // Clear the input after submission
  };

    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body p-4">
                <div className="row m-0 p-0">
                    <div className="col-2">
                        <div className="avatar-container">
                            {/* Assuming you have an 'avatar' field in the thread.author object */}
                            {/* <img src={thread.author.avatar} alt="User Avatar" className="avatar" /> */}
                        </div>
                        <div className="username text-center mt-2">
                            {thread.author && thread.author.fullname}
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column justify-content-between">
                        <div className="card-title m-0">
                            <CommentForm
                                value={newComment}
                                onChange={handleCommentChange}
                                onSubmit={handleCommentSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;