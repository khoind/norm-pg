// name an anonymous function
function rename(fn, name) {
    return {
        [name](...args) {
            return fn(...args);
        }
    }[name];
}

// shallow copy the arguments before passing to the function
function wrapShallowCopy(fn) { // fn is a function
    return function(...args) { // if there is an array or an object in the arguments, it will be shallow-copied
        const newArgs = Array.from(args, (arg) => {
            if (arg instanceof Array) {
                return [...arg];
                } 
            if (arg instanceof Object) {
                return {...arg};
            }
            return arg
        });
        return fn(...newArgs);
    }
} 

// deep clone the arguments before passing to the function
function wrapDeepClone(fn) {
    return function(...args) {
        const newArgs = args.map(deepClone);
        const result = fn(...newArgs);
        return deepClone(result);
    }
}

function deepClone(obj) {
    if (obj instanceof Array) {
        const clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]);
        }
        return clone
    }
    if (obj instanceof Object) {
        const clone = {};
        for (let key in obj) {
            clone[key] = deepClone(obj[key]);
        }
        return clone
    }
    return obj;
}

// wrap status check around a function
// if the input is null, undefined, or has status of 'error', return 'error' and the error message
// otherwise, return the result of the function with status 'ok'
function wrapStatusCheck(fn) {
    return function(input) {
        if (input === null || input === undefined) {
            return {status: 'error', data: 'input is null or undefined'};
        }
        if (input.status === 'error') {
            return input;
        }
        const result = input.data === undefined? fn(input) : fn(input.data);
        if (result.status === 'error') {
            return result;
        }
        return {status: 'success', data: result.data === undefined? result : result.data};
    }
}

// Wrap the code in a try-catch block
function wrapTryCatch(fn) {
    return function() {
        try {
            fn();
          } catch (e) {
            console.log(e); // or log to a file or call a logging service
          }
    }
}

// wrap validators
// a validator is a function that takes an input and returns a boolean
function wrapValidators(fn, ...validators) {
    return function(...args) {
        if (validators.some(v => !v(...args))) {
            const v = validators.find(v => !v(...args));
            return {status: 'error', data: `Invalid input: ${v.name} failed`};
        }
        return fn(...args);
    }
}

// wrap status check around an array processor
// the processor operate on each element of the array and return an array of objects with status and data
function wrapArrayProcessor(array, fn) {
    const newArray = array.map(fn);
    if (newArray.some(v => v.status === 'error')) {
        const v = newArray.find(v => v.status === 'error');
        return {status: 'error', data: `Invalid input: ${v.data}`};
    }
    return {status: 'success', data: newArray.map(v => v.data === undefined ? v : v.data)};
}

// Defer execution of the code until a condition is met 
function defer(condition, fn) {
    return function() {
        if (condition) {
            // do something
            fn();
        } else {
            // do something else
        }
    }
}

// simulate a delay
function simulateAsync(fn, ms) {
    return (...args) => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(fn(...args));
        }, ms || Math.random() * 1000);
    });
}

// wrap a logging function
function wrapLogger(logger) {
    return function(fn) {
        return function(input) {
            logger(input, fn.name);
            const output = fn(input);
            return output;
        }
    }
}

module.exports = {
    rename,
    wrapShallowCopy,
    wrapDeepClone,
    wrapStatusCheck,
    wrapTryCatch,
    wrapValidators,
    wrapArrayProcessor,
    defer,
    simulateAsync,
    wrapLogger
}

/* test code here */



