import './threadcard.css';
import { ThreadHorizontalVoteBar } from '../UserControl/usercontrol';
import { getTimePassed } from '../../../utils/getTimePassed';
import { useEffect, useState } from "react";
import { downloadImage } from "../../../utils/loadImage";

export default function ( {thread} ) {
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + thread.author.avatarUrl);
            console.log(thread.author.avatarUrl);
            console.log(url);
            setProfilePicture(url);
        }
        getProfilePicture();
    }, []);
    return (       
        <div className="card rounded-4 card-style my-4">
            <div className="card-body m-0">
                <div className="row m-0 p-0 flex-grow-1">
                    <div className="col-2 d-flex flex-column align-items-center">
                        <img className="rounded-circle centered-and-cropped bg-dark my-auto" width={100} height={100} src={
                            profilePicture ? profilePicture : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                        } alt="avatar"/>
                        <div className="username mt-2">
                            {thread.author && thread.author.fullname}
                        </div>
                    </div>
                    <div className="col-10 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between m-1">
                            <div className="text-white opacit-70">
                                <i className="bi bi-clock"></i>
                                {' '}
                                {getTimePassed(thread.createdAt)}
                            </div>
                        </div>
                        <div className="border-top w-100 m-1"></div>
                        <h4 className="text-start m-1">{thread.body}</h4>
                        <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                            <ThreadHorizontalVoteBar thread={thread} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}