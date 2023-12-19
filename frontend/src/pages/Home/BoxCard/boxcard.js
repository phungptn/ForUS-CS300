export default function BoxCard({ box }) {
    return (
        <li class="card-body border-bottom">
            <div className="row">
                <div className="col-10">
                    <a href={`/box/${box._id}`} className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{box.name}</a> 
                </div>
                <div className="col-2">
                    <div className="row">Threads</div>
                    <div className="row">{box.threadCount}</div>
                </div>
            </div>
        </li>
    );
}