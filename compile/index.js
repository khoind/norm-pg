const { compile_define } = require("./compile_define");
const { compile_getAndSet } = require("./compile_getAndSet");
const { compile_getSchema } = require("./compile_getSchema");
const { compile_remove } = require("./compile_remove");

function compile(input) {
    switch (input.action) {
        case 'define': return compile_define(input);
        case 'remove': return compile_remove(input);
        case 'get': return compile_getAndSet(input);
        case 'set': return compile_getAndSet(input);
        case 'delete': return compile_getAndSet(input);
        case 'add': return compile_getAndSet(input);
        case 'getSchema': return compile_getSchema(input);
        default: return { status: 'error', data: `invalid action: ${input.action}` };
    }
}
exports.compile = compile;


