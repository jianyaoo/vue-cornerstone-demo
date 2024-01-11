import debounce from './debounce';
import isObject from './isObject';
function throttle(func, wait, options) {
    let leading = true;
    let trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if (isObject(options)) {
        leading = 'leading' in options ? Boolean(options.leading) : leading;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    return debounce(func, wait, {
        leading,
        trailing,
        maxWait: wait,
    });
}
export default throttle;
//# sourceMappingURL=throttle.js.map