"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToPrecision = void 0;
const constants_1 = require("../constants");
function roundNumber(value, precision = 2) {
    if (Array.isArray(value)) {
        return value.map((v) => roundNumber(v, precision)).join(', ');
    }
    if (value === undefined || value === null || value === '') {
        return 'NaN';
    }
    value = Number(value);
    const absValue = Math.abs(value);
    if (absValue < 0.0001) {
        return `${value}`;
    }
    const fixedPrecision = absValue >= 100
        ? precision - 2
        : absValue >= 10
            ? precision - 1
            : absValue >= 1
                ? precision
                : absValue >= 0.1
                    ? precision + 1
                    : absValue >= 0.01
                        ? precision + 2
                        : absValue >= 0.001
                            ? precision + 3
                            : precision + 4;
    return value.toFixed(fixedPrecision);
}
function roundToPrecision(value) {
    return Math.round(value / constants_1.EPSILON) * constants_1.EPSILON;
}
exports.roundToPrecision = roundToPrecision;
exports.default = roundNumber;
//# sourceMappingURL=roundNumber.js.map