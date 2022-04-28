const {wrapShallowCopy} = require('./wrappers.js');

// ARRAY TOOLS
// beside map(), filter(), reduce(), flatMap()
const dropFirst = wrapShallowCopy(function(arr) {
    arr.shift()
    return arr;
});

const dropLast = wrapShallowCopy(function(arr) {
    arr.pop()
    return arr;
});

const addFirst = wrapShallowCopy(function(arr, item) {
    arr.unshift(item);
    return arr;
});

const addLast = wrapShallowCopy(function(arr, item) {   
    arr.push(item);
    return arr;
});

const updateArray = wrapShallowCopy(function(arr, index, item) {
    arr[index] = item;
    return arr;
});

function pluck(arr, key) {
    return arr.map(obj => obj[key]);
}

function groupBy(arr, fn) {
    return arr.reduce((acc, item) => {
        const key = fn(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
}

function frequency(arr) {
    return arr.reduce((acc, item) => {
        if (!acc[item]) {
            acc[item] = 0;
        }
        acc[item]++;
        return acc;
    }, {});
}

// OBJECT TOOLS
const update = wrapShallowCopy(function(obj, key, value) {
    obj[key] = value;
    return obj;
});

const remove = wrapShallowCopy(function(obj, key) {
    delete obj[key];
    return obj;
});

const add = wrapShallowCopy(function(obj, key, value) {
    obj[key] = value;
    return obj;
});

const merge = wrapShallowCopy(function(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
});

function mapValues(obj, fn) {
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = fn(obj[key]);
        return acc;
    }, {});
}

function filterValues(obj, fn) {
    return Object.keys(obj).reduce((acc, key) => {
        if (fn(obj[key])) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

function pick(obj, keys) {
    return keys.reduce((acc, key) => {
        if (obj[key]) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

function omit(obj, keys) {
    return Object.keys(obj).reduce((acc, key) => {
        if (!keys.includes(key)) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

function updateNested_mutating(data, path, value) {
    if (path.length === 0) {
        return value;
    }
    const key = path[0];
    const remainingPath = path.slice(1);
    if (typeof data[key] === 'undefined') {
        data[key] = {};
    }
    data[key] = updateNested(data[key], remainingPath, value);
    return data;
}

const updateNested = wrapShallowCopy(updateNested_mutating);

module.exports = {
    dropFirst,
    dropLast,
    addFirst,
    addLast,
    updateArray,
    pluck,
    groupBy,
    frequency,
    update,
    remove,
    add,
    merge,
    mapValues,
    filterValues,
    pick,
    omit,
    updateNested
};

