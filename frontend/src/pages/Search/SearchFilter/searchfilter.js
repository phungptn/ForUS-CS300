import { route } from "../route";

function OrderOptions({type}) {
    switch (type) {
        case 'thread':
            return (
                <>
                    <option value="title">Tiêu đề</option>
                    <option value="createdAt">Ngày tạo</option>
                    <option value="updatedAt">Ngày cập nhật</option>
                    <option value="score">Điểm</option>
                    <option value="commentCount">Số bình luận</option>
                </>
            );
        case 'box':
            return (
                <>
                    <option value="name">Tên</option>
                </>
            );
        case 'user':
            return (
                <>
                    <option value="username">Tên người dùng</option>
                    <option value="fullname">Tên hiển thị</option>
                </>
            );
        default:
            return (null);
    }
}

export function SearchFilter({ result, q, type, page, order, direction }) {
    if (!result.metadata || result.metadata.pageCount == 0) {
        return (null);
    }
    return (
        <div className="d-flex">
            <div className="btn-group">
                <button className="dropdown-toggle btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="true" data-bs-auto-close="outside" id="filterButton">
                    Lọc
                </button>
                <form className="dropdown-menu dropdown-menu-end p-0" onSubmit={(e) => {
                    e.preventDefault();
                    let newOrder = document.getElementById('sortOption').children[0].value;
                    let newDirection = document.getElementById('sortOption').children[1].value;
                    console.log(order, direction);
                    window.location.href = route(q, type, page, newOrder, newDirection);
                }}>
                    <div className="card">
                        <div className="card-header form-label text-light bg-primary rounded-top-2">Lọc</div>
                        <div className="card-body bg-light rounded-bottom-2 d-flex flex-column gap-2">
                            <label htmlFor="sortOption">Sắp xếp theo</label>
                            <div className="d-flex gap-3" id="sortOption">
                                <select className="form-select bg-light w-auto" id="sortOrder" defaultValue={order}>
                                    <OrderOptions type={type} />
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
        </div>
    )
}