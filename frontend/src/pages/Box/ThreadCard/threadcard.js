import './threadcard.css';
import { useState, useEffect } from 'react';
import { HorizontalVoteBar, CommentsCounter, ThreadInformation } from '../UserControl/usercontrol';
import { DeleteThreadButton } from '../ModeratorControl/moderatorcontrol';
import { downloadImage } from '../../../utils/loadImage';

export default function ( { thread, search } ) {
    const [thumbnail, setThumbnail] = useState(null);
    useEffect(() => {
        async function getThumbnail() {
            if (thread.imageUrl) {
                if (thread.imageUrl.startsWith('http')) {
                    setThumbnail(thread.imageUrl);
                }
                else {
                    try {
                        const url = await downloadImage(`/images/thread/${thread._id}/${thread.imageUrl}-thumbnail`);
                        setThumbnail(url);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
        }
        getThumbnail();
    }, []);
    console.log(thread);
    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body p-4">
                <div className="row m-0 p-0">
                    <div className='col-3 rounded-4 bg-dark w-25 p-0 overflow-hidden' style={{aspectRatio: '1 / 1'}}>
                        {thread.imageUrl && <img className="centered-and-cropped w-100 h-100" src={thumbnail} />}
                    </div>
                    <div className="col-9 ps-4 pe-0 d-flex flex-column justify-content-between">
                        <div className='card-title m-0 d-flex justify-content-between'>
                            <a href={`/thread/${thread._id}`} className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                                <h4 className="text-start text-white m-0">{thread.title}</h4>
                            </a>
                            {!search && <DeleteThreadButton thread={thread} />}
                        </div>
                        <div className="d-flex justify-content-between">
                            <ThreadInformation thread={thread} />
                            <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                                <HorizontalVoteBar thread={thread} />
                                <CommentsCounter thread={thread} />
                            </div>
                        </div>
                        
                    </div>
                </div>
               
            </div>
        </div>
    );
}