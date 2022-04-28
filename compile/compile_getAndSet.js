const { compileWhere } = require("./compileWhere");
const { Chain } = require("../utils");

function compile_getAndSet(input) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(...makePipeline(input.action));
    return pipeline(input);
}
module.exports.compile_getAndSet = compile_getAndSet;

function makePipeline(action) {
    switch (action) {
        case 'add':
            return [ genStmt_add, gentStmt_set, getStatement ];  
        case 'set':
            return [ genStmt_where, gentStmt_set, getStatement ];
        case 'delete': 
            return [ genStmt_where, genStmt_delete, getStatement ];
        case 'get':
            return [ genStmt_where, genStmt_get, getStatement ];
        default:
            return [];
    }
}

function genStmt_add(input) {
    // INPUT: { item, ... }
    // OUTPUT: { ...input, statement }
    const { item } = input;
    // Compose SQL statement
    input.statement = `INSERT INTO ${item} VALUES (DEFAULT) RETURNING target AS source`;
    return input;
}

function gentStmt_set(input) {
    // INPUT: { equations: [{name, value},...],... }, 
    // OUTPUT: { ...input, statement }
    const { equations, action } = input;
    // Compose SQL statemen
    let statement = `WITH found AS (${input.statement})`;
    if (equations.length > 1) {
        statement += `,`;
        const updateCmds = equations.slice(0, equations.length - 1).map(eq => ` ${eq.name}_upd AS (${makeUpdateCmd(eq, action)})`);
        statement += updateCmds.join(',');
    }
    statement += makeUpdateCmd(equations[equations.length - 1], action);
    input.statement = statement;
    return input;
}

function makeUpdateCmd(equation, action) {
    // INPUT: { name, value }
    // OUTPUT: string
    const { name, value } = equation;
    if (value === '_|_') {
        return `DELETE FROM ${name} WHERE source IN (SELECT source FROM found)`;
    }
    return ` INSERT INTO ${name} (source, target) SELECT source, ${value} FROM found ON CONFLICT (source) DO UPDATE SET target = ${value}`;
}

function genStmt_where(input) {
    // INPUT: { assertion, ...}
    // OUTPUT: { ...input, statement }
    const { assertion } = input;
    // Compose SQL statement
    input.statement = compileWhere(assertion);
    return input;
}

function genStmt_delete(input) {
    // INPUT : { item, ...}
    // OUTPUT: { ...input, statement }  
    const { item } = input;
    const statement = `WITH found AS (${input.statement}) DELETE FROM ${item} WHERE source IN (SELECT source FROM found)`;
    return { ...input, statement };
}


function genStmt_get(input) {
    // INPUT: { compositePaths, ...}
    // OUTPUT: { ...input, statement }
    const { compositePaths } = input;
    const queries = compositePaths.map((cp, idx) => {return { name: `q${idx}`, statement: compileWhere(cp) }});
    // Compose SQL statement
    const ctes = `WITH found AS (${input.statement}), ` + queries.map(q => `${q.name} AS (${q.statement})`).join(', ');
    const select = `SELECT found.source AS source, ` + queries.map(q => `${q.name}.target AS ${q.name}`).join(', ');
    const from = `FROM found ` + queries.map(q => `LEFT JOIN ${q.name} ON found.source = ${q.name}.source`).join(' ');
    const statement = `${ctes} ${select} ${from}`;
    return { ...input, statement };
}

function getStatement(input) {
    return input.statement
}
