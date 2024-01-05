import './threadcard.css';
import { ThreadHorizontalVoteBar } from '../UserControl/usercontrol';
import { getTimePassed } from '../../../utils/getTimePassed';
import { useEffect, useState } from "react";
import { downloadImage } from "../../../utils/loadImage";
import TextRenderer from '../../Text/renderer';
import { UpdateThreadButton, DeleteThreadButton } from '../UserControl/usercontrol';

export default function ( {thread} ) {
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + thread.author.avatarUrl);
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
                            {thread.author && thread.author.fullname}
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column justify-content-between">
                        <div className=" row-12 d-flex justify-content-between m-1">
                            <div className="text-white opacit-70">
                                <i className="bi bi-clock"></i>
                                {' '}
                                {getTimePassed(thread.createdAt)}
                                
                            </div>
                            <div className="ms-auto">
                                {thread.isUpdater == 1 ? (
                                    <UpdateThreadButton thread={thread}/>
                                ) : null}
                                {thread.isDeleter == 1 ? (
                                    <DeleteThreadButton thread={thread}/>
                                ) : null}
                            </div>
                        </div>

                        <div className="border-top w-100 m-1"></div>
                        <TextRenderer threadId={thread._id} input={thread.body}/>
                        <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                            <ThreadHorizontalVoteBar thread={thread} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}