const { builtinDomains } = require('../dictionary');

function extractUserDefinedDomainsFromPathDefinitions(definitions) {
    // INPUT: paths as [ { name, source, target }, ... ]
    // OUTPUT: [domain_name, ...]
    return Array.from(new Set(definitions.map(d => d.source).concat(definitions.map(d => d.target)).filter(d => !builtinDomains.includes(d))));
}
exports.extractUserDefinedDomainsFromPathDefinitions = extractUserDefinedDomainsFromPathDefinitions;

function isDomain(item, schema) {
    if (schema.domains.includes(item)) {
        return true;
    }
    return false;
}
exports.isDomain = isDomain;

function isPrimitivePath(item, schema) {
    if (schema.paths.map(({ name }) => name).includes(item)) {
        return true;
    }
    return false;
}
exports.isPrimitivePath = isPrimitivePath;

function isDefined(item, schema) {
    if (isDomain(item, schema) || isPrimitivePath(item, schema)) {
        return true;
    }
    return false;
}
exports.isDefined = isDefined;