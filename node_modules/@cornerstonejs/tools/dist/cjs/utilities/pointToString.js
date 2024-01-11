"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointToString = void 0;
function pointToString(point, decimals = 5) {
    return (parseFloat(point[0]).toFixed(decimals) +
        ',' +
        parseFloat(point[1]).toFixed(decimals) +
        ',' +
        parseFloat(point[2]).toFixed(decimals) +
        ',');
}
exports.pointToString = pointToString;
//# sourceMappingURL=pointToString.js.map