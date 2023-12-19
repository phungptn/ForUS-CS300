export default function ({ box }) {
    return (
        <div class="col text-start">
            <div className="card rounded-3 shadow-sm bg-primary">
                <div className="card-header fw-bold text-white">About Box</div>
                <div className="card-body text-white">{box.description}</div>
                <div className="card-footer text-white"></div>
            </div>
        </div>
    );
}