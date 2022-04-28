const builtinDomains = ['integer', 'string', 'boolean', 'float', 'date', 'timestamp'];
exports.builtinDomains = builtinDomains;

const typeMap_postgres = {
    string: 'TEXT',
    integer: 'INTEGER',
    float: 'REAL',
    boolean: 'BOOLEAN',
    date: 'DATE',
    timestamp: 'TIMESTAMP'
}
exports.typeMap_postgres = typeMap_postgres;

comparisonOperators = ['<=', '>=', '!=', '=', '<', '>', 'is', 'is_not', 'like', 'not_like'];
exports.comparisonOperators = comparisonOperators;

const operatorMap_postgres = {
    '<=': '<=',
    '>=': '>=',
    '!=': '!=',
    '=': '=',
    '<': '<',
    '>': '>',
    'is': 'IS',
    'is_not': 'IS NOT',
    'like': 'LIKE',
    'not_like': 'NOT LIKE'
}
exports.operatorMap_postgres = operatorMap_postgres;

const arity = {
    '||': 'binary',
    '&&': 'binary',
    '=>': 'binary',
    reduce: 'unary',
    inv: 'unary',
    filter: 'unary',
    map: 'unary',
    '<=': 'unary', 
    '>=': 'unary',
    '!=': 'unary',
    '=': 'unary',
    '<': 'unary',
    '>': 'unary',
    'between': 'unary',
    'not_between': 'unary',
    'is': 'unary',
    'is_not': 'unary',
    'in': 'unary',
    'not_in': 'unary',
    'like': 'unary',
    'not_like': 'unary'
}
module.exports.arity = arity;

const precedence = {
    '||': 1,
    '&&': 2,
    '=>': 3
}
module.exports.precedence = precedence;

const specialChars = ['(', ')', '<=', '>=', '!=', '=', '<', '>', '&&', '=>', '||'];
module.exports.specialChars = specialChars;

