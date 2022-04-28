const tools = require('./functional-tools');

exports.Chain = tools.chainers.Chain;

exports.processArray = tools.wrappers.wrapArrayProcessor;

const { extractUserDefinedDomainsFromPathDefinitions, isDomain, isPrimitivePath, isDefined } = require('./helpers');

exports.extractUserDefinedDomainsFromPathDefinitions = extractUserDefinedDomainsFromPathDefinitions;
exports.isDomain = isDomain;
exports.isPrimitivePath = isPrimitivePath;
exports.isDefined = isDefined;
