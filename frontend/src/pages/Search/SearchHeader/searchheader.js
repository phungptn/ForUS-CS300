export function SearchHeader({result, q}) {
    if (!result.metadata) {
        return (null);
    }
    return (
        <div className="d-flex align-items-start flex-column">
            <h1>Kết quả tìm kiếm cho "{q}"</h1>
            <h5>{result.metadata.total} kết quả</h5>
        </div>
    );
}