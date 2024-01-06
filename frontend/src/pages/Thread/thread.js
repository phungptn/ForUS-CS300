import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { Pagination, formatDateToDDMMYYYY } from "./UserControl/usercontrol";
import CommentCard from "./CommentCard/commentcard";
import { ThreadContext } from "./context";
import { checkModerator } from "../../utils/checkModerator";
import Threadcard from "./ThreadCard/threadcard";
import './thread.css';
import CommentSection from "./CommentSection/CommentSection";

export default function Thread() {
    const location = useLocation();
    const navigate = useNavigate();
    let thread_id = useParams().thread_id;
    let page = useParams().page;

    if (page == null) {
        page = 1;
    } 
    else {
        page = parseInt(page);
        if (page < 2) {
            navigate(`/thread/${thread_id}`, { replace: true });
        }
    }

    const [thread, setThread] = useState({});
    const [autoRedirect, setAutoRedirect] = useState(false);

    async function getThread() {
        try {
            const response = await instance.get(`/thread/${thread_id}/${page}`);   
            console.log(response.data);
            if (response.status === 200) {
                setThread(response.data.thread);
                if (page > 1 && response.data.thread.pageCount === 0) {
                    navigate(`/thread/${thread_id}`, { replace: true });
                }
            } 
        } 
        catch (e) {
            console.log(e);
            navigate("/404", { replace: true });
        }
    } 

    useEffect(() => {
        if (autoRedirect) {
            if (page > 1) {
                navigate(`/thread/${thread_id}/${page - 1}`, { replace: true });
            } else {
                navigate(-1, { replace: true });
            }
        }
    }, [autoRedirect]);

    useEffect(() => {
        getThread();
    }, [location.key]);

    const [replyToComment, setReplyToComment] = useState(null);

    const handleReplyClick = (comment) => {
        setReplyToComment(comment);
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        {/* Thread title */}
                        <div className="d-flex justify-content-between pb-2">
                            <h3 className="text-white">{thread.title}</h3>
                        </div>
                        
                        {/* Author and date */}
                        <div className="d-flex py-2 text-transwhite" style={{ fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>
                            <i className="bi bi-person"></i>
                            <span className="ms-2">{thread.author && thread.author.fullname}</span>
                            <i class="bi bi-dot ms-1"></i>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-clock"></i>
                                <span className="ms-1">{thread.createdAt && formatDateToDDMMYYYY(thread.createdAt)}</span>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="d-flex py-2">
                            <Pagination thread={thread} page={page} />
                        </div>

                        {/* Thread body */}
                        {thread.author && thread.author._id && (
                            <ThreadContext.Provider value={{ thread, setThread, setAutoRedirect }}>
                                <Threadcard thread={thread} />
                            </ThreadContext.Provider>
                        )}

                        {/* Comments */}
                        {thread.comments && thread.comments.map((comment) => (
                            <ThreadContext.Provider value={{ thread, setThread, setAutoRedirect }}>
                                <CommentCard key={comment._id} comment={comment} onReplyClick={handleReplyClick}/>
                            </ThreadContext.Provider>
                        ))}

                        {/* Pagination */}
                        <div className="d-flex justify-content-end py-2">
                            <Pagination thread={thread} page={page} />
                        </div>


                        {/* Post comment */}
                        {thread.currentUser && thread.currentUser._id && (
                            <CommentSection thread={thread} replyTo={replyToComment} setReplyToComment={setReplyToComment}/>
                        )}
                        
                    </div>
                    <div className="col-4 text-start">
                        {/* <div className="card rounded-3 shadow-sm bg-primary">
                            <BoxContext.Provider value={{ box, setBox, moderatorStatus }}>
                                <BoxDescription box={box}/>
                                <BoxControl />
                            </BoxContext.Provider>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
}