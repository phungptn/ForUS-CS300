export function SearchHeader({result, q}) {
    if (!result.metadata) {
        return (null);
    }
    return (
        <div className="d-flex align-items-start flex-column">
            <h3>Kết quả tìm kiếm cho "{q}"</h3>
            <h6>{result.metadata.total} kết quả</h6>
        </div>
    );
}