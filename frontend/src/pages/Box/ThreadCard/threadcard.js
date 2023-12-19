import './threadcard.css';
import { HorizontalVoteBar } from '../UserControl/usercontrol';

export default function ( {thread} ) {
    return (
        <div class="card rounded-4 card-style my-4">
            <div class="card-body p-4">
                <div class="row m-0 p-0">
                    <div class="col-3 rounded-4 bg-dark ratio p-0 ratio-1x1 w-25 align-middle"/>
                    <div class="col-9 ps-4 pe-0">
                        <h4 class="row m-0 text-start">{thread.title}</h4>
                        <div class="row">
                            <HorizontalVoteBar thread={thread} />
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    );
}