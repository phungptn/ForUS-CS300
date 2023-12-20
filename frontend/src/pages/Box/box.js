import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { BoxDescription, CreateThreadButton, Pagination } from "./UserControl/usercontrol";
import ThreadCard from "./ThreadCard/threadcard";
import { BoxContext } from "./context";
import { checkAdmin } from "../../utils/checkAdmin";
import { BoxControl } from "./AdminControl/admincontrol";

export default function Box() {
    const navigate = useNavigate();
    let box_id = useParams().box_id;
    let page = useParams().page;
    if (page == null) {
        page = 1;
    }
    else {
        page = parseInt(page);
        if (page < 2) {
            navigate(`/box/${box_id}`, { replace: true });
        }
    }
    const [box, setBox] = useState({});
    const [adminStatus, setAdminStatus] = useState(false);
    async function getBox() {
        try {
            const response = await instance.get(`/box/${box_id}/${page}`);
            if (response.status === 200) {
                setBox(response.data.box);
            }
        }
        catch (e) {
            console.log(e);
            navigate("/404", { replace: true });
        }
    }
    useEffect(() => {
        getBox();
        checkAdmin(setAdminStatus);
    }, []);
    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-8">
                        <div class="d-flex justify-content-between pb-2">
                            <h3 class="text-white">{box.name}</h3>
                            <CreateThreadButton box_id={box_id} />
                        </div>
                        <div class="d-flex py-2">
                            <Pagination box={box} page={page} />
                        </div>
                        {box.threads && box.threads.map((thread) => (
                            <BoxContext.Provider value={{ box, setBox }}>
                                <ThreadCard thread={thread} />
                            </BoxContext.Provider>
                        ))}
                    </div>
                    <div class="col-4 text-start">
                        <div className="card rounded-3 shadow-sm bg-primary">
                            <BoxContext.Provider value={{ adminStatus }}>
                                <BoxDescription box={box}/>
                                <BoxControl box={box}/>
                            </BoxContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}