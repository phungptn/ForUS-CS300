export function route(box_id, page, order, direction) {
    const url = page == null ? `/box/${box_id}` : `/box/${box_id}/${page}`;
    if (Boolean(order) && Boolean(direction)) {
        console.log('YES')
        return `${url}?order=${order}&direction=${direction}`;
    }
    return url;
}