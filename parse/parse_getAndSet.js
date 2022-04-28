const { parseAssertion } = require("./parseAssertion");
const { parseEquation } = require("./parseEquation");
const { Chain, processArray } = require("../utils");

function parse_getAndSet(input) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(
        parse_where, 
        parse_get, 
        parse_set, 
    );
    return pipeline(input);
}
exports.parse_getAndSet = parse_getAndSet;

function parse_where(input) {
    // parse input.assertion as string into a tree
    const { assertion, schema } = input;
    if (!assertion) {
        return input
    }
    const newAssertion = parseAssertion(assertion, schema);
    if (newAssertion.status === 'error') {
        return newAssertion;
    }
    return {...input, assertion: newAssertion};
}

function parse_get(input) {
    // transform input.compositePaths from array of strings to array of trees
    const { compositePaths, schema } = input;
    if (!compositePaths) {
        return input;
    }
    const parsed = processArray(compositePaths, cp => parseAssertion(cp, schema));
    if (parsed.status === 'error') {
        return parsed;
    }
    return {...input, compositePaths: parsed.data};
}

function parse_set(input) {
    // transform input.equations from array of strings to array of object { name, value }
    const equations = input.equations;
    if (!equations) {
        return input;
    }
    const parsed = processArray(equations, parseEquation);
    if (parsed.status === 'error') {
        return parsed;
    }
    return {...input, equations: parsed.data};
}


// Test code

// node the_next_norm/parse/getAndSet.js

// const input = {
//     assertion: "department => inv(works_in) => born_in => reduce(avg) => filter(> 1984)",
//     compositePaths: ['department']
// }

// console.log(JSON.stringify(parse_getAndSet(input), null, 2));