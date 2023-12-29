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
    return (
        <div className="container">
            <SearchTypeNavBar />
        </div>
    )
}