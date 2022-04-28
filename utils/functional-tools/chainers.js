const {wrapDeepClone, wrapShallowCopy, wrapStatusCheck, wrapLogger, rename} = require('./wrappers');

// Pass input through successive functions from left to right
function chainSimple(...fns) {
    return fns.reduce((f, g) => (input) => g(f(input)), x => x);
}

// Wrap each function in successive wrappers from left to right then chain them
function chainWithWrappers(...wrappers) {
    return (...fns) => {
        const newFns = fns.map(chainSimple(...wrappers));
        return chainSimple(...newFns);
    };
}

// chaining functions wit options toggles
const Chain = {
    withCopy: (copyOption) => {
        return {
            withStatusMessage: (statusOption) => {
                return {
                    withLog: (logOption) => {
                        const wrappers = [];
                        if (copyOption === 'deep') {wrappers.push(wrapDeepClone)};
                        if (copyOption === 'shallow') {wrappers.push(wrapShallowCopy)};
                        if (statusOption === 'on' || statusOption === true) {wrappers.push(wrapStatusCheck)};
                        if (logOption === 'console') {wrappers.push(wrapLogger((input, name) => console.log(`START ${name} IN\n${JSON.stringify(input)}\n`)))};
                        if (logOption instanceof Function) {wrappers.push(wrapLogger(logOption))};
                        // preserve the name of the function
                        const newWrappers = wrappers.map(wrapper => fn => rename(wrapper(fn), fn.name));
                        return stripStatus(chainWithWrappers(...newWrappers));
                    }
                }
            }
        }
    }
}

// strip the status from the result
function stripStatus(chainFunction) {
    return (...fns) => {
        return (input) => {
            const result = chainFunction(...fns)(input);
            if (result.status === 'error') {
                return result;
            }
            return result.data === undefined ? result : result.data;
        }
        }
    }


module.exports = {
    Chain
};

/* test code here */
