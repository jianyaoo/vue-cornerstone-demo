import isObject from './isObject';
function debounce(func, wait, options) {
    let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
    let lastInvokeTime = 0;
    let leading = false;
    let maxing = false;
    let trailing = true;
    const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function';
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    wait = Number(wait) || 0;
    if (isObject(options)) {
        leading = Boolean(options.leading);
        maxing = 'maxWait' in options;
        maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    function invokeFunc(time) {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function startTimer(pendingFunc, wait) {
        if (useRAF) {
            return window.requestAnimationFrame(pendingFunc);
        }
        return setTimeout(pendingFunc, wait);
    }
    function cancelTimer(id) {
        if (useRAF) {
            return window.cancelAnimationFrame(id);
        }
        clearTimeout(id);
    }
    function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = startTimer(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        const timeWaiting = wait - timeSinceLastCall;
        return maxing
            ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
            : timeWaiting;
    }
    function shouldInvoke(time) {
        const timeSinceLastCall = time - lastCallTime;
        const timeSinceLastInvoke = time - lastInvokeTime;
        return (lastCallTime === undefined ||
            timeSinceLastCall >= wait ||
            timeSinceLastCall < 0 ||
            (maxing && timeSinceLastInvoke >= maxWait));
    }
    function timerExpired() {
        const time = Date.now();
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        timerId = startTimer(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }
    function pending() {
        return timerId !== undefined;
    }
    function debounced(...args) {
        const time = Date.now();
        const isInvoking = shouldInvoke(time);
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            if (maxing) {
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) {
            timerId = startTimer(timerExpired, wait);
        }
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    return debounced;
}
export default debounce;
//# sourceMappingURL=debounce.js.map