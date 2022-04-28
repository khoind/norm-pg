const { isDefined } = require("../utils");

function parse_remove(input) {
    const { item, schema } = input;
    if (!isDefined(item, schema)) {
        return { status: 'error', data: `item ${item} is not defined` };
    }
    return input;
}
exports.parse_remove = parse_remove;
