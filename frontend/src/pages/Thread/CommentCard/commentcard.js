import './commentcard.css';
import { HorizontalVoteBar, CommentInformation } from '../UserControl/usercontrol';
// import { DeleteThreadButton } from '../ModeratorControl/moderatorcontrol';

export default function ( {comment} ) {
    return (
        <div className="card rounded-4 card-style my-4">
            <div className="card-body p-4">
                <div className="row m-0 p-0">
                    <div className="col-3 rounded-4 bg-dark ratio p-0 ratio-1x1 w-25 align-middle"/> 
                    <div className="col-9 ps-4 pe-0 d-flex flex-column justify-content-between">
                        <div className='card-title m-0 row justify-content-between'>
                            <h4 className="col text-start text-white m-0">{comment.body}</h4>
                            {/* <DeleteThreadButton thread={thread}/> */}
                        </div>
                        <div className="d-flex justify-content-between">
                            <CommentInformation comment={comment} />
                            <div className="py-2 px-0 m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
                                <HorizontalVoteBar comment={comment} />
                            </div>
                        </div>
                        
                    </div>
                </div>
               
            </div>
        </div>
    );
}