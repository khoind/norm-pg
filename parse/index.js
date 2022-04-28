const { parse_define } = require("./parse_define");
const { parse_getAndSet } = require("./parse_getAndSet");
const { parse_remove } = require("./parse_remove");

function parse(input) {
    switch (input.action) {
        case 'define': return parse_define(input);
        case 'remove': return parse_remove(input);
        case 'get': return parse_getAndSet(input);
        case 'set': return parse_getAndSet(input);
        case 'delete': return parse_getAndSet(input);
        case 'add': return parse_getAndSet(input);
        case 'getSchema': return input;
        default: return { status: 'error', data: `invalid action: ${input.action}` };
    }
}
module.exports.parse = parse;


