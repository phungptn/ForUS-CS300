import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { route } from "./route";
import ThreadCard from "../Box/ThreadCard/threadcard";
import { BoxContext as SearchContext } from "../Box/context";

import './search.scss';

function SearchTypeNavBar({ type }) {
    return (
        <ul className="nav nav-pills gap-2">
            <li className="nav-item">
                <a className={"nav-link" + (type === 'thread' ? ' active' : '')} href="#">Thread</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (type === 'user' ? ' active' : '')} href="#">User</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (type === 'box' ? ' active' : '')} href="#">Box</a>
            </li>
        </ul>
    );
}

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    let box_id = useParams().box_id;
    let page = useParams().page;
    const order = searchParams.get('order');
    const direction = searchParams.get('direction');
    const type = searchParams.get('type');
    const q = searchParams.get('q');
    const [result, setResult] = useState({});
    async function getResult() {
        try {
            const response = await instance.get(route(q, type, page, order, direction));
            if (response.status === 200) {
                setResult(response.data.result);
            }
        }
        catch (e) {
            console.log(e);
            navigate("/404", { replace: true });
        }
    }
    useEffect(() => {
        getResult();
    }, []);
    return (
        <div className="container">
            <SearchTypeNavBar type={type} />
            {result.threads && result.threads.map((thread) => (
                <SearchContext.Provider value={{ box: result, setBox: setResult }}>
                    <ThreadCard thread={thread} search={true} />
                </SearchContext.Provider>   
            ))}
        </div>
    );
}