import { instance } from "../../../api/config";
import { useContext, useEffect } from "react";
import './usercontrol.scss';
import { getTimePassed } from "../../../utils/getTimePassed";
// dropdowns will not work without this import
import { Dropdown } from "bootstrap";

function PreviousPage({ thread, page }) {
    if (page === 1) {
        return (null);
    }
    return (
        <a href={`/thread/${thread._id}/${page - 1}`} className="rounded-0 btn btn-light">{'<'}</a>
    );
}

function NextPage({ thread, page }) {
    if (page === parseInt(thread.pageCount)) {
        return (null);
    }
    return (
        <a href={`/thread/${thread._id}/${page + 1}`} className="rounded-0 btn btn-light">{'>'}</a>
    );
}

function NearbyPages({ thread, page }) {
    let pageCount = parseInt(thread.pageCount);
    if (pageCount < 4) {
        return (
            <>
                {
                    [...Array(pageCount).keys()].map((i) => (
                        <a href={`/thread/${thread._id}/${i + 1}`} className={"rounded-0 border-start border-end btn btn-light" + (page === i + 1 ? " active" : "")}>{i + 1}</a>
                    ))
                }
            </>
        );
    }
    if (page === pageCount) {
        return (
            <>
                <a href={`/thread/${thread._id}/${page - 2}`} className="rounded-0 border-start border-end btn btn-light">{page - 2}</a>
                <a href={`/thread/${thread._id}/${page - 1}`} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
                <a href={`/thread/${thread._id}/${page}`} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            </>
        );
    }
    if (page === 1) {
        return (
            <>
                <a href={`/thread/${thread._id}/${page}`} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
                <a href={`/thread/${thread._id}/${page + 1}`} className="rounded-0 border-start border-end btn btn-light">{page + 1}</a>
                <a href={`/thread/${thread._id}/${page + 2}`} className="rounded-0 border-start border-end btn btn-light">{page + 2}</a>
            </>
        );
    }
    return (
        <>
            <a href={`/thread/${thread._id}/${page - 1}`} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
            <a href={`/thread/${thread._id}/${page}`} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            <a href={`/thread/${thread._id}/${page + 1}`} className={"rounded-0 border-start border-end btn btn-light"}>{page + 1}</a>
        </>
    )
}

function GoToPageForm({ thread, page, d }) {
    if (Math.abs(d) < 3 || (Math.abs(d) === 3 && (page === 1 || page === parseInt(thread.pageCount)))) {
        return (null);
    }
    if (d === 3) {
        return (
            <>
                <a href={`/thread/${thread._id}/${page - 2}`} className="rounded-0 btn btn-light">{page - 2}</a>
            </>
        );
    }
    if (d === -3) {
        return (
            <>
                <a href={`/thread/${thread._id}/${page + 2}`} className="rounded-0 btn btn-light">{page + 2}</a>
            </>
        );
    }
    return (
        <div className="dropdown-center">
            <button className="btn btn-light dropdown rounded-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                ...
            </button>
            <form className="dropdown-menu p-0" onSubmit={(e) => {
                e.preventDefault();
                let newPage = document.getElementById('pageInput').value;
                window.location.href = `/thread/${thread._id}/${newPage}`;
            }}>
                <div className="card">
                    <label htmlFor="pageInput" className="card-header form-label text-light bg-primary rounded-top-2">Đi đến</label>
                    <div className="card-body bg-light d-flex rounded-bottom-2">
                        <input type="number" className="form-control bg-light me-2" id="pageInput" style={{width: '80px'}} defaultValue={page}/>
                        <button 
                            type="submit" 
                            className="btn btn-info ms-2 text-light"
                            >OK</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

function GoToPage({ thread, page, place }) {
    let d;
    if (place === 'start') {
        d = page - 1;
    }
    else if (place === 'end') {
        d = page - parseInt(thread.pageCount);
    }
    if (Math.abs(d) < 2 || (Math.abs(d) === 2 && (page === 1 || page === parseInt(thread.pageCount)))) {
        return (null);
    }
    if (place === 'start') {
        return (
            <>
                <a href={`/thread/${thread._id}/1`} className="rounded-0 btn btn-light">1</a>
                <GoToPageForm thread={thread} page={page} d={d}/>
            </>
        );
    }
    else if (place === 'end') {
        return (
            <>
                <GoToPageForm thread={thread} page={page} d={d}/>
                <a href={`/thread/${thread._id}/${thread.pageCount}`} className="rounded-0 btn btn-light">{thread.pageCount}</a>
            </>
        );
    }
    return (null);
}

export function Pagination ({ thread, page }) {
    useEffect(() => {
        let pagination = document.getElementById('pagination');
        if (pagination) {
            let children = pagination.children;
            children[0].classList.add('rounded-start-2');
            children[children.length - 1].classList.add('rounded-end-2');
        }
    }, [thread]);
    if (thread.pageCount == null || thread.pageCount === 0) {
        return (null);
    }
    return (
        <div className="d-inline-flex" id="pagination">
            <PreviousPage thread={thread} page={page}/>
            <GoToPage thread={thread} page={page} place='start'/>
            <NearbyPages thread={thread} page={page}/>
            <GoToPage thread={thread} page={page} place='end'/>
            <NextPage thread={thread} page={page}/>
        </div>
    );
}