const { builtinDomains, typeMap_postgres } = require("../dictionary");
const { Chain } = require("../utils");

function compile_define(input) {
    // OUTPUT: [ strings ]
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(addTypesAndReferences, genStmt_define);
    return pipeline(input);
}
module.exports.compile_define = compile_define;

// action "define"
function addTypesAndReferences(input) {
    // INPUT: { action, definitions: [ { name, source, target, unique, auto }, ... ]}
    // OUTPUT: { action, definitions: [ { name, source,  target, unique, auto, sourceType, sourceReference, targetType, targetReference }, ... ] }
    const { definitions } = input;
    const newDefinitions = definitions.map(d => {
        if (d.auto) {
            return { ...d, sourceType: 'serial', sourceReference: '', targetType: 'integer', targetReference: '' };
        }
        const [sourceType, targetType] = [d.source, d.target].map(domain => typeMap_postgres[builtinDomains.includes(domain) ? domain : 'integer']);
        const [sourceReference, targetReference] = [d.source, d.target].map(domain => builtinDomains.includes(domain) ? '' : domain);
        return { ...d, sourceType, sourceReference, targetType, targetReference };
    });
    return { action: input.action, definitions: newDefinitions };
}

function genStmt_define(input) {
    // INPUT: { action: 'define', definitions: [ { name, source,  target, unique, auto, sourceType, sourceReference, targetType, targetReference  }, ... ] }
    // OUTPUT:  [ strings ]
    const { definitions } = input;
    // generate one create-table statement per definition
    const createTable_stmts = definitions.map(createTableFromPathDef);
    // Create schema table
    const createSchema_stmt = `CREATE TABLE IF NOT EXISTS schema ( name VARCHAR(255) PRIMARY KEY, source VARCHAR(255), target VARCHAR(255) )`;
    // update the schema table
    const updateSchema_stmt = `INSERT INTO schema (name, source, target) VALUES `
        + definitions.map(d => `('${d.name}', '${d.source}', '${d.target}')`).join(', ')
        + ` ON CONFLICT (name) DO NOTHING`;

    // return the statements
    return [...createTable_stmts, createSchema_stmt, updateSchema_stmt];
}

function createTableFromPathDef(def) {
    // INPUT: { name, source, target, unique, auto, sourceType, sourceReference, targetType, targetReference }
    // OUTPUT: a SQL statement as string
    const { name, unique, auto, sourceType, sourceReference, targetType, targetReference } = def;
    const createTable = `CREATE TABLE IF NOT EXISTS ${name}`;
    const sourceCol = `source ${sourceType} PRIMARY KEY ${sourceReference === '' ? '' : `REFERENCES ${sourceReference} (target) ON DELETE CASCADE`}`;
    const targetCol_part1 = `target ${targetType} ${targetReference === '' ? '' : ` REFERENCES ${targetReference} (source) ON DELETE CASCADE`}`;
    const targetCol_part2 = auto ? `GENERATED ALWAYS AS (source) STORED UNIQUE` : '';
    const targetCol_constraint = unique ? `UNIQUE` : '';
    const stmt = `${createTable} ( ${sourceCol}, ${targetCol_part1} ${targetCol_part2} ${targetCol_constraint} )`;
    return stmt;
}
