import '../card.css';
import React from 'react';
import CommentForm from './CommentForm';
import TextRenderer from '../../Text/renderer';
import { downloadImage } from '../../../utils/loadImage';
import { useEffect, useState } from 'react';

export default function CommentSection({ thread, replyTo, setReplyToComment }) {
    const handleClearReply = () => {
        setReplyToComment(null);
    };
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + thread.currentUser.avatarUrl);
            setProfilePicture(url);
        }
        getProfilePicture();
    }, []);
    return (
        <div className="card-body py-4 m-0">
            <div className="row m-0 p-0 flex-grow-1">
                {/* Display avatar and username */}
                <div className="col-2 bg-card-secondary round-left d-flex flex-column align-items-center text-center"
                    style={{ paddingTop: '20px', paddingLeft: '20px' }}
                >
                    <img className="rounded-circle centered-and-cropped bg-dark" width={100} height={100} src={
                        profilePicture ? profilePicture : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                    } alt="avatar"/>
                    <div className="username mt-2">
                        {thread.currentUser && thread.currentUser.fullname}
                    </div>
                </div>

                {/* Display comment body */}
                <div className="col-10 bg-card-primary round-right d-flex flex-column justify-content-between">
                    <div style={{ padding: '20px 20px' }}>
                        {/* Display replyTo information */}
                        {replyTo ? (
                            <div className='p-2 rounded-4' style={{ border: '1px solid #46A5FA'}}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-white" style={{ fontWeight: 'bold', textAlign: 'left' }}> Reply to: </div>
                                    <button className="btn btn-link" onClick={handleClearReply} style={{ color: '#FFFFFF' }}>
                                        x
                                    </button>
                                </div>
                                <div className="justify-content-between" style={{ border: '1px solid #46A5FA', borderRadius: '8px', backgroundColor: '#07457D', textAlign: 'left', color: 'rgba(255, 255, 255, 0.7)' }}>
                                    <div style={{ color: '#FF944D', fontWeight: 'bold', borderBottom: '1px solid #46A5FA', padding: '8px 20px' }}>
                                        {replyTo.author && replyTo.author.fullname}
                                        {' '} said:
                                    </div>
                                    <div style={{ padding: '20px 20px' }}>
                                        <TextRenderer input={replyTo && replyTo.body} />
                                    </div>
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
    );
};