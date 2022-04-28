const { Chain, isDomain } = require("../utils")

function compile_remove(input) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(buildRemovalList, genStmt_remove); 
    return pipeline(input);
}
exports.compile_remove = compile_remove;

function buildRemovalList(input) {
    const { item, schema } = input;
    if (!isDomain(item, schema)) {
        return [item];
    }
    const dependents = schema.paths.filter(p => p.source === item || p.target === item).map(p => p.name);
    return Array.from(new Set([item, ...dependents]));
}

function genStmt_remove(removalList) {
    const dropTableStmts = removalList.map(
        item => `DROP TABLE IF EXISTS ${item} CASCADE;`
    )
    const updateSchema_stmt =`DELETE FROM schema WHERE name IN (${removalList.map(name => `'${name}'`).join(',')});`
    return [...dropTableStmts, updateSchema_stmt];
}
