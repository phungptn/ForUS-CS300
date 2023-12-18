export default function BoxCard({ box }) {
    return (
        <li class="card-body border-bottom">
            <div className="row">
                <div className="col-10">{box.name}</div>
                <div className="col-2">
                    <div className="row">Threads</div>
                    <div className="row">{box.threadCount}</div>
                </div>
            </div>
        </li>
    );
}