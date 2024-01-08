import './threadcard.css';
import { useState, useEffect } from 'react';
import { HorizontalVoteBar, CommentsCounter, ThreadInformation, ReportThreadButton } from '../UserControl/usercontrol';
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
    }, [thread]);
    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body p-4">
                <div className="d-flex m-0 p-0">
                    <div className='rounded-4 bg-dark w-25 h-100 p-0 overflow-hidden' style={{aspectRatio: '1 / 1', flexShrink: 0}}>
                        {thread.imageUrl && <img className="centered-and-cropped w-100 h-100" src={thumbnail} />}
                    </div>
                    <div className="ps-4 pe-0 d-flex flex-column justify-content-between w-100">
                        <div className='d-flex justify-content-between'>
                            <a href={`/thread/${thread._id}`} className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" style={{wordBreak: 'break-word'}}>
                                <h4 className="text-start text-white m-0">{thread.title}</h4>
                            </a>
                            <div>
                                <ReportThreadButton thread={thread} />
                                {!search && <DeleteThreadButton thread={thread} />}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between flex-wrap">
                            <ThreadInformation thread={thread} />
                            <div className="py-2 ms-2 d-flex flex-row justify-content-stretch gap-5">
                                <CommentsCounter thread={thread} />
                                <HorizontalVoteBar thread={thread} />
                            </div>
                        </div>
                        
                    </div>
                </div>
               
            </div>
        </div>
    );
}