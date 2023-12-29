import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { Pagination } from "./UserControl/usercontrol";
import CommentCard from "./CommentCard/commentcard";
import { ThreadContext } from "./context";
import { checkModerator } from "../../utils/checkModerator";
import Threadcard from "./ThreadCard/threadcard";

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

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <div className="d-flex justify-content-between pb-2">
                            <h3 className="text-white">{thread.title}</h3>
                        </div>
                        <div className="d-flex py-2">
                            <Pagination thread={thread} page={page} />
                        </div>
                        <Threadcard thread={thread} />
                        {thread.comments && thread.comments.map((comment) => (
                            <ThreadContext.Provider value={{ thread, setThread, setAutoRedirect }}>
                                <CommentCard comment={comment}/>
                            </ThreadContext.Provider>
                        ))}
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