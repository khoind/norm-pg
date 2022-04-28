const { specialChars, arity, precedence, operatorMap_postgres } = require("../dictionary");
const { Chain } = require("../utils");
const { typeCheck } = require("./typeCheck");

function parseAssertion(string, schema) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    function checkAgainstSchema(tree) {
        return typeCheck(tree, schema);
    }
    const pipeline = chain(
        tokenize,
        mapTokensToArity,
        buildSyntaxTree,
        extractTree,
        checkAgainstSchema,
        buildQueryTree
    )
    return pipeline(string);
}
module.exports.parseAssertion = parseAssertion;

function getNextToken(currentString) {
    const string = currentString.trim();
    let token = '';
    if (string.length <= 1) {
        token = string;
        return { next: token, remaining: string.slice(token.length) };
    }
    if (specialChars.includes(string[0] + string[1])) {
        token = string[0] + string[1];
        return { next: token, remaining: string.slice(token.length) };
    }
    if (specialChars.includes(string[0])) {
        token = string[0];
        return { next: token, remaining: string.slice(token.length) };
    }
    for (let i = 0; i < string.length; i++) {
        if (specialChars.join('').includes(string[i])) {
            break;
        }
        if (string[i] === ' ' && !token.includes("'")) {
            break;
        }
        if (string[i] === "'" && token.includes("'")) {
            token += string[i];
            break;
        }
        token += string[i];
    }
    return { next: token, remaining: string.slice(token.length) };
}

function tokenize(string, output = [], operators = []) {
    // shunting-yard algorithm
    try {
        if (string.length === 0) {
            if (operators.includes('(')) { 
                throw new Error('Invalid syntax');
            }
            return [...output, ...operators].reverse();
        }
        const { next, remaining } = getNextToken(string);
        if (arity[next] === 'binary') {
            while (
                operators.length > 0 
                && operators[0] !== '(' 
                && (
                    precedence[next] <= precedence[operators[0]]
                    )
                ) {
                const operator = operators.shift();
                output.push(operator);
            }
            operators.unshift(next);
            return tokenize(remaining, output, operators);
        }
        if (arity[next] === 'unary') {
            operators.unshift(next);
            return tokenize(remaining, output, operators);
        }
        if (next === '(') {
            operators.unshift(next);
            return tokenize(remaining, output, operators);
        }
        if (next === ')') {
            while (operators[0] !== '(') {
                if (operators.length === 0) {
                    throw new Error('Invalid syntax');
                }
                const operator = operators.shift();
                output.push(operator);
            }
            if (operators[0] !== '(') {
                throw new Error('Invalid syntax');
            }
            operators.shift();
            if (operators.length > 0 && arity[operators[0]] === 'unary') {
                output.push(operators.shift());
            }
            return tokenize(remaining, output, operators);
        }
        output.push(next)
        return tokenize(remaining, output, operators);
    }
    catch (error) {
        return { status: 'error', data: error.message };
    }
    
}

function mapTokensToArity(tokens) {
    if (tokens.length === 0) {
        return { status: 'error', message: 'Invalid syntax' };
    }
    return tokens.map(token => {
        if (token in arity) {
            return { value: token, type: arity[token] };
        }
        return { value: token, type: 'id' };
    });
}

function buildSyntaxTree(tokens, tree = { }) {
    if (tokens.length === 0) {
        return tree;
    }
    const token = tokens.shift();
    tree.node = token.value;
    if (token.type === 'binary') { 
        tree.second = buildSyntaxTree(tokens, tree.second).tree; 
        tree.first = buildSyntaxTree(tokens, tree.first).tree;
    }
    if (token.type === 'unary') {
        tree.first = buildSyntaxTree(tokens, tree.first).tree;
    }
    if (token.type === 'id') {
        tree.node = token.value;
    }
    return { tree, tokens };
}

function extractTree({ tree, _ }) {
    return tree;
}

function buildQueryTree(tree, i = '0') {
    // INPUT: syntax tree { node, first, second }
    // OUTPUT: query tree { name, table, source, target, mapFn, reduceFn, joinMethod, operator, value, subqueries }
    const {  node, first, second } = tree;
    if (node === '||') {
        return {
            name: `table${i}`,
            table: `table${i}`,
            source: `table${i}.source`,
            target: `table${i}.target`,
            mapFn: '',
            reduceFn: '',
            operator: '',
            value: '',
            joinMethod: 'union',
            subqueries: [buildQueryTree(first, i + '0'), buildQueryTree(second, i + '1')] 
        }
    }
    if (node === '&&') {
        return {
            name: `table${i}`,
            table: `table${i}`,
            source: `table${i}.source`,
            target: `table${i}.target`,
            mapFn: '',
            reduceFn: '',
            operator: '',
            value: '',
            joinMethod: 'source_to_source',
            subqueries: [buildQueryTree(first, i + '0'), buildQueryTree(second, i + '1')]
        }
    }
    if (node === '=>') {
        const newTree = {
            name: `table${i}`,
            table: `table${i}`,
            source: `table${i}.source`,
            target: `table${i}.target`,
            mapFn: '',
            reduceFn: '',
            operator: '',
            value: '',
            joinMethod: 'target_to_source',
        }
        if (second.node === 'reduce') {
            return {
                ...newTree,
                reduceFn: second.first.node,
                subqueries: [ buildQueryTree(first, i + '0') ]
            }
        }
        if (second.node === 'map') {
            return {
                ...newTree,
                mapFn: second.first.node,
                subqueries: [ buildQueryTree(first, i + '0') ]
            }
        }
        if (second.node === 'filter') {
            return {
                ...newTree,
                operator: operatorMap_postgres[second.first.node],
                value: second.first.first.node,
                subqueries: [ buildQueryTree(first, i + '0') ]
            }
        }
        return {
            ...newTree,
            subqueries: [ buildQueryTree(first, i + '0'), buildQueryTree(second, i + '1') ]
        }
    }
    if (node === 'inv') {
        return {
            name: `table${i}`,
            table: `${first.node}`,
            source: `${first.node}.target`,
            target: `${first.node}.source`,
            mapFn: '',
            reduceFn: '',
            operator: '',
            value: '',
            joinMethod: '',
            subqueries: []
        }
    }
    return {
        name: `table${i}`,
        table: `${node}`,
        source: `${node}.source`,
        target: `${node}.target`,
        mapFn: '',
        reduceFn: '',
        operator: '',
        value: '',
        joinMethod: '',
        subqueries: []
    }
}


