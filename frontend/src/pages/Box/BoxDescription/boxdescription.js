export default function ({ box }) {
    return (
        <>
            <div className="card-header fw-bold text-white">About Box</div>
            <div className="card-body text-white">{box.description}</div>
        </>
    );
}