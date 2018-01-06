export const div = function(a, f) {
    return a.map(function(e) {
        return e / f;
    });
};

export const addValue = function(a, f) {
    return a.map(function(e) {
        return e + f;
    });
};

export const addArray = function(a, f) {
    return a.map(function(e, i) {
        return e + f[i];
    });
};

export const add = function(a) {
    return Array.prototype.slice
        .call(arguments, 1)
        .reduce(function(result, arg) {
            if (Array.isArray(arg)) {
                result = util.array.addArray(result, arg);
            } else {
                result = util.array.addValue(result, arg);
            }
            return result;
        }, a);
};

export const fromxyz = function(object) {
    return Array.isArray(object) ? object : [object.x, object.y, object.z];
};

export const toxyz = function(a) {
    return {
        x: a[0],
        y: a[1],
        z: a[2]
    };
};

export const first = function(a) {
    return a ? a[0] : undefined;
};

export const last = function(a) {
    return a && a.length > 0 ? a[a.length - 1] : undefined;
};

export const min = function(a) {
    return a.reduce(function(result, value) {
        return value < result ? value : result;
    }, Number.MAX_VALUE);
};

export const range = function(a, b) {
    var result = [];
    for (var i = a; i < b; i++) {
        result.push(i);
    }

    return result;
};
