const { Chain } = require("../utils");

function compileWhere(query) {
    // INPUT: { primitivePath || subqueries, reverse, mapFn, reduceFn, operator, value, joinMethod } in which `subqueries` is an array of objects with the same structure
    // OUTPUT: string
    const chain = Chain.withCopy('deep').withStatusMessage('on').withLog();
    const pipeline = chain(
        prepareInput,
        makeCTEs,
        makeSelect,
        makeInnerJoins,
        makeGroupBy,
        makeFilter,
        getStatement
    );
    return pipeline(query);
}
module.exports.compileWhere = compileWhere;

const logger = out => console.log(out.statement, '\n');

function prepareInput(query) {
    query.statement = '';
    return query;
}

function makeCTEs(query) {
    const subqueries = query.subqueries;
    if (subqueries.length === 0) {
        return query;
    }
    const ctes = `WITH ` + subqueries.map(subquery => ` ${subquery.name} AS (${compileWhere(subquery)})`).join(', ');
    query.statement = ctes + ' ';
    return query;
}

function makeSelect(query) {
    const { joinMethod, subqueries, reduceFn, mapFn } = query;
    let select = '';
    if (subqueries.length === 0) {
        const { table, source, target }  = query;
        select += `SELECT ${source} AS source, ${target} AS target FROM ${table}`;
    } 
    if (subqueries.length === 1) {
        const [ first ] = subqueries;
        select += `SELECT ${first.name}.source AS source, ${reduceFn}${mapFn}(${first.name}.target) AS target FROM ${first.name}`;
    }
    if (subqueries.length === 2) {
        const [ first, second ] = subqueries;
        if (joinMethod === 'union') {
            select += `SELECT ${first.name}.source AS source FROM ${first.name} UNION SELECT ${second.name}.source AS source FROM ${second.name}`;
        }  
        if (joinMethod === 'source_to_source') {
            select += `SELECT ${first.name}.source AS source, ${second.name}.source AS target FROM ${first.name}`;
        }
        if (joinMethod === 'target_to_source') {
            select += `SELECT ${first.name}.source AS source, ${reduceFn}${mapFn}(${second.name}.target) AS target FROM ${first.name}`;
        }
    }
    query.statement += select + ' ';
    return query;
}

function makeInnerJoins(query) {
    const { joinMethod, subqueries } = query;
    if (subqueries.length <= 1) {
        return query;
    }
    const [ first, second ] = subqueries;
    let innerJoins = ``;
    if (joinMethod === 'source_to_source') {
        innerJoins += ` INNER JOIN ${second.name} ON ${first.name}.source = ${second.name}.source`;
    }
    if (joinMethod === 'target_to_source') {
        innerJoins += ` INNER JOIN ${second.name} ON ${first.name}.target = ${second.name}.source`;
    }
    query.statement += innerJoins + ' ';
    return query;
}

function makeGroupBy(query) {
    const subqueries = query.subqueries;
    if (query.reduceFn === '') {
        return query;
    }
    const { name } = subqueries.length === 0 ? query : subqueries[0];
    const groupBy = ` GROUP BY ${name}.source`;
    query.statement += groupBy + ' ';
    return query;
}

function makeFilter(query) {
    const { operator, subqueries, value, mapFn, reduceFn } = query;
    if (value === '') {
        return query;
    }
    const target = subqueries.length === 0 ? `${query.name}.target` : `${subqueries[subqueries.length - 1].name}.target`;
    let filter = '';
    if (mapFn !== '') {
        filter += ` WHERE ${mapFn}(${target}) ${operator} ${value}`;
    } else if (reduceFn !== '') {
        filter += ` HAVING ${reduceFn}(${target}) ${operator} ${value}`;    
    } else {
        filter += ` WHERE ${target} ${operator} ${value}`;
    } 
    query.statement += filter;
    return query;
}

function getStatement(query) {
    return query.statement
}

