const { Pool } = require('pg');
const { builtinDomains } = require('./dictionary');
const { parse } = require("./parse");
const { compile } = require("./compile");
const { Chain, extractUserDefinedDomainsFromPathDefinitions } = require("./utils");

function connect(config) {
    const pool = new Pool(config);
    return {
        query: (text) => pool.query(text),
        // retrieve schema
        getSchema: () => getSchema(pool),
        // define and edit schema
        define: (...definitions) => define(pool, { definitions }),
        remove: (item) => remove(pool, { item }),
        // Command or query
        where: (assertion) => {
            return {
                get: (...compositePaths) => getAndSet('get', pool, { assertion, compositePaths }),
                set: (...equations) => getAndSet('set', pool, { assertion, equations }),
                delete: (item) => getAndSet('delete', pool, { item, assertion })
            }
        },
        add: (item) => {
            return {
                set: (...equations) => getAndSet('add', pool, { item, equations }),
            }
        }
    }
}
exports.connect = connect;

async function getSchema(pool) {
    try {
        const statements = transform({ action: 'getSchema' });
        const result = await fetch(pool, statements);
        if (result.status === 'error') {
            throw new Error(result.data);
        }
        // format the schema into { domains: <array>, paths: <array of {name, source, target}> }
        const paths = result.rows;
        const domains = extractUserDefinedDomainsFromPathDefinitions(paths).concat(builtinDomains);
        return { domains, paths };
    } catch (error) {
        return { status: 'error', data: error };
    }
}

async function define(pool, args) {
    try {
        const result = transform({ action: 'define', ...args });
        if (result.status === 'error') {
            return Promise.reject(result.data);
        }
        return fetch(pool, result); // i/o
    } catch (error) {
        console.log(error);
    }
}

async function remove(pool, args) {
    try {
        const schema = await getSchema(pool); // i/o
        if (schema.status === 'error') {
            return Promise.reject(schema.data)
        }
        const result = transform({ action: 'remove', schema, ...args });
        if (result.status === 'error') {
            return Promise.reject(result.data);
        }
        return fetch(pool, result); // i/o
    } catch (error) {
        console.log(error);
    }
}

async function getAndSet(action, pool, args) {
    try {
        const schema = await getSchema(pool); // i/o
        if (schema.status === 'error') {
            return Promise.reject(schema.data)
        }
        const result = transform({ action, schema, ...args });
        if (result.status === 'error') {
            return Promise.reject(result.data);
        }
        const res = await fetch(pool, result); // i/o
        if (res.status === 'error') {
            return Promise.reject(res.data);
        }
        return res.rows;
    } catch (error) {
        console.log(error);
    }
}

function transform(input) {
    const chain = Chain.withCopy('shallow').withStatusMessage('on').withLog();
    const pipeline = chain(parse, compile);
    return pipeline(input);
}

async function fetch(pool, statements) { // i/o
    try {
        // console.log(statements);
        if (statements instanceof Array) {
            const results = [];
            await pool.query('BEGIN');
            for (stmt of statements) {
                const response = await pool.query(stmt);
                results.push(response);
            }
            await pool.query('COMMIT');
            return results;
        } else {
            return await pool.query(statements);
        }
    } catch (error) {
        return { status: 'error', data: error.message };
    }  
}





