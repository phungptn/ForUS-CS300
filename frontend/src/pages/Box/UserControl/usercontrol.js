import { instance } from "../../../api/config";
import { useContext, useState } from "react";
import { BoxContext } from "../context";
import './usercontrol.scss';

async function voteThread(box, setBox, thread_id, vote) {
    const response = await instance.put(`/thread/${thread_id}/${vote}`);
    if (response.status === 200) {
        setBox(
            {
                ...box,
                threads: box.threads.map((thread) => {
                    if (thread._id === thread_id) {
                        let d = response.data.voteStatus - thread.voteStatus;
                        thread.voteStatus = response.data.voteStatus;
                        thread.score += d;
                    }
                    return thread;
                })
            }
        );
    }
}

export function HorizontalVoteBar({ thread }) {
    const { box, setBox } = useContext(BoxContext);
    return (
        <div class="row rounded-4 border">
            <i 
                class={"col border-0 btn btn-upvote bi " + (thread.voteStatus === 1 ? "bi-arrow-up-circle-fill active" : "bi-arrow-up-circle")}
                onClick={() => voteThread(box, setBox, thread._id, 'upvote')}/>
            <div class="col border-start border-end w-75" style={{paddingBlock: '6px 6px'}}>{thread.score}</div>
            <i 
                class={"col border-0 btn btn-downvote bi " + (thread.voteStatus === -1 ? "bi-arrow-down-circle-fill active" : "bi-arrow-down-circle")}
                onClick={() => voteThread(box, setBox, thread._id, 'downvote')}/>
        </div>
    );
}

export function CommentsCounter({ thread }) {
    return (
        <div class="row rounded-4 border align-middle">
            <span class="my-auto">{thread.commentCount + " comments"}</span>
        </div>
    );
}

export function AuthorInfomation({ thread }) {
    return (
        <div class="d-flex justify-content-start py-1 gap-2">
            <img class="rounded-circle bg-dark" width={32} height={32}/>
            <div>{thread.author.fullname}</div>
        </div>
        
    );
}