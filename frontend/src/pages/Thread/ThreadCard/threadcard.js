import './threadcard.css';
import { ThreadHorizontalVoteBar } from '../UserControl/usercontrol';

export default function ( {thread} ) {
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
                        <div className="d-flex justify-content-between">
                            <div className="text-start text-muted">
                                {/* Format the timestamp as needed */}
                                {thread.createdAt}
                            </div>
                        </div>
                        <div className='card-title m-0'>
                            <h4 className="text-start">{thread.body}</h4>
                        </div>
                        <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                            <ThreadHorizontalVoteBar thread={thread} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}