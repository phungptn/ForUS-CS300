import { instance } from "../../../api/config";
import { useContext, useEffect, useState } from "react";
import { BoxContext } from "../context";
import './usercontrol.scss';
import { route } from "../route";
import { getTimePassed } from "../../../utils/getTimePassed";
import { downloadImage } from "../../../utils/loadImage";
// dropdowns will not work without this import
import { Dropdown } from "bootstrap";


async function voteThread(box, setBox, thread_id, vote) {
    const response = await instance.put(`/thread/${thread_id}/${vote}`);
    if (response.status === 200) {
        setBox(
            {
                ...box,
                threads: box.threads.map((thread) => {
                    if (thread._id === thread_id) {
                        let d = response.data.voteStatus - thread.voteStatus;
                        thread.voteStatus = response.data.voteStatus;
                        thread.score += d;
                    }
                    return thread;
                })
            }
        );
    }
}

async function TempCreateThread(box_id) {
    const thread = prompt("Enter thread title and body (seperated by ','):");
    if (thread) {
        let [title, body] = thread.split(",");
        console.log(title, body);
        const response = await instance.post(`/box/${box_id}/thread`, { title: title, body: body });
        if (response.status === 201) {
            window.location.reload();
        }
    }
}


export function BoxDescription() {
    const { box } = useContext(BoxContext);
    return (
        <>
            <div className="card-header fw-bold text-white">Về box</div>
            <div className="card-body text-white">{box.description}</div>
        </>
    );
}

export function CreateThreadButton({ box }) {
    if (box.pageCount == null) {
        return (null);
    }
    return (
        <button 
            type="button" 
            className="btn btn-warning"
            onClick={() => TempCreateThread(box._id)}>Tạo thread mới</button>
    );    
}

export function HorizontalVoteBar({ thread }) {
    const { box, setBox } = useContext(BoxContext);
    return (
        <div className="row me-0 rounded-4 border">
            <i 
                className={"col border-0 btn btn-upvote bi " + (thread.voteStatus === 1 ? "bi-arrow-up-circle-fill active" : "bi-arrow-up-circle")}
                onClick={() => voteThread(box, setBox, thread._id, 'upvote')}/>
            <div className="col border-start border-end w-75" style={{paddingBlock: '6px 6px'}}>{thread.score}</div>
            <i 
                className={"col border-0 btn btn-downvote bi " + (thread.voteStatus === -1 ? "bi-arrow-down-circle-fill active" : "bi-arrow-down-circle")}
                onClick={() => voteThread(box, setBox, thread._id, 'downvote')}/>
        </div>
    );
}

export function CommentsCounter({ thread }) {
    return (
        <div className="row rounded-4 border align-middle">
            <span className="my-auto">{thread.commentCount + " comments"}</span>
        </div>
    );
}

export function ThreadInformation({ thread }) {
    const [profilePicture, setProfilePicture] = useState(null);
    useEffect(() => {
        async function getProfilePicture() {
            const url = await downloadImage('images/avatar/' + thread.author.avatarUrl);
            console.log(url);
            setProfilePicture(url);
        }
        getProfilePicture();
    }, []);
    return (
        <div className="d-flex gap-2 p-0">
            <img className="rounded-circle bg-dark my-auto" width={32} height={32} src={
                profilePicture ? profilePicture : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
            } alt="avatar"/>
            <div className="d-flex flex-column justify-content-start">
                <span className="text-white text-start">{thread.author.fullname}</span>
                <small className="text-gray text-start">{getTimePassed(thread.createdAt)}</small>
            </div>
        </div>
    );
}

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

function NearbyPages({ box, page, order, direction }) {
    let pageCount = parseInt(box.pageCount);
    if (pageCount < 4) {
        return (
            <>
                {
                    [...Array(pageCount).keys()].map((i) => (
                        <a href={route(box._id, i + 1, order, direction)} className={"rounded-0 border-start border-end btn btn-light" + (page === i + 1 ? " active" : "")}>{i + 1}</a>
                    ))
                }
            </>
        );
    }
    if (page === pageCount) {
        return (
            <>
                <a href={route(box._id, page - 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 2}</a>
                <a href={route(box._id, page - 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
                <a href={route(box._id, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            </>
        );
    }
    if (page === 1) {
        return (
            <>
                <a href={route(box._id, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
                <a href={route(box._id, page + 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 1}</a>
                <a href={route(box._id, page + 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 2}</a>
            </>
        );
    }
    return (
        <>
            <a href={route(box._id, page - 1, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 1}</a>
            <a href={route(box._id, page, order, direction)} className={"rounded-0 border-start border-end btn btn-light active"}>{page}</a>
            <a href={route(box._id, page + 1, order, direction)} className={"rounded-0 border-start border-end btn btn-light"}>{page + 1}</a>
        </>
    )
}

function GoToPageForm({ box, page, order, direction, d }) {
    if (Math.abs(d) < 3 || (Math.abs(d) === 3 && (page === 1 || page === parseInt(box.pageCount)))) {
        return (null);
    }
    if (d === 3) {
        return (
            <>
                <a href={route(box._id, page - 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page - 2}</a>
            </>
        );
    }
    if (d === -3) {
        return (
            <>
                <a href={route(box._id, page + 2, order, direction)} className="rounded-0 border-start border-end btn btn-light">{page + 2}</a>
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
                window.location.href = route(box._id,newPage,order,direction);
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

function GoToPage({ box, page, order, direction, place }) {
    let d;
    if (place === 'start') {
        d = page - 1;
    }
    else if (place === 'end') {
        d = page - parseInt(box.pageCount);
    }
    if (Math.abs(d) < 2 || (Math.abs(d) === 2 && (page === 1 || page === parseInt(box.pageCount)))) {
        return (null);
    }
    if (place === 'start') {
        return (
            <>
                <a href={route(box._id, 1, order, direction)} className="rounded-0 btn btn-light">1</a>
                <GoToPageForm box={box} page={page} order={order} direction={direction} d={d}/>
            </>
        );
    }
    else if (place === 'end') {
        return (
            <>
                <GoToPageForm box={box} page={page} order={order} direction={direction} d={d}/>
                <a href={route(box._id, box.pageCount, order, direction)} className="rounded-0 btn btn-light">{box.pageCount}</a>
            </>
        );
    }
    return (null);
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
            <GoToPage box={box} page={page} order={order} direction={direction} place='start'/>
            <NearbyPages box={box} page={page} order={order} direction={direction}/>
            <GoToPage box={box} page={page} order={order} direction={direction} place='end'/>
            <NextPage box={box} page={page} order={order} direction={direction}/>
        </div>
    );
}

function RemoveFilterButton({ box, page, is_filtered }) {
    if (!is_filtered) {
        return (null);
    }
    return (
        <a href={route(box._id, page)} className="btn btn-danger rounded-start-0"><i className="bi bi-x-lg"/></a>
    );
}

export function ThreadFilter({ box, page, order, direction }) {
    let is_filtered = Boolean(order) && Boolean(direction);
    if (!Boolean(order)) {
        order = 'updatedAt';
    }
    if (!Boolean(direction)) {
        direction = 'desc';
    }
    if (box.pageCount == 0) {
        return (null);
    }
    return (
        <div className="d-flex">
            <div className="btn-group">
                <button className={"dropdown-toggle btn " + (is_filtered ? "btn-info text-light rounded-end-0" : "btn-light")} type="button" data-bs-toggle="dropdown" aria-expanded="true" data-bs-auto-close="outside" id="filterButton">
                    Lọc
                </button>
                <form className="dropdown-menu dropdown-menu-end p-0" onSubmit={(e) => {
                    e.preventDefault();
                    let newOrder = document.getElementById('sortOption').children[0].value;
                    let newDirection = document.getElementById('sortOption').children[1].value;
                    console.log(order, direction);
                    window.location.href = route(box._id, page, newOrder, newDirection);
                }}>
                    <div className="card">
                        <div className="card-header form-label text-light bg-primary rounded-top-2">Lọc</div>
                        <div className="card-body bg-light rounded-bottom-2 d-flex flex-column gap-2">
                            <label htmlFor="sortOption">Sắp xếp theo</label>
                            <div className="d-flex gap-3" id="sortOption">
                                <select className="form-select bg-light w-auto" id="sortOrder" defaultValue={order}>
                                    <option value="updatedAt">Thời gian cập nhật</option>
                                    <option value="createdAt">Thời gian đăng</option>
                                    <option value="score">Số điểm</option>
                                    <option value="commentCount">Bình luận</option>
                                    <option value="title">Tựa đề</option>
                                </select>
                                <select className="form-select bg-light w-auto" id="sortDirection" defaultValue={direction}>
                                    <option value="asc">Thấp đến cao</option>
                                    <option value="desc">Cao đến thấp</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-info text-light align-self-end"
                                >OK</button>
                        </div>
                    </div>
                </form>
            </div>
            <RemoveFilterButton box={box} page={page} is_filtered={is_filtered}/>
        </div>
    )
}