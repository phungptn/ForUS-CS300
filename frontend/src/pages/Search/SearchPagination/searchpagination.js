import { route } from '../route';
import { useEffect } from 'react';

function PreviousPage({ q, type, page, order, direction }) {
    if (page === 1) {
        return (null);
    }
    return (
        <a href={route(q, type, page - 1, order, direction)} className="rounded-0 border-end btn btn-light">{'<'}</a>
    );
}

function NextPage({ result, q, type, page, order, direction }) {
    if (page === parseInt(result.metadata.pageCount)) {
        return (null);
    }
    return (
        <a href={route(q, type, page + 1, order, direction)} className="rounded-0 border-start btn btn-light">{'>'}</a>
    );
}

function NearbyPages({ result, q, type, page, order, direction }) {
    let pageCount = parseInt(result.metadata.pageCount);
    if (pageCount < 4) {
        return (
            <>
                {
                    [...Array(pageCount).keys()].map((i) => (
                        <a href={route(q, type, i + 1, order, direction)} className={"rounded-0 border-start border-end btn btn-light" + (page === i + 1 ? " active" : "")}>{i + 1}</a>
                    ))
                }
            </>
        );
    }
    if (page === pageCount) {
        return (
            <>
                <a href={route(q, type, page - 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 2}</a>
                <a href={route(q, type, page - 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
                <a href={route(q, type, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            </>
        );
    }
    if (page === 1) {
        return (
            <>
                <a href={route(q, type, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
                <a href={route(q, type, page + 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 1}</a>
                <a href={route(q, type, page + 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 2}</a>
            </>
        );
    }
    return (
        <>
            <a href={route(q, type, page - 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
            <a href={route(q, type, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            <a href={route(q, type, page + 1, order, direction)} className={"rounded-0 border-start border-end btn btn-light"}>{page + 1}</a>
        </>
    )
}

function GoToPageForm({ result, q, type, page, order, direction, d }) {
    if (Math.abs(d) < 3 || (Math.abs(d) === 3 && (page === 1 || page === parseInt(result.metadata.pageCount)))) {
        return (null);
    }
    if (d === 3) {
        return (
            <>
                <a href={route(q, type, page - 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 2}</a>
            </>
        );
    }
    if (d === -3) {
        return (
            <>
                <a href={route(q, type, page + 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 2}</a>
            </>
        );
    }
    return (
        <div className="dropdown-center">
            <button className="btn btn-light border-start border-end dropdown rounded-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                ...
            </button>
            <form className="dropdown-menu p-0" onSubmit={(e) => {
                e.preventDefault();
                let newPage = document.getElementById('pageInput').value;
                window.location.href = route(q, type,newPage,order,direction);
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

function GoToPage({ result, q, type, page, order, direction, place }) {
    let d;
    if (place === 'start') {
        d = page - 1;
    }
    else if (place === 'end') {
        d = page - parseInt(result.metadata.pageCount);
    }
    if (Math.abs(d) < 2 || (Math.abs(d) === 2 && (page === 1 || page === parseInt(result.metadata.pageCount)))) {
        return (null);
    }
    if (place === 'start') {
        return (
            <>
                <a href={route(q, type, 1, order, direction)} className="rounded-0 btn btn-light">1</a>
                <GoToPageForm result={result} q={q} type={type} page={page} order={order} direction={direction} d={d}/>
            </>
        );
    }
    else if (place === 'end') {
        return (
            <>
                <GoToPageForm result={result} q={q} type={type} page={page} order={order} direction={direction} d={d} />
                <a href={route(q, type, result.metadata.pageCount, order, direction)} className="rounded-0 btn btn-light">{result.metadata.pageCount}</a>
            </>
        );
    }
    return (null);
}

export function SearchPagination({ result, q, type, page, order, direction }) {
    useEffect(() => {
        let pagination = document.getElementById('pagination');
        if (pagination) {
            let children = pagination.children;
            children[0].classList.add('rounded-start-2');
            children[children.length - 1].classList.add('rounded-end-2');
        }
    }, [result]);
    if (!result.metadata || result.metadata.pageCount == null || result.metadata.pageCount === 0) {
        return (null);
    }
    return (
        <div className="d-inline-flex" id="pagination">
            <PreviousPage q={q} type={type} page={page} order={order} direction={direction}/>
            <GoToPage result={result} q={q} type={type} page={page} order={order} direction={direction} place="start"/>
            <NearbyPages result={result} q={q} type={type} page={page} order={order} direction={direction}/>
            <GoToPage result={result} q={q} type={type} page={page} order={order} direction={direction} place="end"/>
            <NextPage result={result} q={q} type={type} page={page} order={order} direction={direction}/>
        </div>
    );
}