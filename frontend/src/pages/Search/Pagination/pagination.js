function PreviousPage({ box, page, order, direction }) {
    if (page === 1) {
        return (null);
    }
    return (
        <a href={route(box._id, page - 1, order, direction)} className="rounded-0 border-end btn btn-light">{'<'}</a>
    );
}

function NextPage({ box, page, order, direction }) {
    if (page === parseInt(box.pageCount)) {
        return (null);
    }
    return (
        <a href={route(box._id, page + 1, order, direction)} className="rounded-0 border-start btn btn-light">{'>'}</a>
    );
}

export function Pagination({ box, page, order, direction }) {
    useEffect(() => {
        let pagination = document.getElementById('pagination');
        if (pagination) {
            let children = pagination.children;
            children[0].classList.add('rounded-start-2');
            children[children.length - 1].classList.add('rounded-end-2');
        }
    }, [box]);
    if (box.pageCount == null || box.pageCount === 0) {
        return (null);
    }
    return (
        <div className="d-inline-flex" id="pagination">
            <PreviousPage box={box} page={page} order={order} direction={direction}/>
            <NextPage box={box} page={page} order={order} direction={direction}/>
        </div>
    );
}