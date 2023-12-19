import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import BoxDescription from "./BoxDescription/boxdescription";
import CreateThreadButton from "./CreateThreadButton/createthreadbutton";
import ThreadCard from "./ThreadCard/threadcard";
import { BoxContext } from "./context";

export default function Box() {
    let box_id = useParams().box_id;
    const [box, setBox] = useState({});
    async function getBox() {
        const response = await instance.get(`/box/${box_id}`);
        if (response.status === 200) {
            setBox(response.data.box);
        }
    }
    useEffect(() => {
        getBox();
    }, []);
    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-8">
                        <div class="d-flex justify-content-between">
                            <h3 class="text-white">{box.name}</h3>
                            <CreateThreadButton box_id={box_id} />
                        </div>
                        {box.threads && box.threads.map((thread) => (
                            <BoxContext.Provider value={{ box, setBox }}>
                                <ThreadCard thread={thread} />
                            </BoxContext.Provider>
                        ))}
                    </div>
                    <div class="col-4">
                        <BoxDescription box={box} />
                    </div>
                </div>
            </div>
        </>
    );
}