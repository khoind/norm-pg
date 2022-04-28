const { isDomain, isPrimitivePath } = require("../utils");

function typeCheck(tree, schema) {
    const { node, first, second } = tree;

    if ( node === 'map' || node === 'reduce' || node === 'filter' ) {
        return { ...tree, source: 'any', target: 'any' };
    }

    if ( isDomain(node, schema) ) {
        return { ...tree, source: node, target: node };
    }

    if ( isPrimitivePath(node, schema) ) {
        const { source, target } = findType(node, schema);
        return { ...tree, source, target };
    }

    if ( !['&&', '||', '=>', 'inv'].includes(node) ) {
        return { status: 'error', data: `domain or path ${node} does not exist` };
    }

    const newFirst = typeCheck(first, schema);
    if ( newFirst.status === 'error' ) {
        return  newFirst;
    }

    if ( node === 'inv' ) {
        return { node, first: newFirst, source: newFirst.target, target: newFirst.source };
    }

    const newSecond = typeCheck(second, schema);
    if ( newSecond.status === 'error' ) {
        return  newSecond;
    }

    if ( node === '&&' || node === '||' ) {
        if ( newFirst.source !== newSecond.source ) {
            return { status: 'error', data: `'&&' and '||' can only operate on paths with the same source domains` };
        }
        return { node, first: newFirst, second: newSecond, source: newFirst.source, target: newFirst.source };
    }

    if ( node === '=>') {
        if ( !composable(newFirst, newSecond) ) {
            return { status: 'error', data: `compose paths with mistmached source and target domains: ${newFirst.source}->${newFirst.target} with ${newSecond.source}->${newSecond.target}` };
        }
        return { node, first: newFirst, second: newSecond, source: newFirst.source, target: newSecond.target === 'any' ? newFirst.target : newSecond.target };
    }

    return { status: 'error', data: `invalid syntax` };
}
exports.typeCheck = typeCheck;

function composable(first, second) {
    if (first.target === second.source || second.source === 'any') {
        return true;
    }
    return false;
}

function findType(path, schema) {
    const { source, target } = schema.paths.find(({ name }) => name === path);
    return { source, target };
}

// test code
// const tree = {"node":"=>","second":{"node":"map","first":{"node":"round"}},"first":{"node":"=>","second":{"node":"reduce","first":{"node":"avg"}},"first":{"node":"=>","second":{"node":"reduce","first":{"node":"sum"}},"first":{"node":"=>","second":{"node":"credit_limit"},"first":{"node":"=>","second":{"node":"inv","first":{"node":"holder"}},"first":{"node":"=>","second":{"node":"_by_"},"first":{"node":"=>","second":{"node":"inv","first":{"node":"_in_"}},"first":{"node":"campaign"}}}}}}}}

// const schema = {
//     domains: [
//       'card',
//       'customer',
//       'participation',
//       'partiticpation',
//       'campaign',
//       'integer',
//       'string',
//       'boolean',
//       'float',
//       'date',
//       'timestamp'
//     ],
//     paths: [
//       { name: 'card', source: 'integer', target: 'card' },
//       { name: 'number', source: 'card', target: 'integer' },
//       { name: 'credit_limit', source: 'card', target: 'integer' },
//       { name: 'rate', source: 'card', target: 'integer' },
//       { name: 'expire', source: 'card', target: 'date' },
//       { name: 'customer', source: 'integer', target: 'customer' },
//       { name: 'holder', source: 'card', target: 'customer' },
//       { name: 'person_name', source: 'customer', target: 'string' },
//       { name: 'birth_year', source: 'customer', target: 'integer' },
//       { name: 'city', source: 'customer', target: 'string' },
//       { name: 'national_id', source: 'customer', target: 'string' },
//       {
//         name: 'participation',
//         source: 'integer',
//         target: 'participation'
//       },
//       { name: 'campaign', source: 'integer', target: 'campaign' },
//       { name: '_by_', source: 'participation', target: 'customer' },
//       { name: '_in_', source: 'partiticpation', target: 'campaign' },
//       { name: 'campaign_name', source: 'campaign', target: 'string' },
//       { name: 'duration', source: 'campaign', target: 'string' }
//     ]
//   };

// const result = typeCheck(tree, schema);
// console.log(JSON.stringify(result, null, 2));






