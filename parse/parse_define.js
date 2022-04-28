const { parseDefinition } = require("./parseDefinition");
const { Chain, processArray, extractUserDefinedDomainsFromPathDefinitions } = require("../utils");

// transform input for define schema
function parse_define(input) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(
        parseDefinitionArray,
        addAutoCreatedPaths
    );
    return pipeline(input);
}
exports.parse_define = parse_define;

function parseDefinitionArray(input) {
    // INPUT: { action, definitions: [ 'name: source -> target (unique)', ... ] }
    // OUTPUT: { action, definitions: [ { name, source, target, unique, auto }, ... ] }
    const parsed = processArray(input.definitions, parseDefinition);
    if (parsed.status === 'error') {
        return parsed;
    }
    return { action: input.action, definitions: parsed.data.flat() };
}

function addAutoCreatedPaths(input) {
    // INPUT:  { action, definitions: [ { name, source, target, unique, auto: false }, ... ] }
    // OUTPUT: [ { name, source, target, unique, auto }, ... ]
    const { definitions } = input;
    const domains = extractUserDefinedDomainsFromPathDefinitions(definitions);
    const autoCreatedPaths = domains.map(d => ({ name: d, source: 'integer', target: d, unique: false, auto: true }));
    const newDefinitions = [...autoCreatedPaths, ...definitions];
    return { action: input.action, definitions: newDefinitions };
}

// // test code
// const input = { definitions: [`_by_ * _in_: participation -> employee * project`, `award: employee -> string`] };
// console.log(parse_define(input));