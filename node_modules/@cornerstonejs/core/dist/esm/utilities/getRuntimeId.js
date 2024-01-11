const LAST_RUNTIME_ID = Symbol('LastRuntimeId');
const GLOBAL_CONTEXT = {};
const DEFAULT_MAX = 0xffffffff;
const DEFAULT_SEPARATOR = '-';
export default function getRuntimeId(context, separator, max) {
    return getNextRuntimeId(context !== null && typeof context === 'object' ? context : GLOBAL_CONTEXT, LAST_RUNTIME_ID, (typeof max === 'number' && max > 0 ? max : DEFAULT_MAX) >>> 0).join(typeof separator === 'string' ? separator : DEFAULT_SEPARATOR);
}
function getNextRuntimeId(context, symbol, max) {
    let idComponents = context[symbol];
    if (!(idComponents instanceof Array)) {
        idComponents = [0];
        Object.defineProperty(context, symbol, { value: idComponents });
    }
    for (let carry = true, i = 0; carry && i < idComponents.length; ++i) {
        let n = idComponents[i] | 0;
        if (n < max) {
            carry = false;
            n = n + 1;
        }
        else {
            n = 0;
            if (i + 1 === idComponents.length) {
                idComponents.push(0);
            }
        }
        idComponents[i] = n;
    }
    return idComponents;
}
//# sourceMappingURL=getRuntimeId.js.map