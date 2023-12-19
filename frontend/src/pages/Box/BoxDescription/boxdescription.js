export default function ({ box }) {
    return (
        <div class="col text-start">
            <div className="card rounded-3 shadow-sm bg-primary">
                <div className="card-body m-3 text-white">{box.description}</div>
            </div>
        </div>
    );
}