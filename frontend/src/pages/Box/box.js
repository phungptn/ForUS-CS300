import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {  useEffect, useState } from "react";
import { instance } from "../../api/config";
import { BoxDescription, CreateThreadButton, Pagination, ThreadFilter } from "./UserControl/usercontrol";
import ThreadCard from "./ThreadCard/threadcard";
import { BoxContext } from "./context";
import { checkModerator } from "../../utils/checkModerator";
import { BoxControl } from "./BoxManagement/boxmanagement";
import { SearchBar } from "../Search/SearchBar/searchbar";
import { route } from "./route";

export default function Box() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let box_id = useParams().box_id;
    let page = useParams().page;
    const order = searchParams.get('order');
    const direction = searchParams.get('direction');
    console.log(order, direction);
    // NAND check
    if ((Boolean(order) && !Boolean(direction)) || (!Boolean(order) && Boolean(direction))) {
        navigate(route(box_id, page), { replace: true });
    }
    if (page == null) {
        page = 1;
    }
    else {
        page = parseInt(page);
        if (page === 1) {
            navigate(route(box_id, null, order, direction), { replace: true });
        }
        else if (page < 1) {
            navigate(route(box_id), { replace: true });
        }
        
    }
    const [box, setBox] = useState({});
    const [moderatorStatus, setModeratorStatus] = useState('user');
    const [autoRedirect, setAutoRedirect] = useState(false);
    async function getBox() {
        try {
            const response = await instance.get(route(box_id, page, order, direction));
            if (response.status === 200) {
                setBox(response.data.box);
                if (page > 1 && response.data.box.pageCount === 0) {
                    navigate(route(box_id), { replace: true });
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
                navigate(route(box_id, page - 1, order, direction), { replace: true });
            }
            else {
                navigate(-1, { replace: true });
            }
        }
    }, [autoRedirect]);
    useEffect(() => {
        getBox();
        checkModerator(box_id, setModeratorStatus);
    }, [location.key]);
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <div className="d-flex justify-content-between pb-2">
                            <h3 className="text-white">{box.name}</h3>
                            <CreateThreadButton box={box} />
                        </div>
                        <div className="py-2">
                            <SearchBar />
                        </div>
                        <div className="d-flex py-2 justify-content-between">
                            <Pagination box={box} page={page} order={order} direction={direction}/>
                            <ThreadFilter box={box} page={page} order={order} direction={direction}/>
                        </div>
                        {box.threads && box.threads.map((thread) => (
                            <BoxContext.Provider value={{ box, setBox, moderatorStatus, setAutoRedirect }}>
                                <ThreadCard thread={thread} search={false}/>
                            </BoxContext.Provider>
                        ))}
                    </div>
                    <div className="col-md-4 text-start">
                        <div className="card rounded-3 shadow-sm bg-primary">
                            <BoxContext.Provider value={{ box, setBox, moderatorStatus }}>
                                <BoxDescription box={box}/>
                                <BoxControl />
                            </BoxContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}