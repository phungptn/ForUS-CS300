import './threadcard.css';

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
                            {thread.title}
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
                        <div className="d-flex justify-content-between align-items-end mt-3">
                            <div className="text-muted">
                                {/* Format the score or other relevant information */}
                                {`Score: ${thread.score}`} 
                            </div>
                            <div className="d-flex gap-2">
                                {/* Include your upvote and downvote components here */}
                                {/* <UpVoteComponent /> */}
                                {/* <DownVoteComponent /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}