function parseEquation(string) {
    // INPUT: 'name = value'
    // OUTPUT: { name, value }
    const [ name, value ] = string.split('=').map(s => s.trim());
    if (name && value) {
        return { name, value };
    } else {
        return { status: 'error', data: `Invalid equation: ${string}` };
    }
}
module.exports.parseEquation = parseEquation;