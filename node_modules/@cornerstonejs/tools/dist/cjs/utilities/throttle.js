"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("./debounce"));
const isObject_1 = __importDefault(require("./isObject"));
function throttle(func, wait, options) {
    let leading = true;
    let trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    if ((0, isObject_1.default)(options)) {
        leading = 'leading' in options ? Boolean(options.leading) : leading;
        trailing = 'trailing' in options ? Boolean(options.trailing) : trailing;
    }
    return (0, debounce_1.default)(func, wait, {
        leading,
        trailing,
        maxWait: wait,
    });
}
exports.default = throttle;
//# sourceMappingURL=throttle.js.map