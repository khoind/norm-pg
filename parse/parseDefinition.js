function parseDefinition(string) {
    // INPUT: 'name : source -> target (unique)'
    // OUTPUT: { name, source, target, unique, auto: false }
    const definition = { unique: false, auto: false };
    if (string.includes('unique')) {
        definition.unique = true;
    }
    const [name, source_target] = string // 'name = source => target (unique)'
        .replace('unique', '') // 'name : source => target '
        .split(':') // [ 'name', ' source -> target ' ]
        .map(s => s.trim()); // [ 'name', 'source -> target' ];   
    const [source, target] = source_target // 'source -> target'
        .split('->') // [ 'source ', ' target' ]
        .map(s => s.trim()); // [ 'source', 'target' ]
    if (name && source && target) {
        if (name.includes('*') && target.includes('*')) {
            const [name1, name2] = name.split('*').map(s => s.trim());
            const [target1, target2] = target.split('*').map(s => s.trim());;
            return [ { name: name1, source: source, target: target1, unique: definition.unique, auto: definition.auto }, { name: name2, source: source, target: target2, unique: definition.unique, auto: definition.auto } ];
        }
        return { name, source, target, ...definition };
    } else {
        return { status: 'error', data: `Invalid definition: ${string}` };
    }
}
exports.parseDefinition = parseDefinition;
