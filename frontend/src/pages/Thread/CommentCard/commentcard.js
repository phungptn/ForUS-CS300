import './commentcard.css';
import { CommentHorizontalVoteBar } from '../UserControl/usercontrol';
import { useEffect, useState } from "react";
import { downloadImage } from "../../../utils/loadImage";
import { getTimePassed } from '../../../utils/getTimePassed';
import TextRenderer from '../../Text/renderer';
import { DeleteCommentButton, UpdateCommentButton } from '../UserControl/usercontrol';

export default function ({ comment, onReplyClick }) {
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + comment.author.avatarUrl);
            setProfilePicture(url);
        }
        getProfilePicture();
    }, []);
    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body m-0">
                <div className="row m-0 p-0 flex-grow-1">
                    <div className="col-2 d-flex flex-column align-items-center text-center">
                        <img className="rounded-circle centered-and-cropped bg-dark" width={100} height={100} src={
                            profilePicture ? profilePicture : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                        } alt="avatar"/>
                        <div className="username mt-2">
                            {comment.author && comment.author.fullname}
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column justify-content-between">
                        <div className="row-12 d-flex justify-content-between m-1">
                            <div className="text-white opacit-70">
                                <i className="bi bi-clock"></i>
                                {' '}
                                {getTimePassed(comment.createdAt)}
                            </div>
                            <div className="d-flex justify-content-between">
                                {comment.isUpdater == 1 ? (
                                    <UpdateCommentButton comment={comment}/>
                                ) : null}
                                {comment.isDeleter == 1 ? (
                                    <DeleteCommentButton comment={comment}/>
                                ) : null}
                            </div>
                        </div>

                        <div className="border-top w-100 m-1"></div>

                        {/* Display replyTo information */}
                        {comment.replyTo ? (
                            <div className="mt-2" style={{ border: '1px solid #46A5FA', padding: '10px', borderRadius: '8px', backgroundColor: '#07457D', textAlign: 'left' }}>
                                <div style={{ color: '#FF944D', fontWeight: 'bold' }}>
                                    {comment.replyTo && comment.replyTo.author && comment.replyTo.author.fullname}
                                    {' '} said:
                                </div>
                                <TextRenderer input={comment.replyTo && comment.replyTo.body} />
                            </div>
                        ) : null}

                        {/* Display comment body */}
                        <TextRenderer input={comment.body}/>
                        <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                            <CommentHorizontalVoteBar comment={comment} />
                            <button
                                type="button"
                                className="btn text-white"
                                style={{ fontWeight: 'bold' }}
                                onClick={() => {
                                    onReplyClick(comment)
                                    console.log('Replying to comment:', comment)
                                }}
                            >
                                <span className="ms-2"><i className="bi bi-reply"></i></span>
                                {' '} Reply 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}