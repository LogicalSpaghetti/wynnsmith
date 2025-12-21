export function objectFind(obj, callback) {
    for (const key in obj)
        if (callback(obj[key], key, obj))
            return obj[key];
}

// credit https://www.xjavascript.com/blog/javascript-filter-for-objects/
export function objectFilter(obj, callback) {
    const result = {};

    for (const key of Object.keys(obj))
        if (callback(obj[key], key, obj))
            result[key] = obj[key];

    return result;
}
