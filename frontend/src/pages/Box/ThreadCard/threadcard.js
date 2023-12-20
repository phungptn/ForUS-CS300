import './threadcard.css';
import { HorizontalVoteBar, CommentsCounter, AuthorInfomation } from '../UserControl/usercontrol';

export default function ( {thread} ) {
    return (
        <div class="card rounded-4 card-style my-4">
            <div class="card-body p-4">
                <div class="row m-0 p-0">
                    <div class="col-3 rounded-4 bg-dark ratio p-0 ratio-1x1 w-25 align-middle"/>
                    <div class="col-9 ps-4 pe-0 d-flex flex-column justify-content-between">
                        <h4 class="m-0 text-start">{thread.title}</h4>
                        <div class="row">
                            <div class="col">
                                <AuthorInfomation thread={thread} />
                            </div>
                            <div class="col m-0 d-flex flex-row-reverse justify-content-stretch gap-5">
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