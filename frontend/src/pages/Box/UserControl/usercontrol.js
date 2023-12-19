import { instance } from "../../../api/config";
import { useContext, useState } from "react";
import { BoxContext } from "../context";

async function upvoteThread(box, setBox, thread_id) {
    const response = await instance.put(`/thread/${thread_id}/upvote`);
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

async function downvoteThread(box, setBox, thread_id) {
    const response = await instance.put(`/thread/${thread_id}/downvote`);
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
    console.log(thread.thread);
    return (
        <div class="d-flex">
            <i 
                class="bi bi-arrow-up-circle"
                onClick={() => upvoteThread(box, setBox, thread._id)}/>
            <div class="border-start border-end">{thread.score}</div>
            <i 
                class="bi bi-arrow-down-circle"
                onClick={() => downvoteThread(box, setBox, thread._id)}/>
        </div>
    );
}