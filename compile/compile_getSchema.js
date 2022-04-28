// action "get schema"
function compile_getSchema() {
    return `SELECT * FROM schema`;
}
module.exports.compile_getSchema = compile_getSchema;
