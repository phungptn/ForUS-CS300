import './boxcard.css';

export function BoxCard({ box }) {
    return (
        <li className="card-body border-bottom bg-light">
            <div className="row">
                <div className="col-10 text-start">
                    <a href={`/box/${box._id}`} className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{box.name}</a> 
                </div>
                <div className="col-2 text-dark">
                    <div className="row">Threads</div>
                    <div className="row">{box.threadCount}</div>
                </div>
            </div>
        </li>
    );
}

export function BoxCardSearch({ box }) {
    return (
        <div className="rounded-4 card-style p-4 my-4">
            <div className="row">
                <div className="col-10 text-start">
                    <a href={`/box/${box._id}`} className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{box.name}</a> 
                </div>
                <div className="col-2">
                    <div className="row">Threads</div>
                    <div className="row">{box.threadCount}</div>
                </div>
            </div>
        </div>
    );
}