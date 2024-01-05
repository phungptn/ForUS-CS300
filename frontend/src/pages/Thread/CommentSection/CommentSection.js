import React from 'react';
import CommentForm from './CommentForm';
import TextRenderer from '../../Text/renderer';

export default function CommentSection({ thread, replyTo, setReplyToComment }) {
    const handleClearReply = () => {
        setReplyToComment(null);
    };
    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body p-4">
                <div className="row m-0 p-0">
                    {/* Display avatar and username */}
                    <div className="col-2">
                        <div className="avatar-container">
                            {/* Assuming you have an 'avatar' field in the thread.author object */}
                            {/* <img src={thread.author.avatar} alt="User Avatar" className="avatar" /> */}
                        </div>
                        <div className="username text-center mt-2">
                            {thread.author && thread.author.fullname}
                        </div>
                    </div>

                    {/* Display comment body */}
                    <div className="col-10 d-flex flex-column justify-content-between">
                        <div className="card-title m-0">
                            {/* Display replyTo information */}
                            {replyTo ? (
                                <div className='p-2 rounded-2' style={{ border: '1px solid #46A5FA'}}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-white" style={{ fontWeight: 'bold', textAlign: 'left' }}> Reply to: </div>
                                        <button className="btn btn-link" onClick={handleClearReply} style={{ color: '#FFFFFF' }}>
                                            x
                                        </button>
                                    </div>
                                    <div className="mt-2" style={{ border: '1px solid #46A5FA', padding: '10px', borderRadius: '8px', backgroundColor: '#07457D', textAlign: 'left' }}>
                                        <div style={{ color: '#FF944D', fontWeight: 'bold' }}>
                                            {replyTo.author && replyTo.author.fullname}
                                            {' '} said:
                                        </div>
                                        <TextRenderer input={replyTo && replyTo.body} />
                                    </div>
                                </div>
                            ) : null}
                            <span className="text-white" style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px' }}>Comment</span>
                            <CommentForm
                                thread = {thread}
                                replyTo = {replyTo && replyTo._id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};