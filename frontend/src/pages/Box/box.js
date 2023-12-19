import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import BoxDescription from "./BoxDescription/boxdescription";

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
                        
                    </div>
                    <div class="col-4">
                        <BoxDescription box={box} />
                    </div>
                </div>
            </div>
        </>
    );
}