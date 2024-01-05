import React from 'react';
import CommentForm from './commentform';

export default function CommentSection({ thread, page, replyTo, setReplyToCommentId }) {
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
                                thread = {thread}
                                replyTo = {replyTo}
                                setReplyToCommentId = {setReplyToCommentId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};