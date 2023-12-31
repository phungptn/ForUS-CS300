export function route(q, type, page, order, direction) {
    let route = '/search';
    if (page) {
        route += `/${page}`;
    }
    else {
        route += '/1';
    }
    route += `?q=${q}`;
    if (type) {
        route += `&type=${type}`;
    }
    if (!Boolean(order)) {
        switch (type) {
            case 'thread':
                order = 'updatedAt';
                break;
            case 'user':
                order = 'username';
                break;
            case 'box':
                order = 'name';
                break;
            default:
                order = '';
                break;
        }
    }
    route += `&order=${order}`;
    if (!Boolean(direction)) {
        direction = 'desc';
    }
    route += `&direction=${direction}`;
    return route;
}