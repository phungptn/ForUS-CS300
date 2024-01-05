import './commentcard.css';
import { CommentHorizontalVoteBar } from '../UserControl/usercontrol';
import { useEffect, useState } from "react";
import { downloadImage } from "../../../utils/loadImage";
import { getTimePassed } from '../../../utils/getTimePassed';

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
                        <div className="d-flex justify-content-between m-1">
                            <div className="text-white opacit-70">
                                <i className="bi bi-clock"></i>
                                {' '}
                                {getTimePassed(comment.createdAt)}
                            </div>
                        </div>
                        <div className="border-top w-100 m-1"></div>
                        <h4 className="text-start m-1">{comment.body}</h4>
                        <div className="py-2 px-0 m-0 d-flex flex-row justify-content-end gap-2">
                            <CommentHorizontalVoteBar comment={comment} />
                            <button
                                type="button"
                                className="btn text-white"
                                style={{ fontWeight: 'bold' }}
                                onClick={() => {
                                    onReplyClick(comment._id)
                                    console.log('Replying to comment:', comment._id)
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