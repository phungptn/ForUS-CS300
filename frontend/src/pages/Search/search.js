import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../api/config";
import { route } from "./route";
import ThreadCard from "../Box/ThreadCard/threadcard";
import { BoxCardSearch } from "../Home/BoxCard/boxcard";
import { BoxContext as SearchContext } from "../Box/context";
import './search.scss';
import { SearchPagination } from "./SearchPagination/searchpagination";
import { SearchHeader } from "./SearchHeader/searchheader";
import { SearchFilter } from "./SearchFilter/searchfilter";

function SearchTypeNavBar({ q, type }) {
    return (
        <ul className="nav nav-pills gap-2">
            <li className="nav-item">
                <a className={"nav-link" + (type === 'thread' ? ' active' : '')} href={type === 'thread' ? '#' : route(q, 'thread')}>Thread</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (type === 'user' ? ' active' : '')} href={type === 'user' ? '#' : route(q, 'user')}>User</a>
            </li>
            <li className="nav-item">
                <a className={"nav-link" + (type === 'box' ? ' active' : '')} href={type === 'box' ? '#' : route(q, 'box')}>Box</a>
            </li>
        </ul>
    );
}

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    let page = useParams().page;
    if (page == null) {
        navigate("/404", { replace: true });
    }
    else {
        page = parseInt(page);
    }
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
                if (page > 1 && page > response.data.result.metadata.pageCount) {
                    navigate(route(q, type, 1, order, direction), { replace: true });
                }
            }
        }
        catch (e) {
            console.log(e);
            navigate("/404", { replace: true });
        }
    }
    useEffect(() => {
        getResult();
    }, [location.key]);
    return (
        <div className="container">
            <SearchHeader result={result} q={q} />
            <div className="mt-2 mb-3">
                <SearchTypeNavBar type={type} q={q} />
            </div>
            <div className="d-flex justify-content-between">
                <SearchPagination result={result} q={q} type={type} page={page} order={order} direction={direction} />
                <SearchFilter result={result} q={q} type={type} page={page} order={order} direction={direction} />
            </div>
            {result.threads && result.threads.map((thread) => (
                <SearchContext.Provider value={{ box: result, setBox: setResult }}>
                    <ThreadCard thread={thread} search={true} />
                </SearchContext.Provider>
            ))}
            {result.boxes && result.boxes.map((box) => (
                <BoxCardSearch box={box} />
            ))}
        </div>
    );
}